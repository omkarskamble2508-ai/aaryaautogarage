import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomerNavbar from "../Components/CustomerNavbar";
import { toast } from "../Components/Toast";

const T = {
  bg: "#F8F9FC", surface: "#FFFFFF", border: "#E4E9F2",
  text: "#111827", sub: "#374151", muted: "#6B7280",
  accent: "#E84A2F", blue: "#3B6FFF",
  success: "#10B981", font: "'Inter', 'Segoe UI', system-ui, sans-serif",
};

/* ── Inline SVG icons ── */
const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" style={{ flexShrink: 0 }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="52" height="52">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconParty = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.24 2.24M7.76 17.24 4 22M5.34 5.34 4 4M22 13.76l-1.34-1.34M13.76 22l-1.34-1.34"/>
  </svg>
);
const IconBox = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" style={{ flexShrink: 0 }}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

function Checkout() {
  const navigate = useNavigate();
  const customerId   = sessionStorage.getItem("ID") || localStorage.getItem("ID");
  const customerName = localStorage.getItem("Name") || sessionStorage.getItem("Name") || "Customer";

  const [cartItems,      setCartItems]      = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [confirmStatus,  setConfirmStatus]  = useState("idle"); // idle | confirming | confirmed
  const [mobileNumber,   setMobileNumber]   = useState("");
  const [mobileFocused,  setMobileFocused]  = useState(false);

  useEffect(() => {
    if (!customerId) { navigate("/login"); return; }
    axios.get(`https://aaryaautogarage.onrender.com/cart/${customerId}`)
      .then(r => setCartItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleConfirmOrder = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      toast.warning("Please enter a valid 10-digit mobile number.");
      return;
    }
    setConfirmStatus("confirming");
    try {
      await axios.post("https://aaryaautogarage.onrender.com/orders/create", { customer_id: customerId, mobile_number: mobileNumber });
      window.dispatchEvent(new Event("cartUpdated"));
      setConfirmStatus("confirmed");
      setTimeout(() => navigate("/my-orders"), 3500);
    } catch {
      toast.error("Error confirming order. Please try again.");
      setConfirmStatus("idle");
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(`https://aaryaautogarage.onrender.com/cart/update/${cartId}`, { quantity: newQuantity });
      setCartItems(prev => prev.map(item => item.cart_id === cartId ? { ...item, quantity: newQuantity } : item));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch { toast.error("Error updating quantity"); }
  };

  const total      = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);
  const isConfirming = confirmStatus === "confirming";
  const isConfirmed  = confirmStatus === "confirmed";
  const canOrder   = cartItems.length > 0 && !loading && !isConfirming;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.font, display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes spin          { to { transform: rotate(360deg); } }
        @keyframes progressPulse {
          0%   { width: 5%; opacity: 1; }
          50%  { width: 80%; opacity: 1; }
          90%  { width: 95%; opacity: 0.8; }
          100% { width: 100%; opacity: 0; }
        }
        @keyframes checkPop {
          0%   { transform: scale(0.3) rotate(-15deg); opacity: 0; }
          60%  { transform: scale(1.2) rotate(3deg);  opacity: 1; }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes confetti {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-60px) rotate(720deg); opacity: 0; }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .confirm-btn:hover:not(:disabled) {
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 30px rgba(232,74,47,0.5) !important;
        }
        @media (max-width: 640px) {
          .checkout-header        { padding: 2rem 1.5rem 1.5rem !important; }
          .checkout-content       { padding: 1.5rem 1rem !important; }
          .checkout-card-section  { padding: 1.5rem 1rem !important; }
          .order-item-row         { flex-direction: column !important; align-items: flex-start !important; gap: 0.5rem !important; }
        }
      `}</style>
      <CustomerNavbar />

      {/* Header */}
      <div className="checkout-header" style={{ background: "linear-gradient(135deg, #0F172A, #1E1B4B)", padding: "2.5rem 2.5rem 2rem" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <span style={{ color: "#FF6B35", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Checkout</span>
          <h1 style={{ fontSize: "1.9rem", fontWeight: 900, color: "#FFFFFF", margin: 0, letterSpacing: "-0.5px" }}>Review &amp; Confirm</h1>
        </div>
      </div>

      <div className="checkout-content" style={{ flex: 1, display: "flex", justifyContent: "center", padding: "2.5rem 1.5rem" }}>
        <div style={{ width: "100%", maxWidth: "600px" }}>

          {/* ══ ORDER CONFIRMED SCREEN ══ */}
          {isConfirmed ? (
            <div style={{
              background: T.surface, border: `1.5px solid ${T.border}`,
              borderRadius: "20px", padding: "4rem 2rem", textAlign: "center",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              animation: "fadeSlideUp 0.45s ease",
            }}>
              {/* Confetti dots */}
              <div style={{ position: "relative", height: "0" }}>
                {[...Array(8)].map((_, i) => (
                  <span key={i} style={{
                    position: "absolute",
                    top: "-60px",
                    left: `${10 + i * 11}%`,
                    width: "8px", height: "8px",
                    borderRadius: i % 2 === 0 ? "50%" : "2px",
                    background: ["#E84A2F","#3B6FFF","#10B981","#F59E0B","#8B5CF6","#EC4899","#FF6B35","#06B6D4"][i],
                    animation: `confetti ${0.6 + i * 0.08}s ease-out both`,
                    animationDelay: `${i * 0.05}s`,
                  }} />
                ))}
              </div>

              {/* Check circle */}
              <div style={{
                width: "96px", height: "96px", borderRadius: "50%",
                background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
                border: "2.5px solid #A7F3D0",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.75rem",
                color: T.success,
                animation: "checkPop 0.55s cubic-bezier(0.34,1.56,0.64,1) both",
              }}>
                <IconCheck />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span style={{ color: T.success, fontWeight: 900, fontSize: "1.6rem" }}>Order Confirmed!</span>
                <span style={{ color: "#F59E0B" }}><IconParty /></span>
              </div>

              <p style={{ color: T.muted, fontSize: "0.95rem", margin: "0 0 2rem" }}>
                Your order has been placed. We'll prepare it for pickup shortly.
              </p>

              {/* Redirect bar */}
              <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "0.9rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ color: T.muted }}>
                  <IconBox />
                </span>
                <span style={{ fontSize: "0.85rem", color: T.muted, flex: 1, textAlign: "left" }}>
                  Redirecting you to <strong style={{ color: T.sub }}>My Orders</strong>…
                </span>
                {/* mini spinner */}
                <span style={{
                  width: "16px", height: "16px", borderRadius: "50%",
                  border: "2px solid #E4E9F2", borderTopColor: T.blue,
                  display: "inline-block",
                  animation: "spin 0.8s linear infinite",
                  flexShrink: 0,
                }} />
              </div>
            </div>

          ) : (
            /* ══ MAIN CHECKOUT CARD ══ */
            <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

              {/* Confirming progress bar */}
              {isConfirming && (
                <div style={{ height: "3px", background: "#FFF3EF", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #E84A2F, #FF6B35, #F59E0B, #E84A2F)",
                    backgroundSize: "200% 100%",
                    animation: "progressPulse 2s ease-in-out forwards, shimmer 1.5s linear infinite",
                    borderRadius: "2px",
                  }} />
                </div>
              )}

              {/* Order Summary */}
              <div className="checkout-card-section" style={{ padding: "1.75rem 2rem", borderBottom: `1px solid ${T.border}` }}>
                <h3 style={{ fontSize: "0.73rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 1.25rem" }}>Order Summary</h3>
                {loading ? (
                  <p style={{ color: T.muted }}>Loading cart…</p>
                ) : (
                  <>
                    {cartItems.map(item => (
                      <div className="order-item-row" key={item.cart_id} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        marginBottom: "0.85rem", paddingBottom: "0.85rem",
                        borderBottom: `1px dashed ${T.border}`,
                        opacity: isConfirming ? 0.55 : 1,
                        transition: "opacity 0.3s",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                          <div style={{ width: "48px", height: "48px", background: T.bg, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: `1px solid ${T.border}` }}>
                            {item.image
                              ? <img src={item.image} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="" />
                              : <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" width="22" height="22"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: T.text, fontSize: "0.9rem", marginBottom: "0.3rem" }}>{item.part_name}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <button onClick={() => updateQuantity(item.cart_id, item.quantity - 1)} disabled={item.quantity <= 1 || isConfirming}
                                style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: "4px", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: item.quantity <= 1 || isConfirming ? "not-allowed" : "pointer", color: T.text, padding: 0 }}>−</button>
                              <span style={{ fontSize: "0.85rem", fontWeight: 600, minWidth: "16px", textAlign: "center", color: T.sub }}>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.cart_id, item.quantity + 1)} disabled={isConfirming}
                                style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: "4px", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: isConfirming ? "not-allowed" : "pointer", color: T.text, padding: 0 }}>+</button>
                            </div>
                          </div>
                        </div>
                        <span style={{ fontWeight: 800, color: T.accent, fontSize: "0.95rem" }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: 800, paddingTop: "0.5rem" }}>
                      <span>Total</span>
                      <span style={{ color: T.accent }}>₹{total.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Customer Info */}
              <div className="checkout-card-section" style={{ padding: "1.5rem 2rem", borderBottom: `1px solid ${T.border}` }}>
                <h3 style={{ fontSize: "0.73rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 1rem" }}>Customer</h3>
                <div style={{ background: T.bg, padding: "0.9rem 1rem", borderRadius: "12px", border: `1.5px solid ${T.border}`, display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #3B6FFF, #6B9FFF)", borderRadius: "50%", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>
                    {customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: T.text }}>{customerName}</div>
                    <div style={{ color: T.muted, fontSize: "0.78rem" }}>Customer ID: #{customerId}</div>
                  </div>
                </div>
              </div>

              {/* Payment & Pickup */}
              <div className="checkout-card-section" style={{ padding: "1.5rem 2rem", borderBottom: `1px solid ${T.border}` }}>
                <h3 style={{ fontSize: "0.73rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 1rem" }}>Payment &amp; Pickup</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", marginBottom: "1rem" }}>
                  {[["Payment Method", "Cash on Pickup"], ["Delivery Mode", "Store Pickup"]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                      <span style={{ color: T.muted }}>{k}</span>
                      <span style={{ color: T.sub, fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Pickup address */}
                <div style={{ background: "#EEF3FF", padding: "0.9rem 1rem", borderRadius: "10px", border: "1.5px solid #C7D7FF", marginBottom: "1.25rem", display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                  <span style={{ color: T.blue, marginTop: "2px" }}><IconPin /></span>
                  <div>
                    <p style={{ margin: "0 0 0.2rem", fontWeight: 700, color: T.blue, fontSize: "0.85rem" }}>Pickup Address</p>
                    <p style={{ margin: 0, color: T.muted, fontSize: "0.82rem", lineHeight: 1.6 }}>Aarya Auto Garage · Shop No 12, Main Road · Radhanagari</p>
                  </div>
                </div>

                {/* Mobile number */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "1px" }}>Mobile Number *</label>
                  <input
                    type="tel"
                    placeholder="Enter your 10-digit mobile number"
                    value={mobileNumber}
                    onChange={e => setMobileNumber(e.target.value)}
                    disabled={isConfirming}
                    onFocus={() => setMobileFocused(true)}
                    onBlur={() => setMobileFocused(false)}
                    style={{
                      padding: "0.75rem 1rem", borderRadius: "8px",
                      border: `1.5px solid ${mobileFocused ? T.blue : T.border}`,
                      background: T.bg, color: T.text, fontSize: "0.9rem",
                      outline: "none", fontFamily: T.font, transition: "border-color 0.2s",
                      opacity: isConfirming ? 0.6 : 1,
                    }}
                  />
                </div>
              </div>

              {/* Confirm Button */}
              <div className="checkout-card-section" style={{ padding: "1.5rem 2rem" }}>
                <button
                  onClick={handleConfirmOrder}
                  disabled={!canOrder}
                  className="confirm-btn"
                  style={{
                    width: "100%", padding: "1rem",
                    background: !canOrder
                      ? "#F3F4F6"
                      : isConfirming
                        ? "linear-gradient(135deg, #C73B22, #E84A2F)"
                        : "linear-gradient(135deg, #E84A2F, #FF6B35)",
                    color: !canOrder ? T.muted : "#fff",
                    border: "none", borderRadius: "12px",
                    fontSize: "1rem", fontWeight: 800,
                    cursor: !canOrder ? "not-allowed" : "pointer",
                    fontFamily: T.font,
                    boxShadow: !canOrder ? "none" : isConfirming ? "none" : "0 4px 20px rgba(232,74,47,0.35)",
                    transition: "all 0.25s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.65rem",
                    opacity: isConfirming ? 0.88 : 1,
                  }}
                >
                  {cartItems.length === 0 ? (
                    "Your cart is empty"
                  ) : isConfirming ? (
                    <>
                      {/* Spinner */}
                      <span style={{
                        width: "18px", height: "18px", borderRadius: "50%",
                        border: "2.5px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        display: "inline-block",
                        animation: "spin 0.75s linear infinite",
                        flexShrink: 0,
                      }} />
                      {/* Bouncing dots */}
                      <span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                        {[0, 0.15, 0.3].map((delay, i) => (
                          <span key={i} style={{
                            width: "5px", height: "5px", borderRadius: "50%",
                            background: "rgba(255,255,255,0.85)",
                            display: "inline-block",
                            animation: `dotBounce 1s ease-in-out ${delay}s infinite`,
                          }} />
                        ))}
                      </span>
                      Confirming Order
                    </>
                  ) : (
                    <>
                      {/* Checkmark icon */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Confirm Order
                    </>
                  )}
                </button>

                {isConfirming && (
                  <p style={{ textAlign: "center", color: T.muted, fontSize: "0.78rem", marginTop: "0.85rem", animation: "fadeSlideUp 0.3s ease" }}>
                    Please wait while we place your order…
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer style={{ background: "#0F172A", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem 2rem", textAlign: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>© 2025 Aarya Auto Garage</span>
      </footer>
    </div>
  );
}

export default Checkout;
