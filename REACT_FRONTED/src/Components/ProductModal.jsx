import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "./Toast";

const T = {
  bg: "#F8FAFC", surface: "#FFFFFF", card: "#FFFFFF", border: "#E2E8F0",
  text: "#0F172A", muted: "#64748B", accent: "#3B82F6", font: "'Segoe UI', system-ui, sans-serif",
};

export default function ProductModal({ part, onClose, customerId }) {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);

  if (!part) return null;

  const oos = part.stock_quantity <= 0;

  const addToCart = async (e) => {
    e.stopPropagation();
    if (oos) return;
    try {
      await axios.post("https://aaryaautogarage.onrender.com/cart/add", { customer_id: customerId, part_id: part.part_id });
      window.dispatchEvent(new Event("cartUpdated"));
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    } catch { toast.error("Could not add to cart"); }
  };

  const buyNow = async (e) => {
    e.stopPropagation();
    if (oos) return;
    setBuying(true);
    try {
      await axios.post("https://aaryaautogarage.onrender.com/cart/add", { customer_id: customerId, part_id: part.part_id });
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/checkout");
    } catch {
      toast.error("Could not process Buy Now");
      setBuying(false);
    }
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.font }}>
      <div onClick={onClose} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }} />
      <div style={{ position: "relative", width: "90%", maxWidth: "800px", background: T.surface, borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "row", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
        
        {/* Close Button */}
        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(0,0,0,0.05)", border: "none", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", cursor: "pointer", color: T.muted, zIndex: 10 }}>
          ✕
        </button>

        {/* Image Section */}
        <div style={{ flex: 1, background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", minHeight: "350px", borderRight: `1px solid ${T.border}` }}>
          {part.image ? (
            <img src={part.image} alt={part.part_name} style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }} />
          ) : (
            <span style={{ color: "#999", fontSize: "1.2rem" }}>No Image Available</span>
          )}
        </div>

        {/* Info Section */}
        <div style={{ flex: 1.2, padding: "2.5rem 2rem", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "inline-block", padding: "0.25rem 0.75rem", background: "#F1F5F9", color: T.muted, fontSize: "0.75rem", fontWeight: 600, borderRadius: "100px", textTransform: "uppercase", letterSpacing: "0.5px", alignSelf: "flex-start", marginBottom: "1rem" }}>
            {part.categories || "General Part"}
          </div>
          
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: T.text, margin: "0 0 0.5rem", lineHeight: 1.2 }}>{part.part_name}</h2>
          <p style={{ color: T.muted, fontSize: "0.95rem", margin: "0 0 1.5rem" }}>Brand: <strong style={{ color: T.text }}>{part.brand || "—"}</strong></p>

          <div style={{ fontSize: "2rem", fontWeight: 700, color: T.accent, marginBottom: "1.5rem" }}>
            ₹{Number(part.price).toLocaleString()}
          </div>

          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: "0.9rem", color: T.text, margin: "0 0 0.5rem" }}>Compatibility</h4>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              {part.applicability_base_model && (
                <span style={{ padding: "0.3rem 0.8rem", background: "#F1F5F9", color: T.muted, fontSize: "0.8rem", borderRadius: "5px", border: `1px solid ${T.border}` }}>
                  Base: {part.applicability_base_model}
                </span>
              )}
              {part.applicable_model && (
                <span style={{ padding: "0.3rem 0.8rem", background: "#F1F5F9", color: T.muted, fontSize: "0.8rem", borderRadius: "5px", border: `1px solid ${T.border}` }}>
                  Model: {part.applicable_model}
                </span>
              )}
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "1.5rem", marginTop: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.9rem", color: T.muted }}>Availability:</span>
              {oos ? (
                <span style={{ color: "#EF4444", fontWeight: 600, fontSize: "0.9rem", background: "#FEE2E2", padding: "0.2rem 0.6rem", borderRadius: "4px" }}>Out of Stock</span>
              ) : (
                <span style={{ color: "#10B981", fontWeight: 600, fontSize: "0.9rem", background: "#DCFCE7", padding: "0.2rem 0.6rem", borderRadius: "4px" }}>In Stock ({part.stock_quantity} left)</span>
              )}
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button 
                onClick={addToCart}
                disabled={oos}
                style={{ flex: 1, padding: "0.9rem", border: `1px solid ${T.accent}`, background: oos ? "#E2E8F0" : added ? "#DCFCE7" : "transparent", color: oos ? T.muted : added ? "#10B981" : T.accent, borderRadius: "6px", fontWeight: 700, fontSize: "0.95rem", cursor: oos ? "not-allowed" : "pointer", transition: "all 0.2s" }}
              >
                {oos ? "Unavailable" : added ? "✓ Added to Cart" : "Add to Cart"}
              </button>
              <button 
                onClick={buyNow}
                disabled={oos || buying}
                style={{ flex: 1, padding: "0.9rem", border: "none", background: oos ? "#cbd5e1" : T.accent, color: "#fff", borderRadius: "6px", fontWeight: 700, fontSize: "0.95rem", cursor: oos ? "not-allowed" : "pointer", transition: "all 0.2s" }}
              >
                {buying ? "Processing..." : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
