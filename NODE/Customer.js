require("dotenv").config();          // ← load .env first
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const transporter = require("./mailer");

const FROM_ADDRESS = `"${process.env.MAIL_FROM_NAME || 'AARYA AUTO GARAGE'}" <${process.env.MAIL_FROM_ADDRESS || 'aaryaautogarage@gmail.com'}>`;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Cloudinary Configuration
const { v2: cloudinary } = require('cloudinary');
const multer = require('multer');

cloudinary.config({ 
    cloud_name: 'ji14ydop', 
    api_key: '742681517725688', 
    api_secret: 'WsLAwb0RW0rcMdXEnO_E_Hsl9-8'
});

const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
    }

    const stream = cloudinary.uploader.upload_stream(
        { folder: 'spare-parts' },
        (error, result) => {
            if (error) {
                console.error("Cloudinary Upload Error:", error);
                return res.status(500).json({ message: "Upload failed" });
            }
            res.json({ image: result.secure_url });
        }
    );

    stream.end(req.file.buffer);
});

// Database connection
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "finalproject",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : undefined
}).promise();

console.log("Database connected successfully");

// Mount spare parts routes
const sparePartRoutes = require("./spare_part");
app.use("/", sparePartRoutes(db));

const OpenAI = require("openai");

// OpenAI / OpenRouter client — used ONLY for the /chat-gpt opt-in route
const openAiClient = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Aarya Auto Garage Chatbot",
    },
});

// =============================================
// AARYA BOT — Local Business Chatbot (No External API)
// Keyword → Intent → DB Query → Human-sounding Reply
// =============================================

// ---------- small helpers ----------

// Pick a random item from an array
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Occasionally prepend a light conversational filler (kept subtle, not spammy)
function maybeFiller(chance = 0.35) {
    const fillers = ["Sure thing — ", "Okay! ", "Got it — ", "Alright, ", "No problem — ", ""];
    return Math.random() < chance ? pick(fillers.filter(f => f !== "")) : "";
}

// Normalise incoming text
function normalise(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
}

// ---------- intent detection ----------

function detectIntent(msg) {
    // Small talk first, so it doesn't get swallowed by keyword ladders below
    if (/\b(how are you|how r u|how're you|hows it going|how is it going)\b/.test(msg)) return "how_are_you";
    if (/\b(who are you|what are you|are you a bot|are you human|are you real)\b/.test(msg)) return "who_are_you";
    if (/\b(lol|haha|hehe|nice one|funny|good bot|smart bot)\b/.test(msg)) return "small_talk";
    if (/\b(good bot|you are helpful|you are great|amazing|awesome bot|love this|well done)\b/.test(msg)) return "compliment";
    if (/\b(bad bot|useless|stupid bot|not helpful|you suck)\b/.test(msg)) return "complaint";

    // ── Greetings ──────────────────────────────────────────────
    if (/\b(hi|hello|hey|good morning|good evening|good afternoon|namaste)\b/.test(msg)) return "greeting";

    // ── Shop / Hours / Location ────────────────────────────────
    if (/\b(open|close|timing|hour|when|time|schedule|working)\b/.test(msg)) return "hours";
    if (/\b(address|location|where|find you|visit|shop|garage|near)\b/.test(msg)) return "location";
    if (/\b(contact|phone|call|whatsapp|number|email|reach)\b/.test(msg)) return "contact";

    // ── Spare Part Queries ─────────────────────────────────────
    if (/\b(part|parts|spare|sparepart|component|item|product)\b/.test(msg)) return "parts_general";
    if (/\b(engine|piston|valve|cylinder|crankshaft|camshaft)\b/.test(msg)) return "parts_search";
    if (/\b(brake|disc|drum|pad|caliper|shoe)\b/.test(msg)) return "parts_search";
    if (/\b(chain|sprocket|gear|clutch|transmission|gearbox)\b/.test(msg)) return "parts_search";
    if (/\b(tyre|tire|tube|wheel|rim|alloy)\b/.test(msg)) return "parts_search";
    if (/\b(battery|electrical|wiring|bulb|light|indicator|headlight|tail)\b/.test(msg)) return "parts_search";
    if (/\b(filter|air filter|oil filter|fuel filter)\b/.test(msg)) return "parts_search";
    if (/\b(suspension|shock|fork|absorber|spring)\b/.test(msg)) return "parts_search";
    if (/\b(mirror|seat|handle|grip|lever|pedal|exhaust|silencer|muffler)\b/.test(msg)) return "parts_search";
    if (/\b(oil|lubricant|coolant|fluid|grease)\b/.test(msg)) return "parts_search";

    // ── Brand / Bike Model ─────────────────────────────────────
    if (/\b(hero|honda|bajaj|tvs|yamaha|suzuki|royal enfield|ktm|kawasaki|jawa|triumph|splendor|pulsar|apache|fz|bullet|duke|classic|meteor|thunderbird|activa|dio|access|ntorq|jupiter|pleasure|platina)\b/.test(msg)) return "brand_search";

    // ── Price / Cost ───────────────────────────────────────────
    if (/\b(price|cost|rate|charge|how much|expensive|cheap|affordable|budget)\b/.test(msg)) return "price_query";

    // ── Stock / Availability ───────────────────────────────────
    if (/\b(stock|available|availability|in stock|out of stock|left|remaining)\b/.test(msg)) return "stock_query";

    // ── Services ───────────────────────────────────────────────
    if (/\b(service|repair|fix|mechanic|maintenance|overhaul|tune|wash|check)\b/.test(msg)) return "services";

    // ── Cart / Order ───────────────────────────────────────────
    if (/\b(cart|order|buy|purchase|booking|add|checkout)\b/.test(msg)) return "cart_order";

    // ── Categories ─────────────────────────────────────────────
    if (/\b(categor|list all|show all|what do you|what parts|which parts)\b/.test(msg)) return "categories";

    // ── Thanks / Bye ───────────────────────────────────────────
    if (/\b(thank|thanks|bye|goodbye|see you|good night|great|awesome|perfect|ok|okay)\b/.test(msg)) return "farewell";

    return "unknown";
}

// Extract keywords useful for DB searching
function extractSearchTerms(msg) {
    const stopWords = ["do", "you", "have", "for", "a", "the", "is", "in", "of", "me", "i", "my", "any", "part", "parts", "spare", "looking", "want", "need", "bike", "motorcycle", "get", "show", "tell", "give", "please", "can", "could", "would", "what", "how", "its", "will", "are", "our"];
    return msg.split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w));
}

