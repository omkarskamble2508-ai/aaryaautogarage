
# -*- coding: utf-8 -*-
# Run: python generate_viva.py
# Then open FinalProject_Viva_Preparation.html in Chrome → Ctrl+P → Save as PDF

html = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Aarya Auto Garage - Viva Preparation</title>
<style>
body{font-family:Arial,sans-serif;background:#fff;color:#111;margin:0;padding:0;font-size:13px;line-height:1.7}
.cover{background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff;text-align:center;padding:80px 40px;page-break-after:always;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center}
.cover h1{font-size:52px;font-weight:900;margin-bottom:10px;color:#fff}
.cover h2{font-size:20px;color:#94a3b8;margin-bottom:40px}
.badge{background:linear-gradient(90deg,#e84a2f,#ff6b35);color:#fff;padding:8px 28px;border-radius:50px;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:28px;display:inline-block}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;max-width:660px;margin:0 auto 36px}
.card{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:14px;padding:18px 12px;text-align:center}
.card .i{font-size:26px;margin-bottom:6px}
.card .l{font-size:10px;color:#94a3b8;font-weight:700;letter-spacing:1px;text-transform:uppercase}
.card .v{font-size:13px;color:#e2e8f0;font-weight:700;margin-top:4px}
.warn{background:rgba(232,74,47,0.2);border:1px solid rgba(232,74,47,0.5);border-radius:12px;padding:14px 28px;color:#fca5a5;font-weight:700;font-size:14px;display:inline-block}
.container{max-width:860px;margin:0 auto;padding:30px 28px}
.sec{display:flex;align-items:center;gap:12px;margin:40px 0 18px;padding-bottom:10px;border-bottom:2px solid #e84a2f}
.sn{background:#e84a2f;color:#fff;width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:900;flex-shrink:0;text-align:center;line-height:38px}
.st{font-size:18px;font-weight:900;color:#111}
.ss{font-size:12px;color:#666;margin-top:2px}
.qa{border:1px solid #e2e8f0;border-radius:12px;margin-bottom:16px;overflow:hidden;page-break-inside:avoid}
.q{background:#fef3f0;border-left:4px solid #e84a2f;padding:12px 16px;display:flex;align-items:flex-start;gap:10px}
.qn{background:#e84a2f;color:#fff;font-size:10px;font-weight:900;padding:2px 7px;border-radius:5px;flex-shrink:0;margin-top:3px}
.qt{font-size:14px;font-weight:800;color:#111;flex:1}
.tag{font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;flex-shrink:0;white-space:nowrap}
.hot{background:#fee2e2;color:#dc2626;border:1px solid #fca5a5}
.cod{background:#e0e7ff;color:#4338ca;border:1px solid #a5b4fc}
.con{background:#dcfce7;color:#166534;border:1px solid #86efac}
.a{padding:16px 16px;color:#374151;line-height:1.85}
.a p{margin-bottom:9px}
.a ul{margin:8px 0 8px 20px}
.a li{margin-bottom:4px}
.a strong{color:#111;font-weight:700}
.a code{background:#f1f5f9;padding:1px 5px;border-radius:4px;font-family:Consolas,monospace;font-size:12px;color:#0f172a}
pre{background:#0f172a;border-radius:8px;padding:14px 16px;font-family:Consolas,monospace;font-size:12px;color:#a5f3fc;overflow-x:auto;margin:10px 0;white-space:pre-wrap;line-height:1.6;-webkit-print-color-adjust:exact;print-color-adjust:exact}
table{width:100%;border-collapse:collapse;margin:10px 0;font-size:12.5px}
th{background:#fef3f0;color:#b91c1c;padding:8px 12px;text-align:left;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #e84a2f;-webkit-print-color-adjust:exact;print-color-adjust:exact}
td{padding:8px 12px;border-bottom:1px solid #f1f5f9;vertical-align:top}
tr:nth-child(even) td{background:#fafafa}
.hbox{border-radius:8px;padding:11px 15px;margin:10px 0;font-size:13px}
.info{background:#eff6ff;border-left:3px solid #3b82f6;color:#1d4ed8}
.warn2{background:#fffbeb;border-left:3px solid #f59e0b;color:#92400e}
.succ{background:#f0fdf4;border-left:3px solid #22c55e;color:#166534}
.dang{background:#fef2f2;border-left:3px solid #ef4444;color:#991b1b}
.flow{display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin:12px 0}
.fs{background:#f1f5f9;border:1px solid #e2e8f0;border-radius:8px;padding:5px 13px;font-size:12px;font-weight:600;color:#374151;white-space:nowrap}
.fa{color:#e84a2f;font-size:16px;font-weight:900}
.schema{border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:12px;page-break-inside:avoid}
.sh{background:#fef3f0;padding:9px 15px;border-bottom:1px solid #fecaca;font-weight:800;color:#e84a2f;font-size:13px;font-family:Consolas,monospace}
.top10{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
.t10{border:1px solid #e2e8f0;border-radius:10px;padding:14px;display:flex;align-items:flex-start;gap:10px;page-break-inside:avoid}
.t10n{background:#e84a2f;color:#fff;width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;flex-shrink:0}
.t10q{font-size:13px;font-weight:800;color:#111;margin-bottom:4px}
.t10a{font-size:11.5px;color:#6b7280;line-height:1.5}
.api-sec{margin-bottom:16px}
.al{font-size:11px;font-weight:700;color:#e84a2f;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px}
.ar{display:flex;align-items:center;gap:8px;padding:7px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;margin-bottom:3px;font-size:12px;font-family:Consolas,monospace}
.m{font-weight:900;font-size:10px;padding:2px 7px;border-radius:4px;min-width:48px;text-align:center;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.GET{background:#dcfce7;color:#166534}
.POST{background:#dbeafe;color:#1e40af}
.PUT{background:#fef9c3;color:#854d0e}
.DEL{background:#fee2e2;color:#991b1b}
.ap{color:#111}
.ad{color:#9ca3af;font-family:Arial,sans-serif;font-size:11px;margin-left:auto}
.footer{text-align:center;padding:40px;color:#6b7280;font-size:12px;border-top:2px solid #f1f5f9;margin-top:40px;page-break-inside:avoid}
@media print{
  body{background:#fff}
  .cover{-webkit-print-color-adjust:exact;print-color-adjust:exact;page-break-after:always}
  .qa,.t10,.schema{page-break-inside:avoid}
  pre{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  th{-webkit-print-color-adjust:exact;print-color-adjust:exact}
}
</style>
</head>
<body>

<div class="cover">
  <div class="badge">&#127891; External Viva Preparation 2026</div>
  <h1>Aarya Auto Garage</h1>
  <h2>Two-Wheeler Spare Parts Management System</h2>
  <div class="grid">
    <div class="card"><div class="i">&#9883;</div><div class="l">Frontend</div><div class="v">React 19 + Vite</div></div>
    <div class="card"><div class="i">&#128154;</div><div class="l">Backend</div><div class="v">Node.js + Express 5</div></div>
    <div class="card"><div class="i">&#128451;</div><div class="l">Database</div><div class="v">MySQL (mysql2)</div></div>
    <div class="card"><div class="i">&#9729;</div><div class="l">Images</div><div class="v">Cloudinary CDN</div></div>
    <div class="card"><div class="i">&#128140;</div><div class="l">Email</div><div class="v">Nodemailer + Brevo</div></div>
    <div class="card"><div class="i">&#129302;</div><div class="l">AI Bot</div><div class="v">OpenRouter Free</div></div>
  </div>
  <div class="warn">&#9888; Tomorrow is External Examination. Read everything carefully!</div>
</div>

<div class="container">

<!-- SECTION 1 -->
<div class="sec"><div class="sn">1</div><div><div class="st">Project Introduction</div><div class="ss">Overview, tech stack, complete flow</div></div></div>

<div class="qa">
<div class="q"><span class="qn">Q1</span><span class="qt">Project काय आहे? Complete flow explain करा.</span><span class="tag hot">&#128293; HOT</span></div>
<div class="a">
<p><strong>Aarya Auto Garage</strong> — Two-Wheeler Spare Parts Management System (Full-Stack Web App)</p>
<div class="flow"><div class="fs">Register/Login</div><div class="fa">&#8594;</div><div class="fs">Browse Parts</div><div class="fa">&#8594;</div><div class="fs">Add to Cart</div><div class="fa">&#8594;</div><div class="fs">Checkout</div><div class="fa">&#8594;</div><div class="fs">Order Placed</div><div class="fa">&#8594;</div><div class="fs">Admin Accepts</div><div class="fa">&#8594;</div><div class="fs">Delivered</div></div>
<p><strong>Customer Panel:</strong> Register, Login, Browse/Search spare parts, Product Detail, Cart, Checkout, My Orders, AI Chatbot, About Us, Contact Us</p>
<p><strong>Admin Panel:</strong> Dashboard (stats), Customer CRUD, Spare Parts CRUD + Image Upload, Order Management (update status)</p>
<p><strong>Live URL:</strong> https://aaryaautogarage.pages.dev | <strong>Backend:</strong> https://aaryaautogarage.onrender.com</p>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">Q2</span><span class="qt">Technologies काय वापरल्या? Vite का — CRA का नाही?</span><span class="tag con">&#128218; CONCEPT</span></div>
<div class="a">
<table><tr><th>Layer</th><th>Technology</th><th>Why Used</th></tr>
<tr><td>Frontend</td><td>React 19 + Vite + React Router v7 + Bootstrap 5</td><td>Fastest build tool, modern routing</td></tr>
<tr><td>Backend</td><td>Node.js + Express 5</td><td>JS full-stack, non-blocking I/O</td></tr>
<tr><td>Database</td><td>MySQL + mysql2 (Connection Pool)</td><td>Relational data, ACID compliant</td></tr>
<tr><td>Auth</td><td>bcrypt (password hashing)</td><td>One-way hashing — secure</td></tr>
<tr><td>Images</td><td>Cloudinary CDN</td><td>Fast global delivery, auto-optimize</td></tr>
<tr><td>Email</td><td>Nodemailer + Brevo SMTP (port 2525)</td><td>Free 300 emails/day</td></tr>
<tr><td>AI Bot</td><td>OpenRouter free models</td><td>Free GPT access, fallback chain</td></tr>
<tr><td>Deploy</td><td>Cloudflare Pages (Frontend), Render (Backend), Aiven (MySQL)</td><td>Free tier production hosting</td></tr>
</table>
<div class="hbox info">&#128161; Vite vs CRA: Vite = native ES Modules, instant HMR, fast production build. CRA = deprecated, webpack, slow. Vite is current industry standard.</div>
</div>
</div>

<!-- SECTION 2 -->
<div class="sec"><div class="sn">2</div><div><div class="st">React Frontend</div><div class="ss">Routing, protected routes, components, libraries</div></div></div>

<div class="qa">
<div class="q"><span class="qn">Q3</span><span class="qt">Protected Route म्हणजे काय? कसे implement केले?</span><span class="tag hot">&#128293; HOT</span></div>
<div class="a">
<p>Protected Route एक wrapper component आहे जो route access करण्यापूर्वी user authenticated आहे का ते check करतो. Unauthorized access block होतो.</p>
<pre>// ProtectedRoute.jsx — Customer guard (checks sessionStorage)
const ProtectedRoute = ({ children }) => {
  const id = sessionStorage.getItem("ID");
  return id ? children : &lt;Navigate to="/login" replace /&gt;;
};

// AdminRoute.jsx — Admin guard
const AdminRoute = ({ children }) => {
  const auth = sessionStorage.getItem("ADMIN_AUTH");
  return auth ? children : &lt;Navigate to="/admin" replace /&gt;;
};

// App.jsx — How it is used
&lt;Route path="/checkout"
  element={&lt;CustomerRoute&gt;&lt;Checkout /&gt;&lt;/CustomerRoute&gt;} /&gt;
&lt;Route path="/dashboard"
  element={&lt;AdminRoute&gt;&lt;Dashboard /&gt;&lt;/AdminRoute&gt;} /&gt;</pre>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">Q4</span><span class="qt">sessionStorage vs localStorage — का sessionStorage वापरले?</span><span class="tag hot">&#128293; HOT</span></div>
<div class="a">
<table><tr><th>Feature</th><th>sessionStorage (Used &#10003;)</th><th>localStorage</th></tr>
<tr><td>Persistence</td><td>Tab/Browser बंद → automatically clear</td><td>Browser बंद झाल्यावरही राहते</td></tr>
<tr><td>Security</td><td>Better — auto logout on tab close</td><td>Manual logout required</td></tr>
<tr><td>Scope</td><td>Same tab only</td><td>All tabs (same origin)</td></tr>
<tr><td>Best for</td><td>Login sessions &#10003;</td><td>User preferences, theme settings</td></tr>
</table>
<pre>// Login — store session
sessionStorage.setItem("ID", customer_id);
sessionStorage.setItem("UNAME", customer_name);
sessionStorage.setItem("ADMIN_AUTH", "true");  // admin

// Access anywhere in app
const uid = sessionStorage.getItem("ID");

// Logout — clear all
sessionStorage.clear();</pre>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">Q5</span><span class="qt">Floating Chatbot सर्व pages वर कसे दिसतो? Libraries का?</span><span class="tag cod">&#128187; CODE</span></div>
<div class="a">
<pre>// App.jsx — FloatingChatbot placed OUTSIDE Routes
&lt;BrowserRouter&gt;
  &lt;FloatingChatbot /&gt;  {/* Outside Routes = shows on every page */}
  &lt;Routes&gt;
    &lt;Route path="/home" element={&lt;CustomerHome /&gt;} /&gt;
    &lt;Route path="/spareparts" element={&lt;ViewSpareParts /&gt;} /&gt;
    ...
  &lt;/Routes&gt;
&lt;/BrowserRouter&gt;</pre>
<table><tr><th>Library</th><th>Purpose</th><th>Used Where</th></tr>
<tr><td>react-markdown + remark-gfm</td><td>Markdown (bold, bullets) → HTML render</td><td>Chatbot replies</td></tr>
<tr><td>xlsx</td><td>Client-side Excel file generation</td><td>Admin export spare parts list</td></tr>
<tr><td>axios</td><td>HTTP requests (cleaner than fetch)</td><td>All API calls from React</td></tr>
<tr><td>bootstrap 5</td><td>CSS utility classes</td><td>Some UI layout components</td></tr>
</table>
</div>
</div>

<!-- SECTION 3 -->
<div class="sec"><div class="sn">3</div><div><div class="st">Node.js / Express Backend</div><div class="ss">Middleware, patterns, modules, dotenv</div></div></div>

<div class="qa">
<div class="q"><span class="qn">Q6</span><span class="qt">CORS म्हणजे काय? cors() middleware का लागतो?</span><span class="tag hot">&#128293; HOT</span></div>
<div class="a">
<p><strong>CORS = Cross-Origin Resource Sharing</strong></p>
<div class="hbox dang">&#10060; Problem: React = localhost:5173, Node = localhost:3000. Different port = Different Origin. Browser same-origin policy → blocks request automatically!<br>Error: "Access to XMLHttpRequest at localhost:3000 has been blocked by CORS policy"</div>
<pre>// Customer.js — Solution
const cors = require('cors');
app.use(cors());  // Allow all origins (development)

// Production — restrict to specific frontend URL
app.use(cors({ origin: "https://aaryaautogarage.pages.dev" }));</pre>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">Q7</span><span class="qt">mysql.createPool() vs createConnection() — फरक?</span><span class="tag hot">&#128293; HOT</span></div>
<div class="a">
<table><tr><th>Feature</th><th>createPool() &#10003; Used</th><th>createConnection()</th></tr>
<tr><td>Connections</td><td>Multiple (max connectionLimit: 10)</td><td>Single connection only</td></tr>
<tr><td>Concurrent requests</td><td>10 requests simultaneously</td><td>One at a time (queue waits)</td></tr>
<tr><td>Performance</td><td>Excellent (reuse connections)</td><td>Poor for production apps</td></tr>
<tr><td>Auto-reconnect</td><td>Yes (pool manages automatically)</td><td>Manual reconnect needed</td></tr>
</table>
<pre>const db = mysql.createPool({
  host: process.env.DB_HOST,        // Aiven cloud MySQL host
  port: process.env.DB_PORT,        // 19032 (Aiven port)
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,              // max 10 simultaneous connections
  queueLimit: 0,                    // unlimited queued requests
  ssl: { rejectUnauthorized: false }// required for Aiven cloud DB
}).promise();                        // ← enables async/await!</pre>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">Q8</span><span class="qt">Middleware म्हणजे काय? spare_part.js मध्ये module.exports = function(db) का?</span><span class="tag cod">&#128187; CODE</span></div>
<div class="a">
<p>Middleware = request येण्यापासून response पाठवेपर्यंत middle मध्ये execute होणारे functions.</p>
<div class="flow"><div class="fs">Request</div><div class="fa">&#8594;</div><div class="fs">cors()</div><div class="fa">&#8594;</div><div class="fs">express.json()</div><div class="fa">&#8594;</div><div class="fs">multer()</div><div class="fa">&#8594;</div><div class="fs">Route Handler</div><div class="fa">&#8594;</div><div class="fs">Response</div></div>
<pre>// spare_part.js — Dependency Injection pattern
// db connection Customer.js मध्ये create होते
// spare_part.js ला pass (inject) करतो
module.exports = function(db) {
  const router = express.Router();
  router.get("/spare_parts", async (req, res) => {
    const [parts] = await db.query("SELECT * FROM spare_parts");
    res.json(parts);
  });
  return router;
};

// Customer.js
const sparePartRoutes = require("./spare_part");
app.use("/", sparePartRoutes(db));  // db inject केला</pre>
<div class="hbox info">&#128161; dotenv: Secret keys (.env file) → process.env.KEY_NAME. .env file .gitignore मध्ये → GitHub वर expose होत नाही!</div>
</div>
</div>

<!-- SECTION 4 -->
<div class="sec"><div class="sn">4</div><div><div class="st">Database (MySQL)</div><div class="ss">Tables, queries, security, relationships</div></div></div>

<div class="qa">
<div class="q"><span class="qn">Q9</span><span class="qt">Project मध्ये कोणते tables आहेत? Schema explain करा.</span><span class="tag hot">&#128293; HOT</span></div>
<div class="a">
<div class="schema"><div class="sh">TABLE: customers</div>
<table><tr><th>Column</th><th>Type</th><th>Note</th></tr>
<tr><td>customer_id</td><td>INT AUTO_INCREMENT PK</td><td>Primary Key</td></tr>
<tr><td>name, email</td><td>VARCHAR(255)</td><td>email = UNIQUE constraint</td></tr>
<tr><td>password</td><td>VARCHAR(255)</td><td>bcrypt hashed (not plain text)</td></tr>
<tr><td>created_at</td><td>TIMESTAMP DEFAULT NOW()</td><td>Auto registration date</td></tr>
</table></div>
<div class="schema"><div class="sh">TABLE: spare_parts</div>
<table><tr><th>Column</th><th>Type</th><th>Note</th></tr>
<tr><td>part_id</td><td>INT AUTO_INCREMENT PK</td><td></td></tr>
<tr><td>part_name, brand, categories</td><td>VARCHAR(255)</td><td></td></tr>
<tr><td>applicability_base_model, applicable_model</td><td>VARCHAR(255)</td><td>Bike compatibility</td></tr>
<tr><td>price</td><td>DECIMAL(10,2)</td><td>Price in Indian Rupees</td></tr>
<tr><td>stock_quantity</td><td>INT</td><td>Available stock count</td></tr>
<tr><td>image</td><td>TEXT</td><td>Cloudinary secure URL</td></tr>
</table></div>
<div class="schema"><div class="sh">TABLE: cart</div>
<table><tr><th>Column</th><th>Type</th><th>Note</th></tr>
<tr><td>cart_id</td><td>INT AUTO_INCREMENT PK</td><td></td></tr>
<tr><td>customer_id</td><td>INT FK → customers</td><td>ON DELETE CASCADE</td></tr>
<tr><td>part_id</td><td>INT FK → spare_parts</td><td>ON DELETE CASCADE</td></tr>
<tr><td>quantity</td><td>INT DEFAULT 1</td><td>Item quantity</td></tr>
<tr><td>UNIQUE KEY</td><td>(customer_id, part_id)</td><td>No duplicate parts in cart!</td></tr>
</table></div>
<div class="schema"><div class="sh">TABLE: orders + order_items</div>
<table><tr><th>Column</th><th>Type</th><th>Note</th></tr>
<tr><td>order_id</td><td>VARCHAR(6) PK</td><td>Random alphanumeric: "A3K9XZ"</td></tr>
<tr><td>customer_id</td><td>INT FK → customers</td><td>ON DELETE CASCADE</td></tr>
<tr><td>total_amount</td><td>DECIMAL(10,2)</td><td>Sum of all items</td></tr>
<tr><td>status</td><td>ENUM</td><td>'Ordered','Accepted','Delivered','Declined'</td></tr>
<tr><td>order_items.order_id</td><td>FK → orders</td><td>Each item stored separately</td></tr>
</table></div>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">Q10</span><span class="qt">SQL Injection म्हणजे काय? Prevention कसे केले?</span><span class="tag hot">&#128293; HOT</span></div>
<div class="a">
<pre>// ATTACK — User types this as email: admin' OR '1'='1
// Without protection, query becomes:
SELECT * FROM customers WHERE email='admin' OR '1'='1'
// '1'='1' is always TRUE → returns ALL users = bypass login!

// Our project — SAFE parameterized queries:
// ❌ WRONG (vulnerable):
db.query("SELECT * FROM customers WHERE email='" + email + "'");

// ✅ CORRECT (used everywhere in project):
db.query("SELECT * FROM customers WHERE email=?", [email]);
db.query("INSERT INTO customers(name,email,password) VALUES(?,?,?)",
         [name, email, hashedPassword]);</pre>
<div class="hbox succ">&#10003; mysql2 automatically sanitizes ? placeholders → SQL Injection completely prevented!</div>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">Q11</span><span class="qt">Pagination कशासाठी? LIMIT/OFFSET कसे काम करते? UNIQUE KEY + CASCADE?</span><span class="tag cod">&#128187; CODE</span></div>
<div class="a">
<pre>// PAGINATION — GET /epagination?page=2&limit=5
const page = 2, limit = 5;
const offset = (page - 1) * limit;  // = (2-1)*5 = 5
// SQL fetches records 6 to 10:
SELECT * FROM customers LIMIT 5 OFFSET 5;
// Response: { data:[...], total:50, page:2, totalPages:10 }

// UNIQUE KEY — prevents same part appearing twice in cart
UNIQUE KEY unique_cart_item (customer_id, part_id)

// ON DUPLICATE KEY — re-add same part increments quantity
INSERT INTO cart(customer_id, part_id, quantity)
VALUES(?, ?, 1)
ON DUPLICATE KEY UPDATE quantity = quantity + 1;

// ON DELETE CASCADE — customer delete → cart + orders auto-delete
FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE</pre>
</div>
</div>

<!-- SECTION 5 -->
<div class="sec"><div class="sn">5</div><div><div class="st">Authentication — bcrypt</div><div class="ss">Password hashing, salt, compare</div></div></div>

<div class="qa">
<div class="q"><span class="qn">Q12</span><span class="qt">bcrypt म्हणजे काय? Register + Login मध्ये कसे वापरले?</span><span class="tag hot">&#128293; HOT</span></div>
<div class="a">
<pre>// REGISTER — Hash password before storing
const hashedPassword = await bcrypt.hash(password, 10);
// 10 = salt rounds = 2^10 = 1024 iterations
// "MyPass123" → "$2b$10$N9qo8uLOickgx2ZMRZoMye..."
// One-way: cannot be reversed/decrypted!
await db.query("INSERT INTO customers(name,email,password) VALUES(?,?,?)",
               [name, email, hashedPassword]);  // store hash only

// LOGIN — Compare entered password with stored hash
const isMatch = await bcrypt.compare(enteredPassword, storedHash);
// true  → login success → send customer_id, name back to frontend
// false → res.json({ message: "Incorrect Password!!", flag: 0 })</pre>
<div class="hbox warn2">&#9888; Plain text password क्यों नहीं? DB hack → सर्व exposed. bcrypt one-way = reverse impossible. Salt = same password ला different hash येतो.</div>
</div>
</div>

<!-- SECTION 6 -->
<div class="sec"><div class="sn">6</div><div><div class="st">Cloudinary Image Upload</div><div class="ss">multer, memoryStorage, stream</div></div></div>

<div class="qa">
<div class="q"><span class="qn">Q13</span><span class="qt">Cloudinary image upload flow explain करा. DB मध्ये का नाही?</span><span class="tag hot">&#128293; HOT</span></div>
<div class="a">
<div class="flow"><div class="fs">Admin selects image</div><div class="fa">&#8594;</div><div class="fs">axios.post('/upload')</div><div class="fa">&#8594;</div><div class="fs">multer receives</div><div class="fa">&#8594;</div><div class="fs">req.file.buffer (RAM)</div><div class="fa">&#8594;</div><div class="fs">upload_stream</div><div class="fa">&#8594;</div><div class="fs">Cloudinary folder</div><div class="fa">&#8594;</div><div class="fs">secure_url returned</div><div class="fa">&#8594;</div><div class="fs">URL saved to DB</div></div>
<pre>// Customer.js — Complete upload implementation
const upload = multer({ storage: multer.memoryStorage() });
// memoryStorage = file NOT saved to disk, kept in RAM as buffer

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });
  
  const stream = cloudinary.uploader.upload_stream(
    { folder: 'spare-parts' },        // organized folder in Cloudinary
    (error, result) => {
      if (error) return res.status(500).json({ message: "Upload failed" });
      res.json({ image: result.secure_url });  // CDN URL returned
    }
  );
  stream.end(req.file.buffer);  // buffer streamed to Cloudinary
});</pre>
<div class="hbox info">&#128161; Why Cloudinary? Images as BLOB in DB = DB size explodes, slow queries. Cloudinary CDN = global fast delivery + auto compression + resize on-the-fly. DB stores only URL string.</div>
</div>
</div>

<!-- SECTION 7 -->
<div class="sec"><div class="sn">7</div><div><div class="st">AI Chatbot (Aarya Bot + AI Assistant)</div><div class="ss">Intent detection, DB queries, OpenRouter fallback</div></div></div>

<div class="qa">
<div class="q"><span class="qn">Q14</span><span class="qt">Chatbot चे दोन modes काय आहेत? फरक सांगा.</span><span class="tag hot">&#128293; HOT</span></div>
<div class="a">
<table><tr><th>Feature</th><th>Aarya Bot (Local)</th><th>AI Assistant (GPT)</th></tr>
<tr><td>API Endpoint</td><td>POST /chat</td><td>POST /chat-gpt</td></tr>
<tr><td>How it works</td><td>detectIntent() → DB query or template reply</td><td>OpenRouter free AI models (fallback chain)</td></tr>
<tr><td>Knowledge</td><td>Business specific (parts, hours, location, stock)</td><td>General automotive knowledge</td></tr>
<tr><td>Speed</td><td>Very fast (no external API)</td><td>Slower (external API call)</td></tr>
<tr><td>Cost</td><td>Zero (local logic + DB)</td><td>Free (OpenRouter free models)</td></tr>
<tr><td>Offline</td><td>Works offline</td><td>Needs internet</td></tr>
</table>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">Q15</span><span class="qt">detectIntent(), normalise() कसे काम करतात? GPT fallback chain?</span><span class="tag cod">&#128187; CODE</span></div>
<div class="a">
<pre>// normalise() — clean user input
function normalise(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
}
// "Do you have Brake Pads?!" → "do you have brake pads"

// detectIntent() — match keywords to intent
function detectIntent(msg) {
  if (/\b(hi|hello|hey|namaste)\b/.test(msg))      return "greeting";
  if (/\b(open|timing|hour|when)\b/.test(msg))     return "hours";
  if (/\b(brake|disc|drum|pad)\b/.test(msg))       return "parts_search";
  if (/\b(price|cost|how much)\b/.test(msg))       return "price_query";
  if (/\b(honda|bajaj|hero|yamaha)\b/.test(msg))   return "brand_search";
  if (/\b(stock|available)\b/.test(msg))            return "stock_query";
  return "unknown";
}

// GPT Mode — Fallback chain (fixed recently!)
const FREE_MODELS = [
  "nvidia/nemotron-3.5-lightning:free",  // Tested working ✅
  "nex-agi/nex-n2.5-mini:free",          // Tested working ✅
  "nex-agi/nex-n2.5-pro:free",
  "liquid/lfm-2.5-2.6b:free",
];
// If model 1 fails → try model 2 → try model 3 → friendly error</pre>
</div>
</div>

<!-- SECTION 8 -->
<div class="sec"><div class="sn">8</div><div><div class="st">Email + REST API + Key Concepts</div><div class="ss">Nodemailer, HTTP, async/await, order flow</div></div></div>

<div class="qa">
<div class="q"><span class="qn">Q16</span><span class="qt">Nodemailer + Brevo SMTP? Port 2525 का? REST API + HTTP Methods?</span><span class="tag hot">&#128293; HOT</span></div>
<div class="a">
<pre>// mailer.js — Brevo SMTP config
nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,     // ← Render blocks port 587, 2525 works!
  secure: false,  // STARTTLS (not full SSL)
  auth: { user: BREVO_LOGIN, pass: BREVO_SMTP_KEY }
});
// Emails: 1) Welcome on Register  2) Order Confirmation  3) Contact form</pre>
<table><tr><th>HTTP Method</th><th>Action</th><th>Example in Project</th></tr>
<tr><td>GET</td><td>Read/Fetch</td><td>GET /spare_parts → all parts list</td></tr>
<tr><td>POST</td><td>Create new</td><td>POST /register → new customer</td></tr>
<tr><td>PUT</td><td>Update existing</td><td>PUT /users/5 → update customer</td></tr>
<tr><td>DELETE</td><td>Remove</td><td>DELETE /users/5 → delete customer</td></tr>
</table>
<table><tr><th>Status Code</th><th>Meaning</th><th>Used When</th></tr>
<tr><td>200 OK</td><td>Success</td><td>Normal response</td></tr>
<tr><td>400 Bad Request</td><td>Invalid input</td><td>Missing required field</td></tr>
<tr><td>404 Not Found</td><td>Resource missing</td><td>Customer/Part not found</td></tr>
<tr><td>500 Internal Error</td><td>Server crash</td><td>DB error, unhandled exception</td></tr>
</table>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">Q17</span><span class="qt">Order create मध्ये एकाच वेळी काय काय होते? async/await vs Promise?</span><span class="tag cod">&#128187; CODE</span></div>
<div class="a">
<pre>// POST /orders/create — 8 steps in sequence:
1. Cart items fetch (JOIN spare_parts for price + image)
2. Total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
3. Generate 6-char alphanumeric order_id:
   chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
   order_id = 6 random chars → e.g. "A3K9XZ"
4. INSERT INTO orders (status = 'Ordered' by default)
5. UPDATE customers SET mobile_number (if provided)
6. Loop → INSERT each cart item into order_items table
7. DELETE FROM cart WHERE customer_id = ? (clear cart)
8. Send order confirmation email to customer

// async/await vs Promise
// Promise (old):
db.query(sql).then(([r]) => res.json(r)).catch(err => ...);

// async/await (used in project — cleaner):
try {
  const [result] = await db.query(sql);
  res.json(result);
} catch (err) { res.status(500).json({ message: err.message }); }</pre>
<div class="hbox info">&#128161; req.params = URL :id | req.body = POST data | req.query = ?page=1 | COALESCE(SUM(qty),0) = returns 0 instead of NULL when cart empty</div>
</div>
</div>

<!-- TOP 10 -->
<div class="sec"><div class="sn">&#9733;</div><div><div class="st">Top 10 Most Likely External Questions</div><div class="ss">Prepare these FIRST — highest probability!</div></div></div>

<div class="top10">
<div class="t10"><div class="t10n">1</div><div><div class="t10q">Project explain करा — complete flow</div><div class="t10a">Register → Login → Browse → Cart → Checkout → Order placed → Admin accepts → Delivered</div></div></div>
<div class="t10"><div class="t10n">2</div><div><div class="t10q">bcrypt hashing कसे काम करते?</div><div class="t10a">bcrypt.hash(password,10) → salted hash stored. Login: bcrypt.compare() → true/false</div></div></div>
<div class="t10"><div class="t10n">3</div><div><div class="t10q">SQL Injection prevention?</div><div class="t10a">Malicious SQL in input field. Prevention: ? parameterized queries — mysql2 sanitizes automatically</div></div></div>
<div class="t10"><div class="t10n">4</div><div><div class="t10q">CORS error — काय, कसे solve?</div><div class="t10a">Port 5173 vs 3000 = different origin → browser blocks. Fix: cors() middleware on backend</div></div></div>
<div class="t10"><div class="t10n">5</div><div><div class="t10q">MySQL Pool vs Connection फरक?</div><div class="t10a">Pool = multiple (10) reusable connections, production ready. Connection = single, one query at a time</div></div></div>
<div class="t10"><div class="t10n">6</div><div><div class="t10q">Chatbot दोन modes?</div><div class="t10a">Aarya Bot = rule-based + DB queries (/chat). AI Assistant = OpenRouter free models (/chat-gpt)</div></div></div>
<div class="t10"><div class="t10n">7</div><div><div class="t10q">Cloudinary upload flow?</div><div class="t10a">multer memoryStorage → req.file.buffer → upload_stream → Cloudinary → secure_url → save to DB</div></div></div>
<div class="t10"><div class="t10n">8</div><div><div class="t10q">Protected Route — कसे implement?</div><div class="t10a">ProtectedRoute.jsx checks sessionStorage.ID → না मिला तर Navigate to /login redirect</div></div></div>
<div class="t10"><div class="t10n">9</div><div><div class="t10q">REST API + HTTP Methods?</div><div class="t10a">GET=read, POST=create, PUT=update, DELETE=delete. Status codes: 200, 400, 404, 500</div></div></div>
<div class="t10"><div class="t10n">10</div><div><div class="t10q">Database tables कोणत्या आहेत?</div><div class="t10a">customers, spare_parts, cart, orders, order_items — with Foreign Keys and ON DELETE CASCADE</div></div></div>
</div>

<!-- API REFERENCE -->
<div class="sec"><div class="sn">&#128203;</div><div><div class="st">All API Endpoints — Quick Reference</div><div class="ss">Complete routes list</div></div></div>

<div class="api-sec">
<div class="al">&#128100; Auth / Customer APIs (Customer.js)</div>
<div class="ar"><span class="m POST">POST</span><span class="ap">/register</span><span class="ad">Register + bcrypt hash + welcome email</span></div>
<div class="ar"><span class="m POST">POST</span><span class="ap">/login</span><span class="ad">Login with bcrypt.compare()</span></div>
<div class="ar"><span class="m GET">GET</span><span class="ap">/users</span><span class="ad">All customers (Admin)</span></div>
<div class="ar"><span class="m GET">GET</span><span class="ap">/users/:id</span><span class="ad">Customer by ID</span></div>
<div class="ar"><span class="m POST">POST</span><span class="ap">/users</span><span class="ad">Add customer (Admin)</span></div>
<div class="ar"><span class="m PUT">PUT</span><span class="ap">/users/:id</span><span class="ad">Update customer</span></div>
<div class="ar"><span class="m DEL">DELETE</span><span class="ap">/users/:id</span><span class="ad">Delete customer (CASCADE removes cart/orders)</span></div>
<div class="ar"><span class="m GET">GET</span><span class="ap">/epagination</span><span class="ad">Paginated customers (?page=1&limit=5)</span></div>
<div class="ar"><span class="m POST">POST</span><span class="ap">/search</span><span class="ad">Search customers by name/email</span></div>
<div class="ar"><span class="m POST">POST</span><span class="ap">/upload</span><span class="ad">Image → Cloudinary → returns secure_url</span></div>
<div class="ar"><span class="m POST">POST</span><span class="ap">/chat</span><span class="ad">Aarya Bot (rule-based + DB)</span></div>
<div class="ar"><span class="m POST">POST</span><span class="ap">/chat-gpt</span><span class="ad">AI Assistant (OpenRouter fallback chain)</span></div>
<div class="ar"><span class="m POST">POST</span><span class="ap">/contact</span><span class="ad">Contact form → email to shop owner</span></div>
</div>

<div class="api-sec">
<div class="al">&#128297; Spare Parts APIs (spare_part.js)</div>
<div class="ar"><span class="m GET">GET</span><span class="ap">/spare_parts</span><span class="ad">All parts</span></div>
<div class="ar"><span class="m GET">GET</span><span class="ap">/spare_parts/:id</span><span class="ad">Part by ID</span></div>
<div class="ar"><span class="m POST">POST</span><span class="ap">/spare_parts</span><span class="ad">Add spare part</span></div>
<div class="ar"><span class="m PUT">PUT</span><span class="ap">/spare_parts/:id</span><span class="ad">Update spare part</span></div>
<div class="ar"><span class="m DEL">DELETE</span><span class="ap">/spare_parts/:id</span><span class="ad">Delete spare part</span></div>
<div class="ar"><span class="m GET">GET</span><span class="ap">/spare_parts_low_stock</span><span class="ad">Stock ≤ 5 (Admin dashboard alert)</span></div>
<div class="ar"><span class="m GET">GET</span><span class="ap">/Product</span><span class="ad">All products (Admin view)</span></div>
<div class="ar"><span class="m GET">GET</span><span class="ap">/pagination</span><span class="ad">Paginated products</span></div>
<div class="ar"><span class="m POST">POST</span><span class="ap">/psearch</span><span class="ad">Search products by name/brand</span></div>
</div>

<div class="api-sec">
<div class="al">&#128722; Cart APIs</div>
<div class="ar"><span class="m GET">GET</span><span class="ap">/cart/:customer_id</span><span class="ad">Get cart items (JOIN spare_parts)</span></div>
<div class="ar"><span class="m GET">GET</span><span class="ap">/cart/count/:customer_id</span><span class="ad">Cart count (COALESCE SUM qty)</span></div>
<div class="ar"><span class="m POST">POST</span><span class="ap">/cart/add</span><span class="ad">Add to cart (ON DUPLICATE KEY UPDATE qty+1)</span></div>
<div class="ar"><span class="m PUT">PUT</span><span class="ap">/cart/update/:cart_id</span><span class="ad">Update quantity</span></div>
<div class="ar"><span class="m DEL">DELETE</span><span class="ap">/cart/remove/:cart_id</span><span class="ad">Remove single item</span></div>
<div class="ar"><span class="m DEL">DELETE</span><span class="ap">/cart/clear/:customer_id</span><span class="ad">Clear entire cart</span></div>
</div>

<div class="api-sec">
<div class="al">&#128230; Order APIs</div>
<div class="ar"><span class="m POST">POST</span><span class="ap">/orders/create</span><span class="ad">Place order: fetch cart → calculate total → insert → clear cart → send email</span></div>
<div class="ar"><span class="m GET">GET</span><span class="ap">/orders/:customer_id</span><span class="ad">Customer order history</span></div>
<div class="ar"><span class="m GET">GET</span><span class="ap">/all-orders</span><span class="ad">All orders (Admin)</span></div>
<div class="ar"><span class="m PUT">PUT</span><span class="ap">/orders/:order_id/status</span><span class="ad">Update order status (Admin: Accepted/Delivered/Declined)</span></div>
</div>

<div class="footer">
  <p style="font-size:40px;margin-bottom:10px">&#127949;</p>
  <p style="font-weight:900;font-size:18px;color:#111;margin-bottom:6px">Aarya Auto Garage — External Viva Preparation Guide</p>
  <p>React 19 + Vite &nbsp;|&nbsp; Node.js + Express 5 &nbsp;|&nbsp; MySQL (Aiven) &nbsp;|&nbsp; Cloudinary &nbsp;|&nbsp; Nodemailer + Brevo &nbsp;|&nbsp; OpenRouter AI</p>
  <p style="margin-top:16px;background:#fef3f0;display:inline-block;padding:10px 28px;border-radius:50px;color:#e84a2f;font-weight:700;border:2px solid #fecaca">&#128161; Open this file in Chrome → Press Ctrl+P → Select "Save as PDF"</p>
  <p style="margin-top:20px;font-size:22px;font-weight:900;color:#e84a2f">ALL THE BEST FOR YOUR EXTERNAL EXAM! &#127891;</p>
</div>

</div>
</body>
</html>"""

output_path = r"c:\\Internship2026-27\\FinalProject_Viva_Preparation.html"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(html)

print(f"File saved: {output_path}")
print("Open in Chrome → Ctrl+P → Save as PDF")
print("File size:", len(html), "bytes")
