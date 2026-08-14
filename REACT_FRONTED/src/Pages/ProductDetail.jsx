import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import CustomerNavbar from "../Components/CustomerNavbar";
import { toast } from "../Components/Toast";

const T = {
  bg: "#F8F9FC", surface: "#FFFFFF", border: "#E4E9F2",
  text: "#111827", sub: "#374151", muted: "#6B7280",
  accent: "#E84A2F", blue: "#3B6FFF",
  success: "#10B981", danger: "#EF4444",
  font: "'Inter', 'Segoe UI', system-ui, sans-serif",
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customerId = sessionStorage.getItem("ID") || localStorage.getItem("ID");
  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    axios.get(`https://aaryaautogarage.onrender.com/spare_parts/${id}`)
      .then(r => setPart(r.data))
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const Shell = ({ children }) => (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font, display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @media (max-width: 768px) {
          .detail-container { padding: 1.25rem !important; }
          .img-panel { border-right: none !important; border-bottom: 1.5px solid ${T.border} !important; padding: 2rem !important; min-height: 250px !important; }
          .info-panel { padding: 1.5rem !important; }
          .cta-btns { flex-direction: column !important; }
        }
      `}</style>
      <CustomerNavbar />
      {children}
    </div>
  );

  if (loading) return <Shell><div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: T.muted, fontSize: "1rem" }}>Loading product...</div></Shell>;
  if (!part)   return <Shell><div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: T.muted }}>Product not found.</div></Shell>;

  const oos = part.stock_quantity <= 0;

  const addToCart = async () => {
    if (oos) return;
    if (!customerId) { toast.warning("Please log in to add products to the cart."); navigate("/login"); return; }
    try {
      await axios.post("https://aaryaautogarage.onrender.com/cart/add", { customer_id: customerId, part_id: part.part_id });
      window.dispatchEvent(new Event("cartUpdated"));
      setAdded(true);
      toast.success("Added to cart!");
      setTimeout(() => setAdded(false), 2000);
    } catch { toast.error("Could not add to cart"); }
  };

  const buyNow = async () => {
    if (oos) return;
    if (!customerId) { toast.warning("Please log in to proceed with the purchase."); navigate("/login"); return; }
    setBuying(true);
    try {
      await axios.post("https://aaryaautogarage.onrender.com/cart/add", { customer_id: customerId, part_id: part.part_id });
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/checkout");
    } catch { toast.error("Could not process Buy Now"); setBuying(false); }
  };

  return (
    <Shell>
      {/* Breadcrumb banner */}
      <div style={{ background: "linear-gradient(135deg, #0F172A, #1E1B4B)", padding: "1.75rem 2.5rem" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <button onClick={() => navigate(-1)} style={{
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px", color: "rgba(255,255,255,0.7)", fontSize: "0.85rem",
            cursor: "pointer", padding: "0.45rem 1rem", fontFamily: T.font,
            display: "inline-flex", alignItems: "center", gap: "0.4rem", transition: "all 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
          >← Back to Parts</button>
        </div>
      </div>

      <div className="detail-container" style={{ flex: 1, maxWidth: "960px", margin: "0 auto", padding: "2.5rem", width: "100%", boxSizing: "border-box" }}>
        <div style={{
          background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: "20px",
          display: "flex", flexWrap: "wrap", overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>
          {/* Image panel */}
          <div className="img-panel" style={{
            flex: "1 1 42%", background: T.bg, display: "flex",
            alignItems: "center", justifyContent: "center",
            padding: "3rem", borderRight: `1.5px solid ${T.border}`, minHeight: "380px",
          }}>
            {part.image
              ? <img src={part.image} alt={part.part_name} style={{ width: "100%", maxHeight: "340px", objectFit: "contain" }} />
              : <div style={{ textAlign: "center", color: T.muted }}>
                  <div style={{ fontSize: "5rem", marginBottom: "0.5rem" }}>🔩</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>No Image Available</div>
                </div>}
          </div>

          {/* Info panel */}
          <div className="info-panel" style={{ flex: "1 1 50%", padding: "2.5rem", display: "flex", flexDirection: "column" }}>
            {/* Category / Brand chips */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
              {part.brand && (
                <span style={{ background: "#EEF3FF", color: T.blue, border: "1.5px solid #C7D7FF", borderRadius: "100px", padding: "0.2rem 0.75rem", fontSize: "0.75rem", fontWeight: 700 }}>
                  {part.brand}
                </span>
              )}
              {part.applicable_model && (
                <span style={{ background: "#F3F4F6", color: T.sub, border: `1.5px solid ${T.border}`, borderRadius: "100px", padding: "0.2rem 0.75rem", fontSize: "0.75rem", fontWeight: 600 }}>
                  {part.applicable_model}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: "1.7rem", fontWeight: 900, color: T.text, margin: "0 0 0.5rem", lineHeight: 1.2 }}>{part.part_name}</h1>
            <p style={{ color: T.muted, fontSize: "0.9rem", margin: "0 0 1.75rem" }}>
              Brand: <strong style={{ color: T.sub }}>{part.brand || "—"}</strong>
            </p>

            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: T.accent, marginBottom: "1.75rem", letterSpacing: "-1px" }}>
              ₹{Number(part.price).toLocaleString()}
            </div>

            {/* Compatibility */}
            {(part.applicability_base_model || part.applicable_model) && (
              <div style={{ marginBottom: "1.75rem", background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: "12px", padding: "1rem 1.25rem" }}>
                <h4 style={{ fontSize: "0.73rem", color: T.muted, margin: "0 0 0.75rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Compatibility</h4>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {part.applicability_base_model && (
                    <span style={{ padding: "0.28rem 0.8rem", background: T.surface, color: T.sub, fontSize: "0.82rem", borderRadius: "8px", border: `1px solid ${T.border}`, fontWeight: 600 }}>
                      Base: {part.applicability_base_model}
                    </span>
                  )}
                  {part.applicable_model && (
                    <span style={{ padding: "0.28rem 0.8rem", background: T.surface, color: T.sub, fontSize: "0.82rem", borderRadius: "8px", border: `1px solid ${T.border}`, fontWeight: 600 }}>
                      Model: {part.applicable_model}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{ marginTop: "auto", borderTop: `1.5px solid ${T.border}`, paddingTop: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <span style={{ color: T.muted, fontSize: "0.9rem" }}>Availability</span>
                {oos
                  ? <span style={{ color: T.danger, background: "#FFF0F0", border: `1px solid ${T.danger}30`, padding: "0.25rem 0.75rem", borderRadius: "100px", fontWeight: 700, fontSize: "0.82rem" }}>Out of Stock</span>
                  : <span style={{ color: T.success, background: "#ECFDF5", border: `1px solid ${T.success}30`, padding: "0.25rem 0.75rem", borderRadius: "100px", fontWeight: 700, fontSize: "0.82rem" }}>In Stock ({part.stock_quantity} left)</span>
                }
              </div>

              <div className="cta-btns" style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={addToCart} disabled={oos} style={{
                  flex: 1, padding: "0.92rem",
                  border: `2px solid ${oos ? T.border : added ? T.success : T.blue}`,
                  background: oos ? "#F3F4F6" : added ? "#ECFDF5" : "#EEF3FF",
                  color: oos ? T.muted : added ? T.success : T.blue,
                  borderRadius: "12px", fontWeight: 700, fontSize: "0.92rem",
                  cursor: oos ? "not-allowed" : "pointer", fontFamily: T.font, transition: "all 0.2s",
                }}
                  onMouseEnter={e => { if (!oos && !added) { e.currentTarget.style.background = T.blue; e.currentTarget.style.color = "#fff"; }}}
                  onMouseLeave={e => { if (!oos && !added) { e.currentTarget.style.background = "#EEF3FF"; e.currentTarget.style.color = T.blue; }}}
                >
                  {oos ? "Unavailable" : added ? "✓ Added to Cart!" : "Add to Cart"}
                </button>
                <button onClick={buyNow} disabled={oos || buying} style={{
                  flex: 1, padding: "0.92rem", border: "none",
                  background: oos ? "#F3F4F6" : "linear-gradient(135deg, #E84A2F, #FF6B35)",
                  color: oos ? T.muted : "#fff",
                  borderRadius: "12px", fontWeight: 700, fontSize: "0.92rem",
                  cursor: oos ? "not-allowed" : "pointer", fontFamily: T.font,
                  boxShadow: oos ? "none" : "0 4px 18px rgba(232,74,47,0.35)",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { if (!oos) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(232,74,47,0.45)"; }}}
                  onMouseLeave={e => { if (!oos) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(232,74,47,0.35)"; }}}
                >
                  {buying ? "Processing..." : "Buy Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer style={{ background: "#0F172A", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem 2rem", textAlign: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>© 2025 Aarya Auto Garage</span>
      </footer>
    </Shell>
  );
}