// Format DB rows into a readable, slightly conversational list
function formatParts(parts) {
    if (!parts || parts.length === 0) return null;
    return parts.map(p => {
        const stockStr = p.stock_quantity > 0
            ? `${p.stock_quantity} in stock`
            : `out of stock right now, but we can source it`;
        return `• **${p.part_name}** (${p.brand}) — ${p.categories}, ₹${Number(p.price).toLocaleString("en-IN")}, ${stockStr}`;
    }).join("\n");
}

// Detect what part type the user is asking about (for natural follow-up questions)
function getPartLabel(msg) {
    if (/\b(chain|sprocket)\b/.test(msg)) return { label: "chain sprocket", followUp: "what's the sprocket tooth count (like 40T or 42T) and your bike's model year? That'll help me match the exact size." };
    if (/\b(brake|pad|disc|drum|shoe)\b/.test(msg)) return { label: "brake part", followUp: "does your bike use disc brakes or drum brakes, and what year is it?" };
    if (/\b(tyre|tire|tube)\b/.test(msg)) return { label: "tyre/tube", followUp: "the tyre size (like 90/90-17) and whether you need tubeless or tube-type?" };
    if (/\b(battery)\b/.test(msg)) return { label: "battery", followUp: "your bike's CC (100cc, 150cc, 200cc...) and model year? Battery specs vary a bit by model." };
    if (/\b(filter)\b/.test(msg)) return { label: "filter", followUp: "whether you need an air filter, oil filter, or fuel filter, plus your bike's model year?" };
    if (/\b(clutch)\b/.test(msg)) return { label: "clutch part", followUp: "the clutch plate count or your bike's model year?" };
    if (/\b(engine|piston|valve)\b/.test(msg)) return { label: "engine part", followUp: "your bike's exact model and year (e.g. Pulsar 150, 2022)? Engine parts are pretty model-specific." };
    if (/\b(suspension|shock|fork)\b/.test(msg)) return { label: "suspension part", followUp: "is it for the front fork or rear shock, and what year's your bike?" };
    if (/\b(light|bulb|indicator|headlight)\b/.test(msg)) return { label: "electrical part", followUp: "LED or halogen, and your bike's model and year?" };
    if (/\b(oil|lubricant)\b/.test(msg)) return { label: "oil/lubricant", followUp: "your engine's CC? That decides the right oil grade." };
    return { label: "part", followUp: "a bit more detail — the specific size or variant — so I can dig through our inventory properly?" };
}

