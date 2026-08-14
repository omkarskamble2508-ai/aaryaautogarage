import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomerNavbar from "../Components/CustomerNavbar";

const T = {
  bg: "#F8F9FC", surface: "#FFFFFF", border: "#E4E9F2",
  text: "#111827", sub: "#374151", muted: "#6B7280",
  accent: "#E84A2F", blue: "#3B6FFF",
  success: "#10B981", danger: "#EF4444", warn: "#F59E0B",
  font: "'Inter', 'Segoe UI', system-ui, sans-serif",
};

const STATUS = {
  Ordered:   { color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", dot: "#F59E0B" },
  Accepted:  { color: "#3B6FFF", bg: "#EEF3FF", border: "#C7D7FF", dot: "#3B6FFF" },
  Delivered: { color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0", dot: "#10B981" },
  Declined:  { color: "#EF4444", bg: "#FFF0F0", border: "#FFC9C9", dot: "#EF4444" },
};

const STEPS = ["Ordered", "Accepted", "Delivered"];

function Tracker({ status }) {
  const idx = STEPS.indexOf(status);
  if (status === "Declined") return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
      <span style={{ color: T.danger, fontWeight: 700, fontSize: "0.85rem" }}>✕ Order Declined</span>
    </div>
  );
  return (
    <div className="order-tracker" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
      {STEPS.map((step, i) => (
        <div key={step} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
            background: i <= idx ? T.blue : T.bg,
            border: `2px solid ${i <= idx ? T.blue : T.border}`,
            color: i <= idx ? "#fff" : T.muted,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.7rem", fontWeight: 800,
          }}>
            {i < idx ? "✓" : i + 1}
          </div>
          <span style={{ fontSize: "0.82rem", color: i <= idx ? T.blue : T.muted, fontWeight: i <= idx ? 700 : 400 }}>{step}</span>
          {i < STEPS.length - 1 && (
            <div style={{ width: "32px", height: "3px", background: i < idx ? T.blue : T.border, borderRadius: "3px" }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function MyOrders() {
  const navigate = useNavigate();
  const customerId = sessionStorage.getItem("ID") || localStorage.getItem("ID");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) { navigate("/login"); return; }
    axios.get(`https://aaryaautogarage.onrender.com/orders/customer/${customerId}`)
      .then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.font, display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @media (max-width: 640px) {
          .page-header { padding: 2rem 1.5rem !important; }
          .page-content { padding: 1.5rem 1rem !important; }
          .order-header { flex-direction: column; align-items: flex-start !important; gap: 0.75rem; }
          .order-tracker { align-items: flex-start !important; }
          .item-row { flex-direction: column; align-items: flex-start !important; gap: 0.5rem; }
        }
      `}</style>
      <CustomerNavbar />

      {/* Header */}
      <div className="page-header" style={{ background: "linear-gradient(135deg, #0F172A, #1E1B4B)", padding: "3rem 2.5rem 2.5rem" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <span style={{ color: "#FF6B35", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>History</span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", margin: "0 0 0.4rem", letterSpacing: "-0.5px" }}>My Orders</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", margin: 0 }}>Track all your purchases and order statuses in one place.</p>
        </div>
      </div>

      {/* Content */}
      <div className="page-content" style={{ flex: 1, maxWidth: "860px", margin: "0 auto", padding: "2.5rem 2rem", width: "100%", boxSizing: "border-box" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", color: T.muted }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⏳</div>
            <p style={{ fontWeight: 600, fontSize: "1rem" }}>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{
            background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: "20px",
            padding: "5rem 2rem", textAlign: "center",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "1.25rem" }}>📦</div>
            <p style={{ color: T.text, fontWeight: 800, fontSize: "1.1rem", margin: "0 0 0.4rem" }}>No orders yet</p>
            <p style={{ color: T.muted, fontSize: "0.9rem", margin: "0 0 1.5rem" }}>Place your first order from the catalogue.</p>
            <button onClick={() => navigate("/spareparts")} style={{
              padding: "0.75rem 1.75rem",
              background: "linear-gradient(135deg, #E84A2F, #FF6B35)",
              border: "none", borderRadius: "10px", color: "#fff",
              fontWeight: 700, fontSize: "0.92rem", cursor: "pointer", fontFamily: T.font,
              boxShadow: "0 4px 16px rgba(232,74,47,0.3)",
            }}>Browse Parts →</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {orders.map(order => {
              const sc = STATUS[order.status] || STATUS.Ordered;
              return (
                <div key={order.order_id} style={{
                  background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: "20px",
                  overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  transition: "box-shadow 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}
                >
                  {/* Card header */}
                  <div className="order-header" style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "1.25rem 1.75rem",
                    borderBottom: `1px solid ${T.border}`,
                    background: T.bg,
                  }}>
                    <div>
                      <div style={{ fontSize: "0.77rem", color: T.muted, marginBottom: "0.2rem" }}>
                        Order <strong style={{ color: T.sub, fontFamily: "monospace" }}>#{order.order_id}</strong>
                        {" · "}{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                      <div style={{ fontSize: "1.4rem", fontWeight: 900, color: T.accent, letterSpacing: "-0.5px" }}>
                        ₹{Number(order.total_amount).toLocaleString()}
                      </div>
                    </div>
                    <span style={{
                      background: sc.bg, color: sc.color,
                      border: `1.5px solid ${sc.border}`,
                      padding: "0.28rem 0.85rem", borderRadius: "100px",
                      fontSize: "0.78rem", fontWeight: 700,
                      display: "flex", alignItems: "center", gap: "0.4rem",
                    }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                      {order.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div style={{ padding: "1.25rem 1.75rem", borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {order.items?.map(item => (
                        <div className="item-row" key={item.order_item_id} style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                          <div style={{
                            width: "50px", height: "50px", background: T.bg, borderRadius: "10px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            overflow: "hidden", flexShrink: 0, border: `1px solid ${T.border}`,
                          }}>
                            {item.image
                              ? <img src={item.image} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="" />
                              : <span style={{ fontSize: "1.4rem" }}>🔩</span>}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, color: T.text, fontSize: "0.9rem" }}>{item.part_name}</div>
                            <div style={{ color: T.muted, fontSize: "0.77rem", marginTop: "0.1rem" }}>Qty: {item.quantity}</div>
                          </div>
                          <div style={{ fontWeight: 800, color: T.sub, fontSize: "0.95rem" }}>
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tracker */}
                  <div style={{ padding: "1.25rem 1.75rem" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.25rem" }}>Order Tracker</div>
                    <Tracker status={order.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <footer style={{ background: "#0F172A", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem 2rem", textAlign: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>© 2025 Aarya Auto Garage</span>
      </footer>
    </div>
  );
}
