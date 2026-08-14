import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import CustomerNavbar from "../Components/CustomerNavbar";
import { toast } from "../Components/Toast";

/* ── Design tokens ── */
const T = {
  bg:         "#F8F9FC",
  surface:    "#FFFFFF",
  card:       "#FFFFFF",
  cardHover:  "#F0F4FF",
  border:     "#E4E9F2",
  text:       "#111827",
  sub:        "#374151",
  muted:      "#6B7280",
  accent:     "#E84A2F",
  accentHov:  "#C73B22",
  blue:       "#3B6FFF",
  blueHov:    "#2554E8",
  font:       "'Inter', 'Segoe UI', system-ui, sans-serif",
};

const CATEGORIES = [
  { name: "Engine",      sub: "Pistons, gaskets, valves",   icon: "⚙️",  color: "#FF6B35", bg: "#FFF3EF", border: "#FFD5C8" },
  { name: "Brakes",      sub: "Pads, discs, calipers",      icon: "🛑",  color: "#EF4444", bg: "#FFF0F0", border: "#FFC9C9" },
  { name: "Suspension",  sub: "Shocks, springs, struts",    icon: "🔩",  color: "#8B5CF6", bg: "#F5F0FF", border: "#DDD6FE" },
  { name: "Electricals", sub: "Batteries, CDI, wiring",     icon: "⚡",  color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" },
  { name: "Body Parts",  sub: "Panels, bumpers, covers",    icon: "🚗",  color: "#3B6FFF", bg: "#EEF3FF", border: "#C7D7FF" },
  { name: "Filters",     sub: "Air, oil & fuel filters",    icon: "🔧",  color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0" },
];

const BRANDS = ["Hero", "Bajaj", "Honda", "TVS", "Royal Enfield", "Suzuki", "KTM", "Yamaha"];

const WHY = [
  { label: "Genuine Parts",   desc: "OEM & aftermarket, sourced from verified manufacturers.", icon: "✅", color: "#10B981" },
  { label: "All Bike Brands", desc: "1,000+ parts covering every major Indian brand.",         icon: "🏍️", color: "#3B6FFF" },
  { label: "Fast Delivery",   desc: "Doorstep delivery in 2–3 business days across India.",   icon: "📦", color: "#F59E0B" },
  { label: "30-Day Returns",  desc: "Hassle-free returns on all orders, no questions asked.",  icon: "↩️", color: "#E84A2F" },
];

function CustomerHome() {
  const navigate = useNavigate();
  const [parts, setParts] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const customerId = localStorage.getItem("ID") || sessionStorage.getItem("ID");

  useEffect(() => {
    axios.get("http://localhost:3000/spare_parts").then(r => setParts(r.data.slice(0, 8))).catch(() => {});
  }, []);

  const addToCart = async (partId, e) => {
    e.stopPropagation();
    if (!customerId) { toast.warning("Please log in to add products to the cart."); navigate("/login"); return; }
    try {
      await axios.post("http://localhost:3000/cart/add", { customer_id: customerId, part_id: partId });
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Item added to cart!");
    } catch { toast.error("Could not add to cart"); }
  };

  const buyNow = async (partId, e) => {
    e.stopPropagation();
    if (!customerId) { toast.warning("Please log in to proceed with the purchase."); navigate("/login"); return; }
    try {
      await axios.post("http://localhost:3000/cart/add", { customer_id: customerId, part_id: partId });
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/checkout");
    } catch { toast.error("Could not process Buy Now"); }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.font }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @media (max-width: 640px) {
          .customer-hero {
            padding: 3rem 1.5rem 2.5rem !important;
          }
          .hero-buttons {
            flex-wrap: nowrap !important;
            gap: 0.5rem !important;
          }
          .hero-buttons > a {
            flex: 1;
            text-align: center;
            padding: 0.8rem 0.2rem !important;
            font-size: 0.8rem !important;
          }
          .hero-stats {
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
            gap: 1.5rem !important;
          }
          .mobile-grid-2 {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
            gap: 0.6rem !important;
          }
          .category-card { padding: 1rem 0.6rem !important; }
          .category-icon { width: 38px !important; height: 38px !important; font-size: 1.2rem !important; margin-bottom: 0.4rem !important; }
          .product-card { padding: 0.8rem !important; }
          .product-img-box { height: 110px !important; margin-bottom: 0.5rem !important; }
          .product-price { font-size: 1rem !important; }
          .why-us-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important; gap: 0.75rem !important; }
          .why-us-card { padding: 1.25rem 0.8rem !important; }
          .why-us-icon { width: 38px !important; height: 38px !important; font-size: 1.2rem !important; margin-bottom: 0.75rem !important; }
          .section-padding { padding: 3rem 1.25rem !important; }
          .brands-grid {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 0.5rem !important;
          }
          .brand-btn {
            padding: 0.5rem 0.2rem !important;
            font-size: 0.75rem !important;
            width: 100% !important;
            text-align: center !important;
            box-sizing: border-box !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          .mobile-footer {
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            padding-bottom: 6rem !important;
          }
          .mobile-footer-links {
            justify-content: center !important;
            margin-top: 0.5rem !important;
          }
          .footer-brand-img {
            width: 20px !important;
            height: 20px !important;
          }
        }
      `}</style>
      <CustomerNavbar />

      {/* ── HERO ── */}
      <div className="customer-hero" style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #172554 100%)",
        padding: "6rem 2.5rem 5rem",
        position: "relative", overflow: "hidden",
      }}>
        {/* decorative blobs */}
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,111,255,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "10%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(232,74,47,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "960px", margin: "0 auto", position: "relative" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: "100px",
            padding: "0.4rem 1rem", color: "rgba(255,255,255,0.75)",
            fontSize: "0.74rem", fontWeight: 600, letterSpacing: "0.5px",
            marginBottom: "2rem",
          }}>
            🏍️ India's #1 Bike Spare Parts Store
          </span>

          <h1 style={{
            fontSize: "clamp(2.4rem, 5.5vw, 4rem)", fontWeight: 900,
            color: "#FFFFFF", lineHeight: 1.08, letterSpacing: "-2px",
            margin: "0 0 1.5rem",
          }}>
            The Right Part,<br />
            <span style={{ background: "linear-gradient(90deg, #FF6B35, #E84A2F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Every Time.
            </span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.1rem", lineHeight: 1.75, maxWidth: "520px", margin: "0 0 2.5rem" }}>
            Genuine OEM and aftermarket spare parts for every major bike brand.
            Search, order, and receive — fast.
          </p>

          <div className="hero-buttons" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link to="/spareparts" style={{
              padding: "0.9rem 2rem",
              background: "linear-gradient(135deg, #E84A2F, #FF6B35)",
              border: "none", borderRadius: "10px", color: "#fff",
              fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
              textDecoration: "none", display: "inline-block",
              boxShadow: "0 6px 24px rgba(232,74,47,0.45)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(232,74,47,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(232,74,47,0.45)"; }}
            >Browse Parts →</Link>

            <Link to="/contact" style={{
              padding: "0.9rem 2rem",
              background: "rgba(255,255,255,0.08)", backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "10px", color: "rgba(255,255,255,0.85)",
              fontWeight: 600, fontSize: "0.95rem", cursor: "pointer",
              textDecoration: "none", display: "inline-block",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.16)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            >Contact Support</Link>
          </div>

          {/* Stats */}
          <div className="hero-stats" style={{
            display: "flex", gap: "2.5rem", marginTop: "4rem",
            paddingTop: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.1)", flexWrap: "wrap",
          }}>
            {[["1,000+", "Spare parts"], ["50+", "Bike brands"], ["10,000+", "Customers served"], ["24/7", "Support"]].map(([n, l]) => (
              <div key={l}>
                <span style={{ color: "#fff", fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-1px", display: "block" }}>{n}</span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: "0.2rem", display: "block" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div className="section-padding" style={{ maxWidth: "1150px", margin: "0 auto", padding: "5rem 2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ color: T.accent, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", display: "block", marginBottom: "0.6rem" }}>Categories</span>
          <h2 style={{ color: T.text, fontSize: "2rem", fontWeight: 800, margin: "0 0 0.6rem", letterSpacing: "-0.5px" }}>Shop by Part Type</h2>
          <p style={{ color: T.muted, fontSize: "0.95rem", margin: 0 }}>Click a category to instantly filter matching parts</p>
        </div>

        <div className="mobile-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: "1rem" }}>
          {CATEGORIES.map(cat => (
            <div
              className="category-card"
              key={cat.name}
              onClick={() => navigate(`/spareparts?category=${encodeURIComponent(cat.name)}`)}
              style={{
                background: T.card, borderRadius: "14px", padding: "1.75rem 1.25rem",
                border: `1.5px solid ${T.border}`,
                cursor: "pointer", transition: "all 0.22s ease",
                display: "flex", flexDirection: "column", gap: "0.5rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = cat.color;
                e.currentTarget.style.background = cat.bg;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 12px 28px ${cat.color}22`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.background = T.card;
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
              }}
            >
              <div className="category-icon" style={{
                width: "50px", height: "50px", borderRadius: "12px",
                background: cat.bg, border: `1.5px solid ${cat.border}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem",
                marginBottom: "0.5rem",
              }}>{cat.icon}</div>
              <div style={{ color: T.text, fontWeight: 700, fontSize: "0.95rem" }}>{cat.name}</div>
              <div style={{ color: T.muted, fontSize: "0.77rem", lineHeight: 1.45 }}>{cat.sub}</div>
              <span style={{ color: cat.color, fontSize: "0.8rem", fontWeight: 600, marginTop: "0.5rem" }}>Browse →</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── BRANDS ── */}
      <div className="section-padding" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "3rem 2.5rem" }}>
        <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <span style={{ color: T.accent, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Brands</span>
            <h2 style={{ color: T.text, fontSize: "1.7rem", fontWeight: 800, margin: "0 0 0.4rem", letterSpacing: "-0.5px" }}>Parts for Every Brand</h2>
            <p style={{ color: T.muted, fontSize: "0.9rem", margin: 0 }}>All major Indian and international manufacturers</p>
          </div>
          <div className="brands-grid" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            {BRANDS.map(b => (
              <button className="brand-btn" key={b}
                onClick={() => navigate(`/spareparts?category=${encodeURIComponent(b)}`)}
                style={{
                  padding: "0.55rem 1.4rem", background: T.bg,
                  border: `1.5px solid ${T.border}`, borderRadius: "100px",
                  color: T.sub, fontSize: "0.88rem", fontWeight: 600,
                  cursor: "pointer", transition: "all 0.18s", fontFamily: T.font,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#EEF3FF"; e.currentTarget.style.borderColor = T.blue; e.currentTarget.style.color = T.blue; }}
                onMouseLeave={e => { e.currentTarget.style.background = T.bg; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.sub; }}
              >{b}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURED PARTS ── */}
      {parts.length > 0 && (
        <div className="section-padding" style={{ maxWidth: "1150px", margin: "0 auto", padding: "5rem 2.5rem" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span style={{ color: T.accent, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>Featured</span>
              <h2 style={{ color: T.text, fontSize: "2rem", fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>Popular Parts</h2>
            </div>
            <Link to="/spareparts" style={{
              padding: "0.65rem 1.4rem", border: `1.5px solid ${T.border}`, borderRadius: "8px",
              color: T.sub, fontWeight: 600, fontSize: "0.88rem", textDecoration: "none",
              background: T.surface, transition: "all 0.18s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.blue; e.currentTarget.style.color = T.blue; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.sub; }}
            >View all →</Link>
          </div>

          <div className="mobile-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {parts.map(part => (
              <div className="product-card" key={part.part_id}
                onClick={() => navigate(`/product/${part.part_id}`)}
                onMouseEnter={() => setHoveredCard(part.part_id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: T.card, borderRadius: "16px",
                  border: `1.5px solid ${hoveredCard === part.part_id ? T.blue : T.border}`,
                  padding: "1.25rem", transition: "all 0.22s ease",
                  display: "flex", flexDirection: "column", cursor: "pointer",
                  boxShadow: hoveredCard === part.part_id ? "0 12px 32px rgba(59,111,255,0.12)" : "0 2px 8px rgba(0,0,0,0.04)",
                  transform: hoveredCard === part.part_id ? "translateY(-4px)" : "none",
                }}
              >
                <div className="product-img-box" style={{
                  width: "100%", height: "150px", marginBottom: "1rem", borderRadius: "10px",
                  overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#F8F9FC", border: `1px solid ${T.border}`,
                }}>
                  {part.image
                    ? <img src={part.image} alt={part.part_name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    : <span style={{ fontSize: "2.5rem" }}>🔩</span>}
                </div>
                <p style={{ color: T.text, fontWeight: 700, fontSize: "0.93rem", margin: "0 0 0.25rem", lineHeight: 1.35 }}>{part.part_name}</p>
                <p style={{ color: T.muted, fontSize: "0.78rem", margin: "0 0 1rem" }}>{part.brand || "—"}</p>
                <div style={{ marginTop: "auto" }}>
                  <div style={{ marginBottom: "0.75rem" }}>
                    <span className="product-price" style={{ color: T.accent, fontWeight: 800, fontSize: "1.15rem" }}>₹{Number(part.price).toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button style={{
                      flex: 1, padding: "0.6rem 0.5rem",
                      background: "linear-gradient(135deg, #E84A2F, #FF6B35)",
                      border: "none", borderRadius: "8px", color: "#fff",
                      fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: T.font,
                      boxShadow: "0 3px 12px rgba(232,74,47,0.35)",
                      transition: "all 0.15s",
                    }}
                      onClick={e => addToCart(part.part_id, e)}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(232,74,47,0.45)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 3px 12px rgba(232,74,47,0.35)"; }}
                    >+ Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── WHY US ── */}
      <div className="section-padding" style={{ background: "linear-gradient(135deg, #0F172A, #1E1B4B)", padding: "5rem 2.5rem" }}>
        <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{ color: "#FF6B35", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", display: "block", marginBottom: "0.6rem" }}>Why us</span>
            <h2 style={{ color: "#FFFFFF", fontSize: "2rem", fontWeight: 800, margin: "0 0 0.6rem", letterSpacing: "-0.5px" }}>Built for bike owners & mechanics</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", margin: 0 }}>Everything you need in one place</p>
          </div>
          <div className="why-us-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {WHY.map(w => (
              <div className="why-us-card" key={w.label} style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)", borderRadius: "16px", padding: "2rem 1.5rem",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              >
                <div className="why-us-icon" style={{
                  width: "48px", height: "48px", borderRadius: "12px",
                  background: `${w.color}22`, border: `1.5px solid ${w.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.4rem", marginBottom: "1.25rem",
                }}>{w.icon}</div>
                <div style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "1rem", marginBottom: "0.6rem" }}>{w.label}</div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <div className="section-padding" style={{ padding: "5rem 2.5rem", maxWidth: "1150px", margin: "0 auto" }}>
        <div style={{
          background: "linear-gradient(135deg, #E84A2F 0%, #FF6B35 50%, #E84A2F 100%)",
          borderRadius: "20px", padding: "3.5rem 3rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "2rem", flexWrap: "wrap",
          boxShadow: "0 20px 60px rgba(232,74,47,0.3)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: "-40px", right: "5%", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <h3 style={{ color: "#FFFFFF", fontWeight: 800, fontSize: "1.6rem", margin: "0 0 0.5rem", letterSpacing: "-0.5px" }}>Ready to order?</h3>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.92rem", margin: 0 }}>Browse our full catalog and get parts delivered fast.</p>
          </div>
          <Link to="/spareparts" style={{
            padding: "0.9rem 2.2rem",
            background: "#FFFFFF", border: "none", borderRadius: "10px",
            color: T.accent, fontWeight: 800, fontSize: "0.95rem",
            textDecoration: "none", display: "inline-block", position: "relative",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            transition: "transform 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
          >Browse Spare Parts →</Link>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="mobile-footer" style={{
        background: "#0F172A", borderTop: `1px solid rgba(255,255,255,0.08)`,
        padding: "2rem 2.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
          <img className="footer-brand-img" src="/logo.png" alt="Aarya Auto Garage" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>© 2025 Aarya Auto Garage. All rights reserved.</span>
        </div>
        <div className="mobile-footer-links" style={{ display: "flex", gap: "1.5rem" }}>
          {["Privacy Policy", "Terms", "Contact"].map(l => (
            <a key={l} href="#" style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.75)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default CustomerHome;