// Warm, varied opener depending on whether we actually found stock
function warmOpener(found, label, brandName) {
    const brand = brandName ? ` for ${brandName}` : "";
    if (found) {
        return pick([
            `Good news, we've got ${label}${brand} in stock. Here's what's available:`,
            `Yep, we carry ${label}${brand} — here's what I'm seeing right now:`,
            `We do have ${label}${brand}. Take a look:`,
            `Found a few options for ${label}${brand}:`,
        ]);
    }
    return pick([
        `We don't have that exact listing pulled up, but we can definitely source ${label}${brand} for you.`,
        `Nothing's showing in the system for ${label}${brand} right this second, but we deal with these often and can get one in.`,
        `We can arrange ${label}${brand} — just need a couple more details to make sure it's the right fit.`,
    ]);
}

// ---------- reply templates for the fixed-answer intents ----------

const TEMPLATES = {
    greeting: [
        "Hey there! 👋 Welcome to Aarya Auto Garage. Are you looking for a spare part, checking on a service, or just have a quick question?",
        "Hi! Good to hear from you. What can I help you with today — parts, pricing, or maybe our shop hours?",
        "Hello! This is Aarya Bot from Aarya Auto Garage. Tell me what you need and I'll do my best to sort it out.",
    ],
    hours: [
        "We're open Monday to Saturday, 9 AM to 8 PM, and Sunday 10 AM to 5 PM. We stay open through most public holidays too, so feel free to swing by.",
        "Our timings are 9–8 on weekdays and Saturday, and a bit shorter on Sunday — 10 to 5. Come by whenever suits you.",
    ],
    location: [
        "We're at Aarya Auto Garage, Solankur, Radhanagari, Maharashtra. Just search \"Aarya Auto Garage\" on Google Maps and it'll take you right there.",
        "You'll find us in Solankur, Radhanagari, Maharashtra. Easiest way is searching us by name on Maps.",
    ],
    contact: [
        "You can reach us on +91 8600281001, call or WhatsApp — whichever's easier. Or drop a mail at aarya.garage@gmail.com.",
        "Best way is a call or WhatsApp to +91 8600281001. Email works too: aarya.garage@gmail.com.",
    ],
    services: [
        "We handle pretty much everything — engine overhauls, brake and clutch work, electrical and wiring issues, tyre and wheel alignment, general servicing and oil changes, suspension repair, exhaust work, battery replacement, and of course spare parts across all brands. Bring the bike in or give us a call to book a slot.",
    ],
    cart_order: [
        "Easiest way — go to the Customer Home page, search for the part, hit Add to Cart, then check out from your cart when you're ready. If you tell me what part you're after, I can check availability for you right now too.",
    ],
    farewell: [
        "Thanks for stopping by! Ride safe, and come back anytime you need parts or service. 🏍️",
        "Anytime! Take care and safe riding.",
        "You're welcome — happy to help whenever you need us again.",
    ],
    how_are_you: [
        "Doing well, thanks for asking! Busy day at the garage as always. What can I help you with?",
        "All good here! What brings you by today — parts, service, or something else?",
    ],
    who_are_you: [
        "I'm Aarya Bot — a chat assistant for Aarya Auto Garage. I can look up spare parts, prices, stock, hours, and our services for you. For anything more involved, our team's just a call away at +91 8600281001.",
    ],
    small_talk: [
        "Haha, glad that landed. Anyway, what can I actually help you with today?",
        "😄 Alright, back to business — parts, pricing, or something else?",
    ],
    compliment: [
        "That's kind of you to say — thanks! Let me know if there's anything else you need.",
        "Appreciate that! Happy to help with anything else too.",
    ],
    complaint: [
        "Sorry that wasn't useful — I'm still a fairly simple bot. If I'm not getting it right, give the shop a direct call at +91 8600281001 and the team will sort you out properly.",
    ],
    unknown: [
        "Hmm, not sure I caught that one. I'm best with questions about spare parts, prices, stock, our hours, location, or services — try rephrasing, or just call us at +91 8600281001 and we'll help directly.",
        "I might be missing the point here — could you rephrase that? Or if it's urgent, +91 8600281001 gets you straight to the team.",
    ],
};

