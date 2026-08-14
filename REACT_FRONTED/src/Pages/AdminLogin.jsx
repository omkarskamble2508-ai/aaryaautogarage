import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "../Components/Toast";

const ADMIN_USER = "admin";
const ADMIN_PASS = "omkar@2026";

const T = {
  bg: "#F8F9FC", surface: "#FFFFFF", border: "#E4E9F2",
  text: "#111827", muted: "#6B7280",
  blue: "#3B6FFF", accent: "#E84A2F",
  danger: "#EF4444", font: "'Inter', 'Segoe UI', system-ui, sans-serif",
};

/* ── Eye / Eye-off SVG icons ── */
const EyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

function AdminLogin() {
  const navigate = useNavigate();
  const [creds,   setCreds]   = useState({ username: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const change = (e) => { setCreds({ ...creds, [e.target.name]: e.target.value }); if (error) setError(""); };

  const submit = (e) => {
    e.preventDefault(); setLoading(true);
    setTimeout(() => {
      if (creds.username === ADMIN_USER && creds.password === ADMIN_PASS) {
        sessionStorage.setItem("ADMIN_AUTH", "true");
        sessionStorage.setItem("ADMIN_NAME", "Administrator");
        toast.success("Access granted. Welcome, Administrator!");
        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        setError("Invalid username or password. Access denied.");
        toast.error("Admin access denied. Check your credentials.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="auth-container" style={{ flex: 1, minHeight:"100vh", display:"flex", fontFamily:T.font, background:T.bg }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @media (max-width: 800px) {
          .auth-container {
            background: linear-gradient(145deg, #0F172A 0%, #1E293B 60%, #0F172A 100%) !important;
            justify-content: center;
            align-items: center;
            padding: 1.5rem;
            box-sizing: border-box;
          }
          .auth-left { display: none !important; }
          .auth-right {
            width: 100% !important;
            max-width: 420px !important;
            min-width: 0 !important;
            padding: 2.25rem 2rem !important;
            border-left: none !important;
            border-radius: 28px !important;
            background: rgba(255,255,255,0.97) !important;
            box-shadow: 0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.1) !important;
            position: relative;
          }
          .mobile-brand {
            display: flex !important;
            align-items: center;
            justify-content: center;
            gap: 0.6rem;
            margin-bottom: 1.75rem;
            padding-bottom: 1.5rem;
            border-bottom: 1.5px solid #E4E9F2;
          }
          .mobile-brand-logo { width: 38px; height: 38px; object-fit: contain; }
          .mobile-brand-name { font-size: 1rem; font-weight: 800; color: #111827; }
          .mobile-brand-sub { font-size: 0.6rem; letter-spacing: 1px; text-transform: uppercase; color: #6B7280; }
          .mobile-admin-badge {
            display: inline-flex !important;
            align-items: center;
            gap: 0.4rem;
            background: #EEF2FF;
            border: 1.5px solid #C7D2FE;
            border-radius: 100px;
            padding: 0.35rem 0.85rem;
            margin-bottom: 1.25rem;
          }
          .mobile-accent-bar {
            display: flex !important;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
          }
          .mobile-accent-bar span { flex: 1; height: 3px; border-radius: 2px; }
        }
        @media (min-width: 801px) {
          .mobile-brand { display: none !important; }
          .mobile-admin-badge { display: none !important; }
          .mobile-accent-bar { display: none !important; }
        }
        .pw-toggle-btn {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #6B7280; padding: 4px; line-height: 1;
          display: flex; align-items: center; justify-content: center;
          border-radius: 6px; transition: color 0.18s, background 0.18s;
        }
        .pw-toggle-btn:hover { color: #111827; background: rgba(0,0,0,0.05); }
      `}</style>

      {/* Left panel */}
      <div className="auth-left" style={{
        flex:1, minWidth:0,
        background:"linear-gradient(145deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)",
        display:"flex", flexDirection:"column",
        padding:"3rem", position:"relative", overflow:"hidden", gap:"2rem",
      }}>
        {/* Glows */}
        <div style={{ position:"absolute", top:"-80px", right:"-60px", width:"320px", height:"320px", borderRadius:"50%", background:"radial-gradient(circle, rgba(59,111,255,0.2) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-60px", left:"-40px", width:"250px", height:"250px", borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)", pointerEvents:"none" }} />
        {/* Dot grid */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize:"26px 26px", pointerEvents:"none" }} />

        {/* Logo */}
        <div style={{ position:"relative", display:"flex", alignItems:"center", gap:"0.7rem" }}>
          <img src="/logo.png" alt="Aarya Auto Garage" style={{ width:"40px", height:"40px", objectFit:"contain" }} />
          <div>
            <div style={{ color:"#FFFFFF", fontWeight:800, fontSize:"1rem" }}>Aarya Auto Garage</div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.65rem", letterSpacing:"1px", textTransform:"uppercase" }}>Admin Panel</div>
          </div>
        </div>

        {/* Restricted badge + Hero */}
        <div style={{ position:"relative" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:"100px", padding:"0.35rem 0.85rem", marginBottom:"1.25rem" }}>
            <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#6366F1", display:"inline-block" }} />
            <span style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.72rem", fontWeight:600, letterSpacing:"1px", textTransform:"uppercase" }}>Restricted Access</span>
          </div>
          <h1 style={{ fontSize:"clamp(1.8rem, 3vw, 2.8rem)", fontWeight:900, color:"#FFFFFF", lineHeight:1.1, letterSpacing:"-1px", margin:"0 0 1rem" }}>
            Admin Control<br />Center
          </h1>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.9rem", lineHeight:1.8, margin:0 }}>
            Authorized administrators only. Manage products, customers, orders, and the AI chatbot from one powerful dashboard.
          </p>
        </div>

        {/* Stat cards */}
        <div style={{ position:"relative", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.75rem" }}>
          {[["Full", "Access Control"], ["Live", "Order Tracking"], ["AI", "Chatbot Mgmt"]].map(([val, lbl]) => (
            <div key={lbl} style={{ background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:"14px", padding:"1rem 0.85rem", backdropFilter:"blur(6px)" }}>
              <div style={{ color:"#818CF8", fontWeight:900, fontSize:"1.1rem", letterSpacing:"-0.3px", lineHeight:1 }}>{val}</div>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.68rem", marginTop:"0.3rem" }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Management capabilities */}
        <div style={{ position:"relative", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
          {[
            ["M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", "Product & Inventory Management", "Add, edit, and track spare part stock levels"],
            ["M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", "Customer & User Management", "View, manage, and support customer accounts"],
            ["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", "Order Tracking & Fulfilment", "Monitor and update order statuses in real-time"],
            ["M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z", "AI Chatbot Management", "Configure and review AI assistant interactions"],
          ].map(([path, title, sub]) => (
            <div key={title} style={{ display:"flex", gap:"0.85rem", alignItems:"flex-start", background:"rgba(255,255,255,0.04)", borderRadius:"12px", padding:"0.7rem 1rem", border:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={path} />
                </svg>
              </div>
              <div>
                <div style={{ color:"#FFFFFF", fontSize:"0.83rem", fontWeight:600, marginBottom:"0.1rem" }}>{title}</div>
                <div style={{ color:"rgba(255,255,255,0.38)", fontSize:"0.74rem", lineHeight:1.4 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ position:"relative", marginTop:"auto" }}>
          <div style={{ display:"flex", gap:"0.6rem", flexWrap:"wrap", marginBottom:"1rem" }}>
            {[
              ["M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", "Encrypted Session"],
              ["M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", "Analytics Dashboard"],
              ["M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", "Role-Based Access"],
            ].map(([path, label]) => (
              <span key={label} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"100px", padding:"0.28rem 0.7rem", color:"rgba(255,255,255,0.45)", fontSize:"0.7rem", display:"inline-flex", alignItems:"center", gap:"0.4rem" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={path}/></svg>
                {label}
              </span>
            ))}
          </div>
          <div style={{ color:"rgba(255,255,255,0.25)", fontSize:"0.73rem" }}>© 2026 Aarya Auto Garage And Spare Parts Store</div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right" style={{
        width:"460px", minWidth:"320px", background:T.surface,
        display:"flex", flexDirection:"column", justifyContent:"center",
        padding:"3rem 3.5rem", borderLeft:`1px solid ${T.border}`,
        boxShadow:"-8px 0 40px rgba(0,0,0,0.06)",
      }}>
        {/* Back to website link */}
        <Link to="/home" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: T.muted, fontSize: "0.78rem", fontWeight: 700, textDecoration: "none", marginBottom: "1.5rem", alignSelf: "flex-start", transition: "color 0.2s", fontFamily: T.font }} onMouseEnter={e => e.currentTarget.style.color = T.text} onMouseLeave={e => e.currentTarget.style.color = T.muted}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Website
        </Link>

        {/* Mobile-only branding */}
        <div className="mobile-brand">
          <img className="mobile-brand-logo" src="/logo.png" alt="Aarya Auto Garage" />
          <div>
            <div className="mobile-brand-name">Aarya Auto Garage</div>
            <div className="mobile-brand-sub">Admin Panel</div>
          </div>
        </div>
        <div className="mobile-admin-badge">
          <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#4F46E5", display:"inline-block" }} />
          <span style={{ color:"#4F46E5", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase" }}>Restricted Admin Access</span>
        </div>
        <div className="mobile-accent-bar">
          <span style={{ background: "linear-gradient(90deg, #4F46E5, #6366F1)" }} />
          <span style={{ background: "#E84A2F" }} />
          <span style={{ background: "#E4E9F2" }} />
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.5rem" }}>
          <span style={{ background:"#EEF2FF", border:"1.5px solid #C7D2FE", borderRadius:"100px", padding:"0.18rem 0.65rem", fontSize:"0.68rem", color:"#4F46E5", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>Admin</span>
          <span style={{ color:T.muted, fontSize:"0.8rem" }}>Sign in</span>
        </div>
        <h2 style={{ color:T.text, fontSize:"1.7rem", fontWeight:800, margin:"0 0 2rem", letterSpacing:"-0.5px" }}>Admin Sign In</h2>

        {/* Error alert — styled, no emoji */}
        {error && (
          <div style={{ background:"#FFF0F0", border:"1.5px solid #FFC9C9", borderRadius:"10px", padding:"0.75rem 1rem", color:T.danger, fontSize:"0.85rem", marginBottom:"1.25rem", display:"flex", alignItems:"center", gap:"0.6rem" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          {[["a-user","username","text","Username","Enter admin username",false],["a-pass","password","password","Password","Enter admin password",true]].map(([id,name,type,label,ph,isPassword]) => (
            <div key={name} style={{ marginBottom:"1.2rem" }}>
              <label htmlFor={id} style={{ display:"block", color:T.muted, fontSize:"0.73rem", fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:"0.5rem" }}>{label}</label>
              <div style={{ position: "relative" }}>
                <input
                  id={id}
                  type={isPassword ? (showPassword ? "text" : "password") : type}
                  name={name} placeholder={ph} value={creds[name]}
                  onChange={change} onFocus={()=>setFocused(name)} onBlur={()=>setFocused(null)}
                  autoComplete="off" required
                  style={{
                    width:"100%",
                    padding: isPassword ? "0.78rem 2.8rem 0.78rem 1rem" : "0.78rem 1rem",
                    background:T.bg,
                    border:`1.5px solid ${error ? T.danger : focused === name ? T.blue : T.border}`,
                    borderRadius:"10px", color:T.text, fontSize:"0.9rem",
                    outline:"none", boxSizing:"border-box", fontFamily:T.font, transition:"border-color 0.2s",
                  }}
                />
                {isPassword && (
                  <button
                    type="button"
                    className="pw-toggle-btn"
                    onClick={() => setShowPassword(v => !v)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff /> : <EyeOpen />}
                  </button>
                )}
              </div>
            </div>
          ))}

          <button id="admin-login-btn" type="submit" disabled={loading} style={{
            width:"100%", padding:"0.88rem",
            background:"linear-gradient(135deg, #4F46E5, #6366F1)",
            border:"none", borderRadius:"10px", color:"#fff",
            fontWeight:700, fontSize:"0.95rem",
            cursor: loading ? "not-allowed" : "pointer", fontFamily:T.font,
            opacity: loading ? 0.75 : 1,
            boxShadow:"0 4px 20px rgba(79,70,229,0.35)", marginTop:"0.5rem",
          }}>
            {loading ? "Verifying…" : "Sign In to Admin Panel →"}
          </button>
        </form>

        <div style={{ marginTop:"1.5rem", textAlign:"center" }}>
          <Link to="/login" style={{ color:T.muted, fontSize:"0.83rem", textDecoration:"none" }}
            onMouseEnter={e=>e.currentTarget.style.color=T.blue}
            onMouseLeave={e=>e.currentTarget.style.color=T.muted}
          >← Back to Customer Login</Link>
        </div>

        {/* Private notice — SVG lock instead of emoji */}
        <div style={{ marginTop:"1.75rem", background:"#FFFBEB", border:"1.5px solid #FDE68A", borderRadius:"10px", padding:"0.85rem 1rem", display:"flex", gap:"0.65rem", alignItems:"flex-start" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:"1px" }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <p style={{ color:"#92400E", fontSize:"0.78rem", lineHeight:1.6, margin:0 }}>
            This is a private admin panel. Customer login is at{" "}
            <Link to="/login" style={{ color:"#B45309", fontWeight:700 }}>/login</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
