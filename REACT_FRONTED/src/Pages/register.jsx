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

function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    let err = "";
    if (name === "email" && !/\S+@\S+\.\S+/.test(value)) err = "Enter a valid email address";
    if (name === "password" && value.length < 6) err = "Minimum 6 characters required";
    setErrors({ ...errors, [name]: err });
  };

  const validate = () => {
    const e = {};
    if (!user.name.trim()) e.name = "Name is required";
    if (!user.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(user.email)) e.email = "Enter a valid email address";
    if (!user.password) e.password = "Password is required";
    else if (user.password.length < 6) e.password = "Minimum 6 characters required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await axios.post("https://aaryaautogarage.onrender.com/register", user);
      toast.success("Account created! Redirecting to sign in…");
      setTimeout(() => navigate("/"), 1000);
    } catch { toast.error("Registration failed. Please try again."); }
    finally { setLoading(false); }
  };

  const borderColor = (field) => errors[field] ? T.danger : focused === field ? T.blue : T.border;

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
          .mobile-accent-bar span { flex: 1; height: 3px; border-radius: 2px; }
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

      {/* Left Panel */}
      <div className="auth-left" style={{
        flex: 1, minWidth: 0,
        background: "linear-gradient(145deg, #0F172A 0%, #1E1B4B 60%, #172554 100%)",
        display: "flex", flexDirection: "column",
        padding: "3rem", position: "relative", overflow: "hidden", gap: "2rem",
      }}>
        {/* Glows */}
        <div style={{ position: "absolute", top: "-80px", right: "-60px", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,111,255,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "0", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(232,74,47,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
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
          <span style={{ color: "#FF6B35", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", display: "block", marginBottom: "0.85rem" }}>Join Free Today</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.9rem)", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1, letterSpacing: "-1px", margin: "0 0 1rem" }}>
            Start shopping<br />spare parts today.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.8, margin: 0 }}>
            Create your free account and access our full catalog of genuine auto parts — engine, brakes, electricals and more.
          </p>
        </div>

        {/* Stat cards */}
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
          {[["Free", "Account Setup"], ["1,000+", "Parts Available"], ["2–3 Days", "Delivery"]].map(([val, lbl]) => (
            <div key={lbl} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "1rem 0.85rem", backdropFilter: "blur(6px)" }}>
              <div style={{ color: "#FF6B35", fontWeight: 900, fontSize: "1.1rem", letterSpacing: "-0.3px", lineHeight: 1 }}>{val}</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.68rem", marginTop: "0.3rem" }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* How it works steps with SVG icons */}
        <div style={{ position: "relative" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 0.85rem" }}>How it works</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              ["Create your free account in under a minute",  "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"],
              ["Browse 1,000+ genuine spare parts by category", "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"],
              ["Add items to cart and place your order",        "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"],
              ["Receive parts at your doorstep in 2–3 days",   "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12"],
            ].map(([s, path], i) => (
              <div key={i} style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start", background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "0.75rem 1rem", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(255,107,53,0.2)", border: "1.5px solid rgba(255,107,53,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={path} />
                  </svg>
                </div>
                <div>
                  <div style={{ color: "#FF6B35", fontSize: "0.68rem", fontWeight: 700, marginBottom: "0.1rem" }}>Step {i + 1}</div>
                  <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", lineHeight: 1.5 }}>{s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges + footer */}
        <div style={{ position: "relative", marginTop: "auto" }}>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            {[
              ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "SSL Secured"],
              ["M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", "Free Forever"],
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

      {/* Right Panel */}
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

        {/* Mobile-only branding */}
        <div className="mobile-brand">
          <img className="mobile-brand-logo" src="/logo.png" alt="Aarya Auto Garage" />
          <div>
            <div className="mobile-brand-name">Aarya Auto Garage</div>
            <div className="mobile-brand-sub">Spare Parts Store</div>
          </div>
        </div>
        <div className="mobile-accent-bar">
          <span style={{ background: "linear-gradient(90deg, #E84A2F, #FF6B35)" }} />
          <span style={{ background: "#3B6FFF" }} />
          <span style={{ background: "#E4E9F2" }} />
        </div>

        {/* Heading — SVG rocket instead of emoji */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
          <p style={{ color: T.muted, fontSize: "0.8rem", margin: 0 }}>Get started</p>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l5-5L8.5 11l-4 5.5z"/>
            <path d="M12 15s-2-2-2-5 2-7 2-7 2 4 2 7-2 5-2 5z"/>
            <path d="M15 9s2 0 4 2-2 4-2 4"/>
          </svg>
        </div>
        <h2 style={{ color: T.text, fontSize: "1.7rem", fontWeight: 800, margin: "0 0 2.25rem", letterSpacing: "-0.5px" }}>Create your account</h2>

        <form onSubmit={submit}>
          {[
            ["r-name",  "name",     "text",     "Full Name",      "Your full name",     false],
            ["r-email", "email",    "email",    "Email Address",  "you@example.com",    false],
            ["r-pass",  "password", "password", "Password",       "Min. 6 characters",  true],
          ].map(([id, name, type, label, ph, isPassword]) => (
            <div key={name} style={{ marginBottom: "1.15rem" }}>
              <label htmlFor={id} style={{ display: "block", color: T.muted, fontSize: "0.73rem", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "0.5rem" }}>{label}</label>
              <div style={{ position: "relative" }}>
                <input
                  id={id}
                  type={isPassword ? (showPassword ? "text" : "password") : type}
                  name={name} placeholder={ph}
                  value={user[name]} onChange={change}
                  onFocus={() => setFocused(name)}
                  onBlur={() => setFocused(null)}
                  style={{
                    width: "100%",
                    padding: isPassword ? "0.78rem 2.8rem 0.78rem 1rem" : "0.78rem 1rem",
                    background: T.bg, border: `1.5px solid ${borderColor(name)}`,
                    borderRadius: "10px", color: T.text, fontSize: "0.9rem",
                    outline: "none", transition: "border-color 0.2s",
                    boxSizing: "border-box", fontFamily: T.font,
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
              {errors[name] && <p style={{ color: T.danger, fontSize: "0.76rem", margin: "0.3rem 0 0" }}>{errors[name]}</p>}
            </div>
          ))}

          <button id="register-submit" type="submit" disabled={loading} style={{
            width: "100%", padding: "0.88rem",
            background: "linear-gradient(135deg, #E84A2F, #FF6B35)",
            border: "none", borderRadius: "10px", color: "#fff",
            fontWeight: 700, fontSize: "0.95rem",
            cursor: loading ? "not-allowed" : "pointer", fontFamily: T.font,
            opacity: loading ? 0.75 : 1,
            boxShadow: "0 4px 20px rgba(232,74,47,0.35)", marginTop: "0.5rem",
          }}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", textAlign: "center", color: T.muted, fontSize: "0.85rem" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: T.blue, textDecoration: "none", fontWeight: 700 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;