// ---------- MAIN BUSINESS CHATBOT ENDPOINT ----------

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || !message.trim()) {
            return res.status(400).json({ reply: "Type something and I'll take a look! 🙂" });
        }

        const msg = normalise(message);
        const intent = detectIntent(msg);
        let reply = "";

        // ── Fixed-answer intents: pull a random human-sounding variant ──
        if (TEMPLATES[intent] && ![
            "brand_search", "parts_search", "parts_general",
            "price_query", "stock_query", "categories"
        ].includes(intent)) {
            reply = pick(TEMPLATES[intent]);
        }

        // ── Brand / Bike Model Search ─────────────────────────
        else if (intent === "brand_search") {
            const brandKeywords = ["hero", "honda", "bajaj", "tvs", "yamaha", "suzuki", "royal enfield", "ktm", "kawasaki", "jawa", "triumph",
                "splendor", "pulsar", "apache", "fz", "bullet", "duke", "classic", "meteor", "thunderbird", "activa", "dio", "access", "ntorq", "jupiter", "pleasure", "platina"];
            const foundBrands = brandKeywords.filter(b => msg.includes(b));
            const { label, followUp } = getPartLabel(msg);
            const brandDisplay = foundBrands.map(b => b.charAt(0).toUpperCase() + b.slice(1)).join(" / ");

            if (foundBrands.length > 0) {
                const brandQuery = foundBrands.map(() => "brand LIKE ? OR part_name LIKE ?").join(" OR ");
                const brandParams = foundBrands.flatMap(b => [`%${b}%`, `%${b}%`]);
                const [parts] = await db.query(
                    `SELECT part_name, brand, categories, price, stock_quantity FROM spare_parts WHERE ${brandQuery} ORDER BY stock_quantity DESC, price ASC LIMIT 10`,
                    brandParams
                );
                const formatted = formatParts(parts);
                if (formatted) {
                    reply = `${warmOpener(true, label, brandDisplay)}\n\n${formatted}\n\nOne more thing — ${followUp}\n\nOr just call +91 8600281001 and we'll take it from there.`;
                } else {
                    reply = `${warmOpener(false, label, brandDisplay)} Could you tell me ${followUp}\n\nOnce I know that, we'll check stock properly and get back to you. Or ring us directly at +91 8600281001.`;
                }
            } else {
                reply = "Which bike brand or model is this for? Something like \"Honda Activa parts\" or \"Bajaj Pulsar brake pads\" works great.";
            }
        }

        // ── Generic Parts Search ────────────────────────────────
        else if (intent === "parts_search" || intent === "parts_general") {
            const terms = extractSearchTerms(msg);
            const { label, followUp } = getPartLabel(msg);

            if (terms.length === 0) {
                reply = pick([
                    "Sure — could you be a bit more specific? Something like \"Pulsar 150 brake pads\" or \"Honda Activa air filter price\" helps me search properly.",
                    "Happy to check! What part exactly, and for which bike?",
                ]);
            } else {
                const conditions = terms.map(() => "part_name LIKE ? OR brand LIKE ? OR categories LIKE ?").join(" OR ");
                const params = terms.flatMap(t => [`%${t}%`, `%${t}%`, `%${t}%`]);
                const [parts] = await db.query(
                    `SELECT part_name, brand, categories, price, stock_quantity FROM spare_parts WHERE ${conditions} ORDER BY stock_quantity DESC LIMIT 8`,
                    params
                );
                const formatted = formatParts(parts);
                if (formatted) {
                    reply = `${warmOpener(true, label, null)}\n\n${formatted}\n\nAlso, ${followUp}\n\nOr swing by the shop / call +91 8600281001 if that's easier.`;
                } else {
                    reply = `${warmOpener(false, label, null)} Could you share ${followUp}\n\nOnce I have that we'll confirm stock right away. Or just call +91 8600281001.`;
                }
            }
        }

        // ── Price Query ───────────────────────────────────────
        else if (intent === "price_query") {
            const terms = extractSearchTerms(msg);
            const { label } = getPartLabel(msg);
            if (terms.length === 0) {
                reply = "Sure, which part are you asking about? Something like \"price of Pulsar 150 brake pad\" works well.";
            } else {
                const conditions = terms.map(() => "part_name LIKE ? OR brand LIKE ? OR categories LIKE ?").join(" OR ");
                const params = terms.flatMap(t => [`%${t}%`, `%${t}%`, `%${t}%`]);
                const [parts] = await db.query(
                    `SELECT part_name, brand, categories, price, stock_quantity FROM spare_parts WHERE ${conditions} ORDER BY price ASC LIMIT 6`,
                    params
                );
                const formatted = formatParts(parts);
                if (formatted) {
                    reply = `${maybeFiller()}here's what ${label} is running at right now:\n\n${formatted}\n\nPrices include tax. For bulk orders, call +91 8600281001 and we can talk discounts.`;
                } else {
                    reply = `We can definitely get you ${label} and a fair price on it — just not showing in the system at this exact moment. Call +91 8600281001 or drop by and we'll quote you directly.`;
                }
            }
        }

        // ── Stock / Availability Query ─────────────────────────
        else if (intent === "stock_query") {
            const terms = extractSearchTerms(msg);
            const { label, followUp } = getPartLabel(msg);
            if (terms.length === 0) {
                reply = "Which part do you want me to check? E.g. \"is Honda Activa air filter available\".";
            } else {
                const conditions = terms.map(() => "part_name LIKE ? OR brand LIKE ? OR categories LIKE ?").join(" OR ");
                const params = terms.flatMap(t => [`%${t}%`, `%${t}%`, `%${t}%`]);
                const [parts] = await db.query(
                    `SELECT part_name, brand, categories, price, stock_quantity FROM spare_parts WHERE ${conditions} LIMIT 6`,
                    params
                );
                const formatted = formatParts(parts);
                if (formatted) {
                    reply = `${maybeFiller()}here's the availability on ${label}:\n\n${formatted}\n\nOne thing that'd help — ${followUp}\n\nCall +91 8600281001 whenever you're ready to order.`;
                } else {
                    reply = `We stock ${label} and can get it in for you. Mind sharing ${followUp}\n\nOnce I know that we'll confirm right away — or call +91 8600281001.`;
                }
            }
        }

        // ── Categories ────────────────────────────────────────
        else if (intent === "categories") {
            const [cats] = await db.query("SELECT DISTINCT categories, COUNT(*) as cnt FROM spare_parts GROUP BY categories ORDER BY cnt DESC");
            if (cats.length > 0) {
                const catList = cats.map(c => `• ${c.categories} (${c.cnt} parts)`).join("\n");
                reply = `${maybeFiller()}here's what we stock, category-wise:\n\n${catList}\n\nAsk me about any of these and I'll dig deeper.`;
            } else {
                reply = "Our inventory's being updated right now — check back shortly, or call us for the latest list.";
            }
        }

        else {
            reply = pick(TEMPLATES.unknown);
        }

        res.json({ reply });

    } catch (error) {
        console.log("Aarya Bot Error Stack:", error.stack || error);
        res.status(500).json({ reply: "Ah, something went wrong on my end. Mind trying again? Or just call us directly at +91 98765 43210." });
    }
});

