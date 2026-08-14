import { useState } from "react";
import axios from "axios";
import CustomerNavbar from "../Components/CustomerNavbar";
import { toast } from "../Components/Toast";

const T = {
  bg: "#F8F9FC", surface: "#FFFFFF", border: "#E4E9F2",
  text: "#111827", sub: "#374151", muted: "#6B7280",
  accent: "#E84A2F", blue: "#3B6FFF",
  success: "#10B981", font: "'Inter', 'Segoe UI', system-ui, sans-serif",
};

/* ── SVG icon components ── */
const IconLocation = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.82-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/>
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const INFO_CARDS = [
  { Icon: IconLocation, title: "Location",  val: "Radhanagari, Maharashtra", color: "#3B6FFF", bg: "#EEF3FF", border: "#C7D7FF", href: null },
  { Icon: IconClock,    title: "Hours",     val: "Mon–Sat: 9am – 7pm",       color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0", href: null },
  { Icon: IconPhone,    title: "Phone",     val: "+91 98765 43210",           color: "#E84A2F", bg: "#FFF3EF", border: "#FFD5C8", href: "tel:+919876543210" },
  { Icon: IconMail,     title: "Email",     val: "aaryaautogarage@gmail.com", color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", href: "mailto:aaryaautogarage@gmail.com" },
];

function ContactUs() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [focused, setFocused] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    setStatus("sending");
    try {
      await axios.post("https://aaryaautogarage.onrender.com/contact", data);
      setStatus("sent");
      e.target.reset();
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error("Contact form error:", err);
      toast.error("Error sending message: " + (err.response?.data?.message || err.message));
      setStatus("idle");
    }
  };

  const inputStyle = (field) => ({
    width: "100%", boxSizing: "border-box",
    padding: "0.78rem 1rem", background: T.bg,
    border: `1.5px solid ${focused === field ? T.blue : T.border}`,
    borderRadius: "10px", color: T.text, fontSize: "0.9rem",
    outline: "none", fontFamily: T.font, transition: "border-color 0.2s",
    opacity: status === "sending" ? 0.6 : 1,
  });

  const isSending = status === "sending";
  const isSent    = status === "sent";

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.font, display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes spin       { to { transform: rotate(360deg); } }
        @keyframes progress   { from { width: 0% } to { width: 100% } }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes checkPop {
          0%   { transform: scale(0.4); opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-6px); opacity: 1; }
        }
        .send-btn:hover:not(:disabled) { transform: translateY(-2px) !important; box-shadow: 0 10px 28px rgba(232,74,47,0.48) !important; }
        .send-btn:active:not(:disabled) { transform: translateY(0) !important; }
        @media (max-width: 640px) {
          .contact-hero    { padding: 3rem 1.5rem 2.5rem !important; }
          .contact-content { padding: 1.5rem 1rem !important; }
          .info-grid       { grid-template-columns: 1fr !important; }
          .form-header     { padding: 1.5rem !important; }
          .form-body       { padding: 1.5rem !important; }
        }
      `}</style>
      <CustomerNavbar />

      {/* ── Hero ── */}
      <div className="contact-hero" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #172554 100%)", padding: "4rem 2.5rem 3.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,111,255,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "5%", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(232,74,47,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "640px", margin: "0 auto", position: "relative" }}>
          <span style={{ color: "#FF6B35", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", display: "block", marginBottom: "0.6rem" }}>Support</span>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#FFFFFF", margin: "0 0 1rem", letterSpacing: "-1px", lineHeight: 1.1 }}>
            Contact Us
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", lineHeight: 1.75, margin: 0 }}>
            Have a question about a part? Need help with your order? We're here for you.
          </p>
        </div>
      </div>

      <div className="contact-content" style={{ flex: 1, maxWidth: "640px", margin: "0 auto", padding: "3.5rem 2rem", width: "100%", boxSizing: "border-box" }}>

        {/* ── Info cards ── */}
        <div className="info-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          {INFO_CARDS.map(({ Icon, title, val, color, bg, border, href }) => {
            const Wrapper = href ? "a" : "div";
            return (
              <Wrapper key={title} href={href} style={{
                background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: "14px",
                padding: "1.25rem", display: "flex", gap: "0.85rem", alignItems: "flex-start",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "all 0.2s",
                textDecoration: "none", color: "inherit", cursor: href ? "pointer" : "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = bg; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.surface; }}
              >
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: bg, border: `1.5px solid ${border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color, flexShrink: 0,
                }}>
                  <Icon />
                </div>
                <div>
                  <div style={{ color: T.sub, fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.2rem" }}>{title}</div>
                  <div style={{ color: T.muted, fontSize: "0.8rem", lineHeight: 1.4 }}>{val}</div>
                </div>
              </Wrapper>
            );
          })}
        </div>

        {/* ── Form card ── */}
        <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div className="form-header" style={{ padding: "1.75rem 2rem", borderBottom: `1px solid ${T.border}`, background: T.bg }}>
            <h2 style={{ color: T.text, fontWeight: 800, fontSize: "1.15rem", margin: 0 }}>Send us a message</h2>
            <p style={{ color: T.muted, fontSize: "0.85rem", margin: "0.3rem 0 0" }}>We'll get back to you within 24 hours.</p>
          </div>

          {/* ── Sending progress bar ── */}
          {isSending && (
            <div style={{ height: "3px", background: "#F0F4FF", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                background: "linear-gradient(90deg, #E84A2F, #FF6B35, #3B6FFF)",
                animation: "progress 1.8s ease-in-out infinite",
                borderRadius: "2px",
              }} />
            </div>
          )}

          <div className="form-body" style={{ padding: "2rem" }}>
            {isSent ? (
              /* ── Success state ── */
              <div style={{ textAlign: "center", padding: "2.5rem 1rem", animation: "fadeSlideUp 0.4s ease" }}>
                <div style={{
                  width: "80px", height: "80px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
                  border: "2px solid #A7F3D0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  color: T.success,
                  animation: "checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
                }}>
                  <IconCheck />
                </div>
                <div style={{ color: T.success, fontWeight: 800, fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  Message Sent!
                </div>
                <p style={{ color: T.muted, fontSize: "0.92rem", lineHeight: 1.6, maxWidth: "300px", margin: "0 auto" }}>
                  Thanks for reaching out. We'll reply within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {[["name", "Your Name", "text", "John Doe"], ["email", "Email Address", "email", "john@example.com"]].map(([field, label, type, ph]) => (
                  <div key={field} style={{ marginBottom: "1.15rem" }}>
                    <label style={{ display: "block", color: T.muted, fontSize: "0.73rem", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "0.5rem" }}>{label}</label>
                    <input name={field} type={type} placeholder={ph} required disabled={isSending}
                      onFocus={() => setFocused(field)}
                      onBlur={() => setFocused(null)}
                      style={inputStyle(field)}
                    />
                  </div>
                ))}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", color: T.muted, fontSize: "0.73rem", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "0.5rem" }}>Message</label>
                  <textarea name="message" placeholder="How can we help you today?" required rows={4} disabled={isSending}
                    onFocus={() => setFocused("msg")}
                    onBlur={() => setFocused(null)}
                    style={{ ...inputStyle("msg"), resize: "vertical", minHeight: "120px" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="send-btn"
                  style={{
                    width: "100%", padding: "0.9rem",
                    background: isSending
                      ? "linear-gradient(135deg, #C73B22, #E84A2F)"
                      : "linear-gradient(135deg, #E84A2F, #FF6B35)",
                    border: "none", borderRadius: "10px", color: "#fff",
                    fontWeight: 800, fontSize: "0.95rem",
                    cursor: isSending ? "not-allowed" : "pointer",
                    fontFamily: T.font,
                    boxShadow: isSending ? "none" : "0 4px 18px rgba(232,74,47,0.35)",
                    transition: "all 0.25s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                    opacity: isSending ? 0.85 : 1,
                  }}
                >
                  {isSending ? (
                    <>
                      {/* spinner */}
                      <span style={{
                        width: "17px", height: "17px", borderRadius: "50%",
                        border: "2.5px solid rgba(255,255,255,0.35)",
                        borderTopColor: "#ffffff",
                        display: "inline-block",
                        animation: "spin 0.75s linear infinite",
                        flexShrink: 0,
                      }} />
                      {/* bouncing dots */}
                      <span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                        {[0, 0.15, 0.3].map((delay, i) => (
                          <span key={i} style={{
                            width: "5px", height: "5px", borderRadius: "50%",
                            background: "rgba(255,255,255,0.85)",
                            animation: `dotBounce 1.0s ease-in-out ${delay}s infinite`,
                            display: "inline-block",
                          }} />
                        ))}
                      </span>
                      Sending
                    </>
                  ) : (
                    <>
                      <IconSend />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <footer style={{ background: "#0F172A", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem 2rem", textAlign: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>© 2025 Aarya Auto Garage. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default ContactUs;
