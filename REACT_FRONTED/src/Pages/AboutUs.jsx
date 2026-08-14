import { useNavigate } from "react-router-dom";
import CustomerNavbar from "../Components/CustomerNavbar";

const T = {
  bg: "#F8F9FC", surface: "#FFFFFF", border: "#E4E9F2",
  text: "#111827", sub: "#374151", muted: "#6B7280",
  accent: "#E84A2F", blue: "#3B6FFF",
  font: "'Inter', 'Segoe UI', system-ui, sans-serif",
};

const ITEMS = [
  {
    icon: "🏢", color: "#3B6FFF", bg: "#EEF3FF", border: "#C7D7FF",
    title: "Who We Are",
    body: "Founded in 2010, Aarya Auto Garage has grown from a small local repair shop into one of the most trusted names in automotive care and spare parts distribution. We understand that your vehicle is more than just a mode of transportation — it's a vital part of your daily life.",
  },
  {
    icon: "🎯", color: "#E84A2F", bg: "#FFF3EF", border: "#FFD5C8",
    title: "Our Mission",
    body: "To provide high-quality, reliable, and affordable spare parts for every make and model. Whether you are looking for OEM parts or premium aftermarket alternatives, our extensive catalog ensures you find exactly what you need to keep your engine running smoothly.",
  },
  {
    icon: "✅", color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0",
    title: "Our Promise",
    body: "We take pride in our rigorous quality control, ensuring that every part that leaves our warehouse meets strict industry standards. With a dedicated team of automotive experts, we are always here to help you make the right choice for your vehicle.",
  },
];

const STATS = [
  ["15+",  "Years Experience", "#E84A2F"],
  ["1,000+","Parts In Stock",  "#3B6FFF"],
  ["50+",  "Brands Covered",   "#10B981"],
  ["10K+", "Happy Customers",  "#F59E0B"],
];

function AboutUs() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.font, display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @media (max-width: 640px) {
          .about-hero { padding: 3rem 1.5rem 2.5rem !important; }
          .about-content { padding: 2rem 1rem !important; }
          .story-card { flex-direction: column !important; padding: 1.5rem !important; gap: 1rem !important; }
          .cta-banner { padding: 2rem 1.5rem !important; text-align: center; justify-content: center !important; }
        }
      `}</style>
      <CustomerNavbar />

      {/* ── Hero Banner ── */}
      <div className="about-hero" style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #172554 100%)",
        padding: "4rem 2.5rem 3.5rem", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,111,255,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-40px", width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle, rgba(232,74,47,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "820px", margin: "0 auto", position: "relative" }}>
          <span style={{ color: "#FF6B35", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", display: "block", marginBottom: "0.6rem" }}>Our Story</span>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#FFFFFF", margin: "0 0 1rem", letterSpacing: "-1px", lineHeight: 1.1 }}>
            About{" "}
            <span style={{ background: "linear-gradient(90deg, #FF6B35, #E84A2F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Aarya Auto Garage
            </span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", lineHeight: 1.75, maxWidth: "500px", margin: 0 }}>
            Serving bike owners and mechanics across India since 2010 with genuine, affordable spare parts and expert care.
          </p>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: "820px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
          {STATS.map(([n, l, color]) => (
            <div key={l} style={{ padding: "1.75rem 1.5rem", textAlign: "center", borderRight: `1px solid ${T.border}` }}>
              <div style={{ fontSize: "2rem", fontWeight: 900, color, letterSpacing: "-1px" }}>{n}</div>
              <div style={{ color: T.muted, fontSize: "0.8rem", marginTop: "0.3rem", fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Story Cards ── */}
      <div className="about-content" style={{ flex: 1, maxWidth: "820px", margin: "0 auto", padding: "3.5rem 2rem", width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {ITEMS.map((item) => (
            <div className="story-card" key={item.title}
              style={{
                background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: "20px",
                padding: "2rem", display: "flex", gap: "1.5rem", alignItems: "flex-start",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                transition: "box-shadow 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = item.border; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = T.border; }}
            >
              <div style={{
                width: "54px", height: "54px", borderRadius: "14px", flexShrink: 0,
                background: item.bg, border: `1.5px solid ${item.border}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem",
              }}>{item.icon}</div>
              <div>
                <h3 style={{ color: T.text, fontWeight: 800, fontSize: "1.05rem", margin: "0 0 0.6rem" }}>{item.title}</h3>
                <p style={{ color: T.muted, fontSize: "0.93rem", lineHeight: 1.8, margin: 0 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Team Badges ── */}
        <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
          {[
            ["🔧", "Expert Mechanics", "Certified & experienced"],
            ["📦", "Fast Delivery",    "2–3 business days"],
            ["🤝", "Trusted Partners", "50+ verified brands"],
            ["💬", "24/7 Support",     "Always here to help"],
          ].map(([icon, title, sub]) => (
            <div key={title} style={{
              background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: "14px",
              padding: "1.25rem", textAlign: "center", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#C7D7FF"; e.currentTarget.style.background = "#EEF3FF"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.surface; }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "0.6rem" }}>{icon}</div>
              <div style={{ color: T.text, fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.2rem" }}>{title}</div>
              <div style={{ color: T.muted, fontSize: "0.75rem" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── CTA Banner ── */}
        <div className="cta-banner" style={{
          marginTop: "3rem",
          background: "linear-gradient(135deg, #0F172A, #1E1B4B)",
          borderRadius: "20px", padding: "3rem 2.5rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "2rem", flexWrap: "wrap",
          boxShadow: "0 12px 40px rgba(15,23,42,0.2)",
        }}>
          <div>
            <h3 style={{ color: "#FFFFFF", fontWeight: 900, fontSize: "1.3rem", margin: "0 0 0.4rem", letterSpacing: "-0.3px" }}>
              Ready to explore our catalogue?
            </h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", margin: 0 }}>
              Find the right part for your bike in seconds.
            </p>
          </div>
          <button onClick={() => navigate("/spareparts")} style={{
            padding: "0.9rem 2rem",
            background: "linear-gradient(135deg, #E84A2F, #FF6B35)",
            border: "none", borderRadius: "12px", color: "#fff",
            fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", fontFamily: T.font,
            boxShadow: "0 4px 18px rgba(232,74,47,0.4)", whiteSpace: "nowrap",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(232,74,47,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(232,74,47,0.4)"; }}
          >Browse Spare Parts →</button>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ background: "#0F172A", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem 2rem", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
          <img src="/logo.png" alt="" style={{ width: "18px", height: "18px", objectFit: "contain", opacity: 0.5 }} />
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>© 2025 Aarya Auto Garage. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

export default AboutUs;