// =============================================
// GPT-OSS ROUTE — External AI (opt-in only)
// Customer must explicitly switch to this mode
// =============================================
app.post("/chat-gpt", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ reply: "Message is required." });
        }

        const response = await openAiClient.chat.completions.create({
            model: "openai/gpt-oss-20b:free",
            messages: [
                {
                    role: "system",
                    content: "You are an intelligent customer support assistant for Aarya Auto Garage, a two-wheeler spare parts shop and repair garage. Help users with questions about bike spare parts, automotive repairs, bike models, garage services, and related topics. Be polite, helpful, and concise."
                },
                { role: "user", content: message }
            ],
        });

        const reply = response.choices?.[0]?.message?.content || "No response received.";
        res.json({ reply });

    } catch (error) {
        console.error("GPT-OSS Error:", error?.message || error);
        res.status(500).json({
            reply: "⚠️ AI Assistant is currently unavailable. Please try **Aarya Bot** mode or contact us at +91 98765 43210.",
        });
    }
});

// =============================================
// REGISTER & LOGIN APIs (using customers table for auth)
// =============================================

// Register API
app.post("/register", async (req, res) => {

    try {
        const { name, email, password } = req.body;

        const checksql = "SELECT * FROM customers WHERE email=?";
        const [data] = await db.query(checksql, [email]);

        if (data.length > 0) {
            return res.json({
                message: "This email already exists !!"
            })
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO customers(name,email,password) VALUES(?,?,?)";
        await db.query(sql, [name, email, hashedPassword]);

        try {
            await transporter.sendMail({
                from: FROM_ADDRESS,
                to: email,
                subject: "🎉 Welcome to Aarya Auto Garage — Your Account is Ready!",
                html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
                    <body style="margin:0;padding:0;background-color:#EEF2F7;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#EEF2F7;padding:30px 0;">
                            <tr><td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">
                                    <!-- HEADER -->
                                    <tr><td style="background:linear-gradient(145deg,#0F172A 0%,#1E293B 60%,#0F172A 100%);padding:48px 40px 36px;text-align:center;border-bottom:4px solid #E84A2F;">
                                        <img src="https://res.cloudinary.com/ji14ydop/image/upload/v1786474190/spare-parts/cofw2n9l05u57enk4aev.png" alt="Logo" width="72" height="72" style="border-radius:50%;border:3px solid rgba(232,74,47,0.5);margin-bottom:18px;display:block;margin-left:auto;margin-right:auto;"/>
                                        <h1 style="color:#FFFFFF;margin:0 0 6px;font-size:26px;font-weight:800;letter-spacing:-0.5px;">Aarya Auto Garage</h1>
                                        <p style="color:#FF6B35;margin:0;font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;">Premium Spare Parts &amp; Services</p>
                                    </td></tr>
                                    <!-- WELCOME BANNER -->
                                    <tr><td style="background:linear-gradient(90deg,#E84A2F,#FF6B35);padding:18px 40px;text-align:center;">
                                        <p style="margin:0;color:#FFFFFF;font-size:15px;font-weight:700;letter-spacing:1px;">🎉 &nbsp; ACCOUNT SUCCESSFULLY CREATED &nbsp; 🎉</p>
                                    </td></tr>
                                    <!-- BODY -->
                                    <tr><td style="padding:40px 40px 30px;">
                                        <h2 style="margin:0 0 12px;color:#0F172A;font-size:22px;font-weight:700;">Hello, ${name}! 👋</h2>
                                        <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.75;">We're thrilled to welcome you to the <strong style="color:#0F172A;">Aarya Auto Garage</strong> family. Your account has been created successfully and you're all set to explore our world of premium automotive spare parts.</p>
                                        <p style="margin:0 0 30px;color:#475569;font-size:15px;line-height:1.75;">Browse thousands of quality-tested parts, place orders with ease, and track your deliveries — all from one place.</p>
                                        <!-- CTA BUTTON -->
                                        <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:10px 0 35px;">
                                            <a href="http://localhost:5173/login" style="background:linear-gradient(135deg,#E84A2F,#c23b22);color:#FFFFFF;padding:16px 42px;text-decoration:none;border-radius:50px;font-weight:700;font-size:15px;display:inline-block;letter-spacing:0.5px;box-shadow:0 6px 20px rgba(232,74,47,0.35);">
                                                🚀 &nbsp; Login to Your Account
                                            </a>
                                        </td></tr></table>
                                        <!-- FEATURES GRID -->
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:30px;">
                                            <tr>
                                                <td width="33%" style="text-align:center;padding:16px 8px;background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0;">
                                                    <div style="font-size:26px;margin-bottom:8px;">🔩</div>
                                                    <p style="margin:0;font-size:12px;font-weight:700;color:#0F172A;">Premium Parts</p>
                                                    <p style="margin:4px 0 0;font-size:11px;color:#64748B;">Quality Assured</p>
                                                </td>
                                                <td width="4%"></td>
                                                <td width="33%" style="text-align:center;padding:16px 8px;background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0;">
                                                    <div style="font-size:26px;margin-bottom:8px;">📦</div>
                                                    <p style="margin:0;font-size:12px;font-weight:700;color:#0F172A;">Track Orders</p>
                                                    <p style="margin:4px 0 0;font-size:11px;color:#64748B;">Real-time Status</p>
                                                </td>
                                                <td width="4%"></td>
                                                <td width="33%" style="text-align:center;padding:16px 8px;background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0;">
                                                    <div style="font-size:26px;margin-bottom:8px;">🛠️</div>
                                                    <p style="margin:0;font-size:12px;font-weight:700;color:#0F172A;">Expert Support</p>
                                                    <p style="margin:4px 0 0;font-size:11px;color:#64748B;">Always Available</p>
                                                </td>
                                            </tr>
                                        </table>
                                        <!-- ACCOUNT DETAILS CARD -->
                                        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0;border-left:4px solid #E84A2F;">
                                            <tr><td style="padding:20px 24px;">
                                                <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:1.5px;">Your Account Details</p>
                                                <table width="100%" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td style="padding:6px 0;color:#64748B;font-size:14px;width:140px;">👤 &nbsp; Full Name</td>
                                                        <td style="padding:6px 0;color:#0F172A;font-size:14px;font-weight:600;">${name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding:6px 0;color:#64748B;font-size:14px;">📧 &nbsp; Email</td>
                                                        <td style="padding:6px 0;color:#0F172A;font-size:14px;font-weight:600;">${email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding:6px 0;color:#64748B;font-size:14px;">📅 &nbsp; Joined On</td>
                                                        <td style="padding:6px 0;color:#0F172A;font-size:14px;font-weight:600;">${new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</td>
                                                    </tr>
                                                </table>
                                            </td></tr>
                                        </table>
                                    </td></tr>
                                    <!-- FOOTER -->
                                    <tr><td style="background:linear-gradient(145deg,#0F172A,#1E293B);padding:32px 40px;text-align:center;border-top:3px solid #E84A2F;">
                                        <p style="margin:0 0 10px;color:#94A3B8;font-size:13px;">Questions? We're here to help.</p>
                                        <a href="mailto:aaryaautogarage@gmail.com" style="color:#FF6B35;text-decoration:none;font-size:13px;font-weight:700;">aaryaautogarage@gmail.com</a>
                                        <div style="margin:20px 0;height:1px;background:rgba(255,255,255,0.07);"></div>
                                        <p style="margin:0;color:#475569;font-size:11px;">© ${new Date().getFullYear()} Aarya Auto Garage. All rights reserved.</p>
                                        <p style="margin:5px 0 0;color:#475569;font-size:11px;">📍 Shop No 12, Main Road, Radhanagari</p>
                                    </td></tr>
                                </table>
                            </td></tr>
                        </table>
                    </body>
                    </html>
                `
            });
            console.log("Email sent successfully");
        }
        catch (mailErr) {
            console.error('Failed to send email:', mailErr && mailErr.message ? mailErr.message : mailErr);
        }

        res.json({ message: "Customer Registered Successfully !! " })

    }


    catch (err) {

        console.log(err);
        res.json({
            message: err.message
        });

    }
});




// Login Api
app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;
        const transporter = require("./mailer");

        const customersql = "SELECT customer_id,name,email,password FROM customers WHERE email=?";
        const [customer_data] = await db.query(customersql, [email]);

        if (customer_data.length === 0) {
            return res.json({
                message: "Email Not Found !!", flag: 0
            });
        }

        const customer = customer_data[0];

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, customer.password);

        if (!isMatch) {
            return res.json({
                message: "Incorrect Password !!", flag: 0
            });
        }

        return res.json({
            message: "Login Successfully !!", flag: 1, uid: customer.customer_id, uname: customer.name, umail: customer.email
        });


    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        });

    }
})

// =============================================
// CUSTOMERS (Users) CRUD APIs
// =============================================

// Create a customer (AddUser)
app.post("/users", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO customers(name,email,password) VALUES(?,?,?)";

        await db.query(sql, [name, email, hashedPassword]);

        res.json({
            message: "Customer added successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// Get all customers (UserList)
app.get("/users", async (req, res) => {

    try {
        const sql = "SELECT customer_id AS id, name, email, created_at FROM customers";

        const [customers] = await db.query(sql);

        res.json(customers);


    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// Get customer by id
app.get("/users/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const sql = "SELECT customer_id AS id, name, email, password, created_at FROM customers WHERE customer_id=?";
        const [customer] = await db.query(sql, [id]);

        if (customer.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.json(customer[0]);
    } catch (err) {

        res.status(500).json({
            message: err.message

        });
    }

});

// Update customer
app.put("/users/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql =
            "UPDATE customers SET name=?, email=?, password=? WHERE customer_id=?";

        const [result] = await db.query(sql, [
            name,
            email,
            hashedPassword,
            id
        ]);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Customer not found"
            });

        }

        res.json({
            message: "Customer updated successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

// Delete customer
app.delete("/users/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const sql = "DELETE FROM customers WHERE customer_id=?";
        const [result] = await db.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Customer not found"
            })
        }

        res.json({
            message: "Customer deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
})

// Search customers
app.post("/search", async (req, res) => {
    try {
        const { name, email } = req.body;

        const sql = `
            SELECT customer_id AS id, name, email, created_at FROM customers
            WHERE name LIKE ? OR email LIKE ?`;

        const [customers] = await db.query(sql, [
            `%${name}%`,
            `%${email}%`,
        ]);

        res.json(customers);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});


// Customers pagination (epagination - used by UserList)
app.get("/epagination", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const offset = (page - 1) * limit;



        const countQuery = "SELECT COUNT(*) AS total FROM customers";
        const [countResult] = await db.query(countQuery);
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        const sql = "SELECT customer_id AS id, name, email, created_at FROM customers LIMIT ? OFFSET ?";
        const [result] = await db.query(sql, [limit, offset]);

        res.json({
            data: result,
            total,
            page,
            limit,
            totalPages
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// Contact Route
app.post("/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        await transporter.sendMail({
            from: FROM_ADDRESS,
            to: process.env.MAIL_FROM_ADDRESS || "aaryaautogarage@gmail.com",
            subject: `📩 New Contact Message from ${name} — Aarya Auto Garage`,
            html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#EEF2F7;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2F7;padding:28px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:18px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

<tr><td style="background:linear-gradient(145deg,#0F172A 0%,#1E293B 60%,#0F172A 100%);padding:40px 40px 30px;text-align:center;border-bottom:4px solid #E84A2F;">
        <img src="https://res.cloudinary.com/ji14ydop/image/upload/v1786474190/spare-parts/cofw2n9l05u57enk4aev.png" width="68" height="68" style="border-radius:50%;border:3px solid rgba(232,74,47,0.4);margin-bottom:14px;display:block;margin-left:auto;margin-right:auto;"/>
        <h1 style="color:#FFFFFF;margin:0 0 5px;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Aarya Auto Garage</h1>
        <p style="color:#FF6B35;margin:0;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">New Customer Enquiry</p>
    </td></tr>
<tr><td style="padding:35px 40px 30px;">
    <h2 style="margin:0 0 6px;color:#0F172A;font-size:20px;font-weight:700;">You've received a new message 💬</h2>
    <p style="margin:0 0 28px;color:#475569;font-size:14px;line-height:1.7;">A customer reached out through the website contact form. Details are below.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0;border-left:4px solid #3B82F6;margin-bottom:24px;">
        <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:1.5px;">Sender Details</p>
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:5px 0;color:#64748B;font-size:14px;width:80px;">👤 Name</td><td style="padding:5px 0;color:#0F172A;font-size:14px;font-weight:600;">${name}</td></tr>
                <tr><td style="padding:5px 0;color:#64748B;font-size:14px;">📧 Email</td><td style="padding:5px 0;color:#0F172A;font-size:14px;font-weight:600;">${email}</td></tr>
            </table>
        </td></tr>
    </table>
    <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:1.5px;">Message</p>
    <div style="background:#F8FAFC;border-left:4px solid #E84A2F;border-radius:8px;padding:18px 20px;">
        <p style="margin:0;color:#334155;font-size:15px;line-height:1.8;">${message}</p>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;"><tr><td align="center">
        <a href="mailto:${email}" style="background:linear-gradient(135deg,#E84A2F,#c23b22);color:#FFFFFF;padding:13px 36px;text-decoration:none;border-radius:50px;font-weight:700;font-size:14px;display:inline-block;box-shadow:0 4px 16px rgba(232,74,47,0.3);">↩ Reply to ${name}</a>
    </td></tr></table>
</td></tr>
<tr><td style="background:linear-gradient(145deg,#0F172A,#1E293B);padding:28px 40px;text-align:center;border-top:3px solid #E84A2F;">
        <p style="margin:0 0 8px;color:#94A3B8;font-size:13px;">Need help? Reach us at <a href="mailto:aaryaautogarage@gmail.com" style="color:#FF6B35;text-decoration:none;font-weight:700;">aaryaautogarage@gmail.com</a></p>
        <div style="margin:14px 0;height:1px;background:rgba(255,255,255,0.06);"></div>
        <p style="margin:0;color:#475569;font-size:11px;">© 2026 Aarya Auto Garage. All rights reserved. &nbsp;|&nbsp; 📍 Shop No 12, Main Road, Radhanagari</p>
    </td></tr>
</table></td></tr></table></body></html>`
        });
        res.json({ message: "Message sent successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});