import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "../Components/Toast";

const T = {
  bg: "#F8F9FC", surface: "#FFFFFF", border: "#E4E9F2",
  text: "#111827", sub: "#374151", muted: "#6B7280",
  accent: "#E84A2F", blue: "#3B6FFF",
  danger: "#EF4444", font: "'Inter', 'Segoe UI', system-ui, sans-serif",
};

/* ── Eye / Eye-off SVG icons for password toggle ── */
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

/* ── Inline "Welcome back" wave SVG ── */
const WaveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "inline", verticalAlign: "middle", marginLeft: "4px" }}>
    <text y="28" fontSize="28">👋</text>
  </svg>
);

function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const change = (e) => setLogin({ ...login, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://aaryaautogarage.onrender.com/login", login);
      if (res.data.flag > 0) {
        localStorage.setItem("ID", res.data.uid);
        localStorage.setItem("Name", res.data.uname);
        sessionStorage.setItem("ID", res.data.uid);
        sessionStorage.setItem("Name", res.data.uname);
        toast.success("Welcome back! Redirecting…");
        setTimeout(() => navigate("/home"), 900);
      } else {
        toast.error(res.data.message || "Invalid credentials. Please try again.");
      }
    } catch { toast.error("Login failed. Please check your connection and try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-container" style={{ flex: 1, minHeight: "100vh", display: "flex", fontFamily: T.font, background: T.bg }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @media (max-width: 800px) {
          .auth-container {
            background: linear-gradient(145deg, #0F172A 0%, #1E1B4B 60%, #172554 100%) !important;
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
            box-shadow: 0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.12) !important;
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
          .mobile-accent-bar {
            display: flex !important;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
          }
          .mobile-accent-bar span {
            flex: 1;
            height: 3px;
            border-radius: 2px;
          }
        }
        @media (min-width: 801px) {
          .mobile-brand { display: none !important; }
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

      {/* Left Panel — brand story */}
      <div className="auth-left" style={{
        flex: 1, minWidth: 0,
        background: "linear-gradient(145deg, #0F172A 0%, #1E1B4B 60%, #172554 100%)",
        display: "flex", flexDirection: "column",
        padding: "3rem", position: "relative", overflow: "hidden", gap: "2rem",
      }}>
        {/* decorative glows */}
        <div style={{ position: "absolute", top: "-100px", right: "-80px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,111,255,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-40px", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(232,74,47,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        {/* Dot grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)", backgroundSize: "26px 26px", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <img src="/logo.png" alt="Aarya Auto Garage" style={{ width: "40px", height: "40px", objectFit: "contain" }} />
          <div>
            <div style={{ color: "#FFFFFF", fontWeight: 800, fontSize: "1rem" }}>Aarya Auto Garage</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", letterSpacing: "1px", textTransform: "uppercase" }}>Spare Parts Store</div>
          </div>
        </div>

        {/* Hero copy */}
        <div style={{ position: "relative" }}>
          <span style={{ color: "#FF6B35", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", display: "block", marginBottom: "0.85rem" }}>India's Trusted Auto Store</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.9rem)", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1, letterSpacing: "-1px", margin: "0 0 1rem" }}>
            Quality Parts,<br />Every Vehicle.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.8, margin: 0 }}>
            Browse over 1,000 genuine OEM and aftermarket spare parts. Trusted by mechanics and bike owners across India.
          </p>
        </div>

        {/* Stat cards */}
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
          {[["1,000+", "Spare Parts"], ["500+", "Customers"], ["4.9", "Rating"]].map(([val, lbl]) => (
            <div key={lbl} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "1rem 0.85rem", backdropFilter: "blur(6px)" }}>
              <div style={{ color: "#FF6B35", fontWeight: 900, fontSize: "1.35rem", letterSpacing: "-0.5px", lineHeight: 1 }}>
                {val}{lbl === "Rating" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF6B35" style={{ marginLeft: "2px", verticalAlign: "middle" }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                )}
              </div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", marginTop: "0.3rem" }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Feature rows */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            ["Genuine OEM & Aftermarket Parts", "Sourced directly from verified manufacturers"],
            ["All Major Brands Covered", "Hero, Bajaj, Honda, TVS, Royal Enfield & more"],
            ["Fast, Reliable Delivery", "Doorstep delivery within 2–3 business days"],
          ].map(([title, sub]) => (
            <div key={title} style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start", background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "0.75rem 1rem", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#FF6B35", marginTop: "5px", flexShrink: 0 }} />
              <div>
                <div style={{ color: "#FFFFFF", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.15rem" }}>{title}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.77rem", lineHeight: 1.5 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges + footer */}
        <div style={{ position: "relative", marginTop: "auto" }}>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            {[
              ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "SSL Secured"],
              ["M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", "Verified Sellers"],
              ["M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12", "Pan-India Delivery"],
              ["M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", "24/7 Support"],
            ].map(([path, label]) => (
              <span key={label} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px", padding: "0.28rem 0.7rem", color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={path}/></svg>
                {label}
              </span>
            ))}
          </div>
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.73rem" }}>© 2026 Aarya Auto Garage And Spare Parts Store</div>
        </div>
      </div>

      {/* Right Panel — form */}
      <div className="auth-right" style={{
        width: "480px", minWidth: "320px", background: T.surface,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "3rem 3.5rem", borderLeft: `1px solid ${T.border}`,
        boxShadow: "-8px 0 40px rgba(0,0,0,0.06)",
      }}>
        {/* Back to website link */}
        <Link to="/home" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: T.muted, fontSize: "0.78rem", fontWeight: 700, textDecoration: "none", marginBottom: "1.5rem", alignSelf: "flex-start", transition: "color 0.2s", fontFamily: T.font }} onMouseEnter={e => e.currentTarget.style.color = T.text} onMouseLeave={e => e.currentTarget.style.color = T.muted}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Website
        </Link>

        {/* Mobile-only branding inside card */}
        <div className="mobile-brand">
          <img className="mobile-brand-logo" src="/logo.png" alt="Aarya Auto Garage" />
          <div>
            <div className="mobile-brand-name">Aarya Auto Garage</div>
            <div className="mobile-brand-sub">Spare Parts Store</div>
          </div>
        </div>

        {/* Mobile accent bar */}
        <div className="mobile-accent-bar">
          <span style={{ background: "linear-gradient(90deg, #E84A2F, #FF6B35)" }} />
          <span style={{ background: "#3B6FFF" }} />
          <span style={{ background: "#E4E9F2" }} />
        </div>

        {/* Heading with SVG wave */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.35rem" }}>
          <p style={{ color: T.muted, fontSize: "0.8rem", margin: 0 }}>Welcome back</p>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 3C7.5 3 6 4.5 6 6C6 7.5 7 8.5 8.5 9C10 9.5 11 10.5 11 12C11 13.5 9.5 15 8 15" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12.5 3C12.5 3 11 4.5 11 6C11 7.5 12 8.5 13.5 9C15 9.5 16 10.5 16 12C16 13.5 14.5 15 13 15" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 style={{ color: T.text, fontSize: "1.7rem", fontWeight: 800, margin: "0 0 2.25rem", letterSpacing: "-0.5px" }}>Sign in to your account</h2>

        <form onSubmit={submit}>
          {/* Email field */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", color: T.muted, fontSize: "0.73rem", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "0.5rem" }}>Email Address</label>
            <input
              type="email" name="email" placeholder="you@example.com" value={login.email}
              onChange={change} required
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              style={{
                width: "100%", padding: "0.78rem 1rem",
                background: T.bg, border: `1.5px solid ${focused === "email" ? T.blue : T.border}`,
                borderRadius: "10px", color: T.text, fontSize: "0.9rem",
                outline: "none", transition: "border-color 0.2s",
                boxSizing: "border-box", fontFamily: T.font,
              }}
            />
          </div>

          {/* Password field with toggle */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", color: T.muted, fontSize: "0.73rem", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "0.5rem" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password" placeholder="Enter your password" value={login.password}
                onChange={change} required
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                style={{
                  width: "100%", padding: "0.78rem 2.8rem 0.78rem 1rem",
                  background: T.bg, border: `1.5px solid ${focused === "password" ? T.blue : T.border}`,
                  borderRadius: "10px", color: T.text, fontSize: "0.9rem",
                  outline: "none", transition: "border-color 0.2s",
                  boxSizing: "border-box", fontFamily: T.font,
                }}
              />
              <button
                type="button"
                className="pw-toggle-btn"
                onClick={() => setShowPassword(v => !v)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "0.88rem",
            background: "linear-gradient(135deg, #E84A2F, #FF6B35)",
            border: "none", borderRadius: "10px", color: "#fff",
            fontWeight: 700, fontSize: "0.95rem",
            cursor: loading ? "not-allowed" : "pointer", fontFamily: T.font,
            opacity: loading ? 0.75 : 1,
            boxShadow: "0 4px 20px rgba(232,74,47,0.35)", marginTop: "0.5rem",
            transition: "all 0.2s",
          }}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", textAlign: "center", color: T.muted, fontSize: "0.85rem" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: T.blue, textDecoration: "none", fontWeight: 700 }}>Create one</Link>
        </p>
        <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: `1px solid ${T.border}`, textAlign: "center" }}>
          <Link to="/admin" style={{ color: T.muted, fontSize: "0.78rem", textDecoration: "none" }}>Admin Panel →</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
