# -*- coding: utf-8 -*-
# Extra Technical Q&A to append into the PDF

extra_section = """
<!-- EXTRA TECHNICAL SECTION -->
<div class="sec"><div class="sn">A</div><div><div class="st">Deep Technical Questions (External Examiner Level)</div><div class="ss">Code-specific, conceptual depth, why-based questions</div></div></div>

<!-- NODE.JS CORE -->
<div class="qa">
<div class="q"><span class="qn">T1</span><span class="qt">Node.js m्हणजे काय? Event Loop explain करा. Synchronous vs Asynchronous?</span><span class="tag hot">&#128293; DEEP</span></div>
<div class="a">
<p><strong>Node.js</strong> = JavaScript runtime built on Chrome's V8 engine. Server-side JS execute करतो.</p>
<p><strong>Event Loop:</strong> Node.js single-threaded आहे. Non-blocking I/O वापरतो. DB query, file read, API call — हे background मध्ये होतात. Complete झाल्यावर callback/await execute होते.</p>
<pre>// Synchronous (blocking) — waits
const data = fs.readFileSync('file.txt');  // execution stops here
console.log(data);

// Asynchronous (non-blocking) — our project uses this
const [rows] = await db.query("SELECT * FROM spare_parts");
// Node continues other work while DB query runs
// 'await' resumes here when result is ready</pre>
<div class="hbox info">&#128161; Why Node for backend? JavaScript both frontend + backend = full-stack JS. npm ecosystem huge. Fast for I/O-heavy apps like REST APIs.</div>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">T2</span><span class="qt">express.json() middleware नसल्यावर काय होते? require() vs import?</span><span class="tag cod">&#128187; CODE</span></div>
<div class="a">
<pre>// Without express.json():
app.post("/login", (req, res) => {
  console.log(req.body);  // OUTPUT: undefined !!!
  // POST body JSON parse होत नाही
});

// With express.json():
app.use(express.json());
// { "email":"a@b.com", "password":"123" } -> req.body.email = "a@b.com"

// require() vs import:
// require() - CommonJS (used in our Node project: "type":"commonjs")
const express = require('express');
// import - ES Modules (used in React: "type":"module")
import axios from 'axios';</pre>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">T3</span><span class="qt">try-catch क्यों important आहे? Error handling project मध्ये कसे केले?</span><span class="tag hot">&#128293; DEEP</span></div>
<div class="a">
<pre>// Without try-catch - server CRASHES on DB error!
app.get("/users", async (req, res) => {
  const [users] = await db.query("SELECT * FROM customers");  // DB down = crash!
  res.json(users);
});

// With try-catch - graceful error response (used everywhere in project)
app.get("/users", async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM customers");
    res.json(users);           // success
  } catch (err) {
    console.log(err);          // log for debugging
    res.status(500).json({ message: err.message });  // send error to client
  }
});</pre>
</div>
</div>

<!-- DATABASE DEPTH -->
<div class="qa">
<div class="q"><span class="qn">T4</span><span class="qt">DECIMAL(10,2) का वापरले? FLOAT का नाही? Primary Key vs Foreign Key?</span><span class="tag hot">&#128293; DEEP</span></div>
<div class="a">
<pre>-- DECIMAL vs FLOAT for money:
-- FLOAT: 99.99 stored as 99.98999999... (floating point imprecision!)
-- Rs.1000.50 + Rs.500.25 = Rs.1500.74 WRONG with FLOAT!

DECIMAL(10,2): Exact precision
-- 10 = total digits, 2 = decimal places
-- Rs.99999999.99 max, exact to the paisa

-- PRIMARY KEY: Unique identifier for each row
customer_id INT AUTO_INCREMENT PRIMARY KEY
-- Cannot be NULL, must be unique, indexed automatically

-- FOREIGN KEY: References Primary Key of another table
cart.customer_id references customers.customer_id
-- Ensures referential integrity
-- ON DELETE CASCADE: parent delete = child auto-delete</pre>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">T5</span><span class="qt">Database Normalization म्हणजे काय? तुमचा DB normalized आहे का?</span><span class="tag con">&#128218; CONCEPT</span></div>
<div class="a">
<p>Normalization = data redundancy eliminate करणे + data integrity ensure करणे.</p>
<table><tr><th>Normal Form</th><th>Rule</th><th>Our Project</th></tr>
<tr><td>1NF</td><td>Atomic values, no repeating groups</td><td>Each column single value - YES</td></tr>
<tr><td>2NF</td><td>No partial dependency on composite PK</td><td>All columns depend on full PK - YES</td></tr>
<tr><td>3NF</td><td>No transitive dependency</td><td>order_items stores price separately - YES</td></tr>
</table>
<div class="hbox info">&#128161; order_items मध्ये price separately store केला - because spare_parts.price change होऊ शकतो later. Order त्यावेळचा price record ठेवतो.</div>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">T6</span><span class="qt">JOIN म्हणजे काय? Types? COUNT(*) vs COUNT(column)? COALESCE?</span><span class="tag cod">&#128187; CODE</span></div>
<div class="a">
<pre>-- INNER JOIN (used in cart/order queries)
-- Only returns rows with matching records in BOTH tables
SELECT c.cart_id, c.quantity, sp.part_name, sp.price, sp.image
FROM cart c
INNER JOIN spare_parts sp ON c.part_id = sp.part_id
WHERE c.customer_id = ?;
-- If part_id in cart does not exist in spare_parts = row excluded

-- LEFT JOIN - all rows from left table, NULL for non-matches
-- RIGHT JOIN - all rows from right table  
-- FULL JOIN - all rows from both

-- COALESCE - returns first non-NULL value
SELECT COALESCE(SUM(quantity), 0) AS totalItems FROM cart
-- Cart empty = SUM returns NULL = COALESCE gives 0

-- COUNT(*) vs COUNT(column):
-- COUNT(*) - counts ALL rows including NULLs
-- COUNT(column) - counts only non-NULL values</pre>
</div>
</div>

<!-- REACT DEPTH -->
<div class="qa">
<div class="q"><span class="qn">T7</span><span class="qt">React मध्ये useState, useEffect, useRef काय करतात? Virtual DOM?</span><span class="tag hot">&#128293; DEEP</span></div>
<div class="a">
<pre>// useState - component state manage करतो
const [input, setInput] = useState("");   // FloatingChatbot.jsx
const [typing, setTyping] = useState(false);
// setInput() called = component re-renders with new value

// useEffect - side effects (API calls, subscriptions)
useEffect(() => {
  endRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages, typing, isOpen, mode]);
// Runs every time messages/typing/isOpen/mode changes

// useRef - DOM element directly access (no re-render)
const endRef = useRef(null);
endRef.current?.scrollIntoView();  // chat auto-scroll to bottom</pre>
<p><strong>Virtual DOM:</strong> React actual DOM ची lightweight copy maintain करतो. State change = Virtual DOM update = Diff with previous = Only changed parts update in real DOM = Fast!</p>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">T8</span><span class="qt">SPA म्हणजे काय? React Router कसे काम करते? useNavigate vs Navigate?</span><span class="tag con">&#128218; CONCEPT</span></div>
<div class="a">
<p><strong>SPA = Single Page Application.</strong> एकच HTML file load होते. Page reload न होता content change होतो. React Router client-side routing करतो.</p>
<pre>// useNavigate - programmatic navigation (after action)
const navigate = useNavigate();
navigate("/home");        // login success after redirect
navigate("/login");       // logout after

// Navigate component - render time redirect
return isAuthenticated ? children : &lt;Navigate to="/login" replace /&gt;;
// replace=true: history stack मध्ये replace होतो
// back button press = login loop prevent होतो</pre>
</div>
</div>

<!-- SECURITY DEPTH -->
<div class="qa">
<div class="q"><span class="qn">T9</span><span class="qt">JWT म्हणजे काय? तुमच्या project मध्ये का नाही? sessionStorage secure?</span><span class="tag hot">&#128293; DEEP</span></div>
<div class="a">
<p><strong>JWT = JSON Web Token.</strong> Stateless authentication. Server token generate करतो. Client every request सोबत पाठवतो.</p>
<table><tr><th>Feature</th><th>JWT</th><th>Our Project (sessionStorage)</th></tr>
<tr><td>Stateless</td><td>Yes (no DB lookup)</td><td>No (simple JS check)</td></tr>
<tr><td>Expiry</td><td>Token expiry (24h)</td><td>Tab close = logout</td></tr>
<tr><td>Security</td><td>HttpOnly cookie = safer</td><td>XSS vulnerable (JS can access)</td></tr>
<tr><td>Complexity</td><td>Higher</td><td>Simple (suitable for project)</td></tr>
</table>
<div class="hbox warn2">&#9888; Future improvement: JWT with HttpOnly cookies. sessionStorage is fine for internship project scope.</div>
</div>
</div>

<!-- DEPLOYMENT -->
<div class="qa">
<div class="q"><span class="qn">T10</span><span class="qt">Project कसे deploy केले? Cloudflare, Render, Aiven म्हणजे काय?</span><span class="tag hot">&#128293; DEEP</span></div>
<div class="a">
<table><tr><th>Service</th><th>What it hosts</th><th>Why chosen</th></tr>
<tr><td>Cloudflare Pages</td><td>React Frontend (static files)</td><td>Free, global CDN, auto-deploy from GitHub</td></tr>
<tr><td>Render</td><td>Node.js Backend (server)</td><td>Free tier, auto-deploy on git push</td></tr>
<tr><td>Aiven</td><td>MySQL Database</td><td>Free managed cloud MySQL, SSL included</td></tr>
<tr><td>Cloudinary</td><td>Images CDN</td><td>Free 25GB storage, global delivery</td></tr>
</table>
<pre>// Deploy flow: git push = GitHub = Cloudflare/Render auto-detect = build = deploy
// Render starts backend:
npm start  ->  node Customer.js  ->  PORT=3000
// Cloudflare Pages builds frontend:
npm run build  ->  Vite builds  ->  dist/ folder deployed</pre>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">T11</span><span class="qt">Axios vs fetch()? package.json, node_modules, .gitignore?</span><span class="tag con">&#128218; CONCEPT</span></div>
<div class="a">
<table><tr><th>Feature</th><th>Axios (Used)</th><th>fetch() (native)</th></tr>
<tr><td>JSON auto-parse</td><td>Yes (automatic)</td><td>No (.json() call needed)</td></tr>
<tr><td>Error handling</td><td>4xx/5xx = catch block</td><td>4xx/5xx NOT caught (manual check)</td></tr>
<tr><td>Timeout</td><td>Configurable easily</td><td>AbortController needed</td></tr>
</table>
<pre>// package.json - project metadata + dependencies list
// npm install - reads package.json, downloads all deps
// node_modules/ - actual downloaded code (~50MB+)

// .gitignore - GitHub var push nako:
node_modules/   // huge, anyone can npm install
.env            // SECRET KEYS - never commit!</pre>
<div class="hbox dang">&#10060; .env GitHub var geli tar API keys, DB passwords LEAK! Always add .env to .gitignore!</div>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">T12</span><span class="qt">हे code बघा: const [data] = await db.query(sql) — [] destructuring का?</span><span class="tag hot">&#128293; CODE POINT</span></div>
<div class="a">
<pre>// mysql2 .promise() returns array: [rows, fields]
// rows   = actual data (array of row objects)
// fields = column metadata (rarely needed)

const result = await db.query("SELECT * FROM customers");
// result = [ [{id:1, name:'Raj'}, {id:2,...}], [fieldInfo] ]

// Array destructuring - only rows needed:
const [rows] = await db.query("SELECT * FROM customers");
// rows = [{id:1, name:'Raj'}, {id:2,...}]

// For single record:
const [customer] = await db.query("SELECT * FROM customers WHERE email=?", [email]);
const user = customer[0];  // first result</pre>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">T13</span><span class="qt">reduce() explain करा. order total कसे calculate होतो?</span><span class="tag hot">&#128293; CODE POINT</span></div>
<div class="a">
<pre>// Array.reduce() - array to single value
const cartItems = [
  { part_name: "Brake Pad", price: 500, quantity: 2 },  // = 1000
  { part_name: "Air Filter", price: 300, quantity: 1 }, // =  300
];

const total = cartItems.reduce((acc, item) => {
  return acc + (item.price * item.quantity);
  // iter 1: acc=0    + (500*2) = 1000
  // iter 2: acc=1000 + (300*1) = 1300
}, 0);  // 0 = initial accumulator value

console.log(total);  // 1300 = Total Order Amount in Rs.</pre>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">T14</span><span class="qt">ENUM data type काय? orders.status मध्ये का? SQL vs NoSQL - MySQL का?</span><span class="tag con">&#128218; CONCEPT</span></div>
<div class="a">
<pre>-- ENUM = predefined list of allowed values only
status ENUM('Ordered','Accepted','Delivered','Declined') DEFAULT 'Ordered'
-- Wrong value = MySQL ERROR automatically!
-- Storage efficient (stored as integer internally)</pre>
<table><tr><th>Feature</th><th>MySQL (SQL) Used</th><th>MongoDB (NoSQL)</th></tr>
<tr><td>Structure</td><td>Tables, fixed schema</td><td>Documents, flexible</td></tr>
<tr><td>Relationships</td><td>Foreign Keys, JOINs - perfect for our data</td><td>Embedding (complex)</td></tr>
<tr><td>ACID</td><td>Full compliance</td><td>Partial</td></tr>
</table>
<p>Why MySQL? Our data highly relational: customers orders order_items spare_parts. JOINs needed. ACID important for orders.</p>
</div>
</div>

<div class="qa">
<div class="q"><span class="qn">T15</span><span class="qt">ACID म्हणजे काय? Transactions project मध्ये आहेत का? Git workflow?</span><span class="tag con">&#128218; CONCEPT</span></div>
<div class="a">
<table><tr><th>ACID</th><th>Meaning</th><th>Example</th></tr>
<tr><td>Atomicity</td><td>All or nothing</td><td>Order create: all steps success or all rollback</td></tr>
<tr><td>Consistency</td><td>DB always valid state</td><td>cart.customer_id must exist in customers</td></tr>
<tr><td>Isolation</td><td>Concurrent transactions safe</td><td>Two users buying same part simultaneously</td></tr>
<tr><td>Durability</td><td>Committed data persists</td><td>Order confirmed = permanently saved</td></tr>
</table>
<pre>// Git workflow:
git add .                          // staging
git commit -m "fix: chatbot bug"  // snapshot
git push                           // GitHub upload = auto-deploy Render/Cloudflare</pre>
</div>
</div>

<!-- RAPID FIRE -->
<div class="sec"><div class="sn">B</div><div><div class="st">Rapid Fire Round (Quick Answers)</div><div class="ss">Short Q&A - examiner may ask these quickly</div></div></div>

<div class="qa">
<div class="q"><span class="qn">RF</span><span class="qt">Rapid Fire - Must Know Quick Answers</span><span class="tag hot">&#128293; MUST KNOW</span></div>
<div class="a">
<table><tr><th>Question</th><th>Answer</th></tr>
<tr><td>npm full form?</td><td>Node Package Manager</td></tr>
<tr><td>API full form?</td><td>Application Programming Interface</td></tr>
<tr><td>CRUD full form?</td><td>Create Read Update Delete</td></tr>
<tr><td>JSON full form?</td><td>JavaScript Object Notation</td></tr>
<tr><td>CDN full form?</td><td>Content Delivery Network</td></tr>
<tr><td>SMTP full form?</td><td>Simple Mail Transfer Protocol</td></tr>
<tr><td>CORS full form?</td><td>Cross-Origin Resource Sharing</td></tr>
<tr><td>SPA full form?</td><td>Single Page Application</td></tr>
<tr><td>JWT full form?</td><td>JSON Web Token</td></tr>
<tr><td>PORT 3000 for?</td><td>Node.js backend server</td></tr>
<tr><td>PORT 5173 for?</td><td>Vite dev server (React)</td></tr>
<tr><td>What is .env?</td><td>Environment variables file (secrets storage)</td></tr>
<tr><td>What is nodemon?</td><td>Auto-restart Node on file save (dev tool)</td></tr>
<tr><td>What is Vite?</td><td>Fast modern build tool for React</td></tr>
<tr><td>bcrypt salt=10 means?</td><td>2^10 = 1024 hashing iterations</td></tr>
<tr><td>Brevo port used?</td><td>2525 (Render blocks 587)</td></tr>
<tr><td>cart UNIQUE KEY purpose?</td><td>Same part cannot be in cart twice</td></tr>
<tr><td>order_id VARCHAR(6) why?</td><td>Random alphanumeric ID like A3K9XZ</td></tr>
<tr><td>DECIMAL for price why?</td><td>Exact precision (FLOAT has rounding errors)</td></tr>
<tr><td>req.body needs?</td><td>express.json() middleware</td></tr>
<tr><td>Total DB tables?</td><td>5: customers, spare_parts, cart, orders, order_items</td></tr>
<tr><td>Frontend on?</td><td>Cloudflare Pages (free CDN)</td></tr>
<tr><td>Backend on?</td><td>Render (free tier)</td></tr>
<tr><td>DB hosted on?</td><td>Aiven (cloud MySQL)</td></tr>
<tr><td>Images hosted on?</td><td>Cloudinary CDN</td></tr>
<tr><td>Email provider?</td><td>Brevo SMTP (300 free emails/day)</td></tr>
<tr><td>Chatbot endpoint 1?</td><td>POST /chat (Aarya Bot - rule-based)</td></tr>
<tr><td>Chatbot endpoint 2?</td><td>POST /chat-gpt (AI - OpenRouter)</td></tr>
<tr><td>order status values?</td><td>Ordered, Accepted, Delivered, Declined</td></tr>
<tr><td>multer.memoryStorage why?</td><td>No disk write, buffer to Cloudinary directly</td></tr>
</table>
</div>
</div>

"""

# Read existing HTML, insert extra section before footer
with open(r"c:\Internship2026-27\FinalProject_Viva_Preparation.html", "r", encoding="utf-8") as f:
    content = f.read()

# Insert before footer div
insert_before = '<div class="footer">'
updated = content.replace(insert_before, extra_section + insert_before, 1)

with open(r"c:\Internship2026-27\FinalProject_Viva_Preparation.html", "w", encoding="utf-8") as f:
    f.write(updated)

import os
size = os.path.getsize(r"c:\Internship2026-27\FinalProject_Viva_Preparation.html")
print("Updated HTML:", round(size/1024, 1), "KB")
print("Extra questions added: T1-T15 + Rapid Fire (30 Q&A)")
