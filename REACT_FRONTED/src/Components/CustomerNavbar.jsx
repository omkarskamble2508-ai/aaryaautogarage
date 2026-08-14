import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const T = {
  bg:       "#F8F9FC",
  surface:  "#FFFFFF",
  border:   "#E4E9F2",
  text:     "#111827",
  sub:      "#374151",
  muted:    "#6B7280",
  accent:   "#E84A2F",
  blue:     "#3B6FFF",
  blueHov:  "#2554E8",
  danger:   "#EF4444",
  font:     "'Inter', 'Segoe UI', system-ui, sans-serif",
};

export default function CustomerNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const customerId  = sessionStorage.getItem("ID") || localStorage.getItem("ID");
  const customerName = localStorage.getItem("Name") || sessionStorage.getItem("Name") || "Customer";

  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showCart,  setShowCart]  = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchCartData = async () => {
    if (!customerId) return;
    try {
      const [countRes, itemsRes] = await Promise.all([
        axios.get(`http://localhost:3000/cart/count/${customerId}`),
        axios.get(`http://localhost:3000/cart/${customerId}`)
      ]);
      setCartCount(Number(countRes.data.totalItems || 0));
      setCartItems(itemsRes.data);
    } catch {}
  };

  useEffect(() => {
    fetchCartData();
    const handleUpdate = () => fetchCartData();
    window.addEventListener("cartUpdated", handleUpdate);
    return () => window.removeEventListener("cartUpdated", handleUpdate);
  }, [customerId]);

  const removeFromCart = async (cartId) => {
    try {
      await axios.delete(`http://localhost:3000/cart/remove/${cartId}`);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {}
  };

  const logout = () => {
    sessionStorage.clear();
    localStorage.removeItem("ID");
    localStorage.removeItem("Name");
    navigate("/login");
  };

  const IconHome = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
  const IconCat  = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>;
  const IconOrd  = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>;
  const IconAbt  = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
  const IconCall = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
  const IconLogout = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
  const IconX = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

  const navLinks = [
    ["Home", "/home", IconHome],
    ["Catalogue", "/spareparts", IconCat],
    ["My Orders", "/my-orders", IconOrd],
    ["About Us", "/about", IconAbt],
    ["Contact Us", "/contact", IconCall],
  ];
  const cartTotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
          .nav-padding { padding: 0 1rem !important; }
          .nav-logo-desc { display: none !important; }
          .auth-btn-register { padding: 0.35rem 0.6rem !important; font-size: 0.75rem !important; }
          .auth-btn-login { padding: 0.35rem 0.7rem !important; font-size: 0.75rem !important; }
        }
        @media (max-width: 450px) {
          .auth-btn-register { display: none !important; } /* Hide register on ultra-small screens to prevent overflow, keep login */
        }
        @media (min-width: 901px) {
          .mobile-toggle { display: none !important; }
        }
      `}</style>
      <nav className="nav-padding" style={{
        height: "64px", background: T.surface,
        borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 2rem", position: "sticky", top: 0, zIndex: 50,
        fontFamily: T.font, boxShadow: "0 1px 12px rgba(0,0,0,0.06)",
      }}>
        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{
          background: "none", border: "none", fontSize: "1.5rem", color: T.text, cursor: "pointer",
          alignItems: "center", justifyContent: "center", padding: "0.5rem"
        }}>
          ☰
        </button>

        {/* Logo */}
        <Link to="/home" style={{ display: "flex", alignItems: "center", gap: "0.55rem", textDecoration: "none" }}>
          <img src="/logo.png" alt="Aarya Auto Garage" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
          <div>
            <div style={{ color: T.text, fontWeight: 800, fontSize: "0.95rem", lineHeight: 1.1 }}>Aarya Auto</div>
            <div className="nav-logo-desc" style={{ color: T.accent, fontSize: "0.6rem", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700 }}>Garage AND SPARE PARTS</div>
          </div>
        </Link>

        {/* Nav links */}
        <div className="desktop-nav" style={{ display: "flex", gap: "0.1rem" }}>
          {navLinks.map(([label, to]) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} style={{
                color: active ? T.blue : T.muted, textDecoration: "none",
                fontSize: "0.85rem", fontWeight: active ? 700 : 500,
                padding: "0.45rem 0.85rem", borderRadius: "8px",
                background: active ? "#EEF3FF" : "transparent",
                borderBottom: `2px solid ${active ? T.blue : "transparent"}`,
                transition: "all 0.15s",
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = T.sub; e.currentTarget.style.background = "#F3F4F6"; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = T.muted; e.currentTarget.style.background = "transparent"; }}}
              >{label}</Link>
            );
          })}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          {/* Cart button */}
          <button onClick={() => {
            if (!customerId) { navigate("/login"); return; }
            setShowCart(!showCart);
          }} style={{
            position: "relative", background: T.bg,
            border: `1.5px solid ${T.border}`, borderRadius: "10px",
            color: T.sub, padding: "0.45rem 1rem",
            fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: T.font,
            display: "flex", alignItems: "center", gap: "0.5rem", transition: "all 0.18s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.blue; e.currentTarget.style.color = T.blue; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.sub; }}
          >
            🛒 Cart
            {cartCount > 0 && (
              <span style={{
                background: T.accent, color: "#fff",
                fontSize: "0.6rem", fontWeight: 800, borderRadius: "100px",
                padding: "0.1rem 0.45rem", minWidth: "18px", textAlign: "center",
              }}>{cartCount}</span>
            )}
          </button>

          {/* Auth area */}
          <div className="mobile-auth" style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            {customerId ? (
              <>
                <div style={{
                  width: "34px", height: "34px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #3B6FFF, #6B9FFF)",
                  color: "#fff", fontSize: "0.82rem", fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(59,111,255,0.3)",
                }}>
                  {customerName.charAt(0).toUpperCase()}
                </div>
                <button onClick={logout} style={{
                  background: "transparent",
                  border: `1.5px solid ${T.border}`, borderRadius: "8px",
                  color: T.muted, padding: "0.4rem 0.9rem",
                  fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: T.font,
                  transition: "all 0.18s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.danger; e.currentTarget.style.color = T.danger; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
                >Logout</button>
              </>
            ) : (
              <>
                <button className="auth-btn-register" onClick={() => navigate("/register")} style={{
                  background: "transparent",
                  border: `1.5px solid ${T.border}`, borderRadius: "9px", color: T.text,
                  padding: "0.45rem 1rem", fontSize: "0.85rem", fontWeight: 700,
                  cursor: "pointer", fontFamily: T.font,
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.blue; e.currentTarget.style.color = T.blue; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; }}
                >Register</button>

                <button className="auth-btn-login" onClick={() => navigate("/login")} style={{
                  background: "linear-gradient(135deg, #E84A2F, #FF6B35)",
                  border: "none", borderRadius: "9px", color: "#fff",
                  padding: "0.5rem 1.2rem", fontSize: "0.85rem", fontWeight: 700,
                  cursor: "pointer", fontFamily: T.font,
                  boxShadow: "0 3px 12px rgba(232,74,47,0.35)",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(232,74,47,0.45)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 3px 12px rgba(232,74,47,0.35)"; }}
                >Login</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Drawer ── */}
      {mobileMenuOpen && (
        <>
          <div onClick={() => setMobileMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 100, backdropFilter: "blur(4px)" }} />
          <div style={{
            position: "fixed", top: 0, left: 0, bottom: 0, width: "300px", maxWidth: "85vw",
            background: T.surface, zIndex: 101, display: "flex", flexDirection: "column",
            boxShadow: "12px 0 50px rgba(0,0,0,0.15)", fontFamily: T.font,
          }}>
            <div style={{ padding: "1.5rem", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <img src="/logo.png" alt="Logo" style={{ width: "28px", height: "28px" }} />
                <span style={{ margin: 0, fontSize: "1.1rem", color: T.text, fontWeight: 800 }}>Aarya Auto</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: "8px", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", color: T.sub, cursor: "pointer" }}>{IconX}</button>
            </div>
            
            <div style={{ padding: "1.5rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem", flex: 1, overflowY: "auto" }}>
              <div style={{ fontSize: "0.7rem", color: T.muted, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, marginBottom: "0.5rem", paddingLeft: "0.75rem" }}>Main Menu</div>
              {navLinks.map(([label, to, icon]) => {
                const active = location.pathname === to;
                return (
                  <Link key={to} to={to} onClick={() => setMobileMenuOpen(false)} style={{
                    color: active ? T.blue : T.sub, textDecoration: "none", fontSize: "0.95rem", fontWeight: active ? 700 : 500,
                    padding: "0.85rem 1rem", borderRadius: "12px", background: active ? "#EEF3FF" : "transparent",
                    display: "flex", alignItems: "center", gap: "0.85rem", transition: "all 0.2s"
                  }}>
                    <span style={{ display: "flex", color: active ? T.blue : T.muted }}>{icon}</span> {label}
                  </Link>
                );
              })}
            </div>
            
            {/* User Area at Bottom */}
            <div style={{ padding: "1.25rem 1.5rem", borderTop: `1px solid ${T.border}`, background: T.surface }}>
              {customerId ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #3B6FFF, #6B9FFF)",
                      color: "#fff", fontSize: "1rem", fontWeight: 800,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 10px rgba(59,111,255,0.25)",
                    }}>
                      {customerName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ maxWidth: "140px" }}>
                      <div style={{ fontSize: "0.88rem", fontWeight: 700, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textTransform: "capitalize" }}>{customerName.toLowerCase()}</div>
                      <div style={{ fontSize: "0.72rem", color: T.muted }}>Welcome back!</div>
                    </div>
                  </div>
                  <button onClick={() => { setMobileMenuOpen(false); logout(); }} style={{
                    background: "#FEE2E2", border: "none", color: T.danger, width: "36px", height: "36px", borderRadius: "10px",
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s"
                  }}>{IconLogout}</button>
                </div>
              ) : (
                <button onClick={() => { setMobileMenuOpen(false); navigate("/login"); }} style={{
                  width: "100%", padding: "0.85rem", background: "linear-gradient(135deg, #E84A2F, #FF6B35)",
                  color: "#fff", border: "none", borderRadius: "12px", fontWeight: 700, cursor: "pointer",
                  fontFamily: T.font, fontSize: "0.95rem", boxShadow: "0 4px 15px rgba(232,74,47,0.3)"
                }}>Login to Account</button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Cart Drawer ── */}
      {showCart && (
        <>
          <div onClick={() => setShowCart(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 100, backdropFilter: "blur(4px)" }} />
          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0, width: "400px", maxWidth: "92vw",
            background: T.surface, zIndex: 101, display: "flex", flexDirection: "column",
            boxShadow: "-12px 0 50px rgba(0,0,0,0.15)", fontFamily: T.font,
            borderLeft: `1px solid ${T.border}`,
          }}>
            {/* Drawer Header */}
            <div style={{
              padding: "1.5rem 1.5rem 1.25rem",
              borderBottom: `1px solid ${T.border}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.1rem", color: T.text, fontWeight: 800 }}>Your Cart</h2>
                <p style={{ margin: "0.15rem 0 0", fontSize: "0.78rem", color: T.muted }}>{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => setShowCart(false)} style={{
                background: T.bg, border: `1px solid ${T.border}`, borderRadius: "8px",
                width: "34px", height: "34px", color: T.sub, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
              }}>{IconX}</button>
            </div>

            {/* Cart Items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem 1rem", color: T.muted }}>
                  <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🛒</div>
                  <p style={{ fontWeight: 700, color: T.sub, fontSize: "1rem" }}>Cart is empty</p>
                  <p style={{ fontSize: "0.85rem" }}>Add some parts to get started!</p>
                </div>
              ) : cartItems.map(item => (
                <div key={item.cart_id} style={{
                  display: "flex", alignItems: "center", gap: "0.85rem",
                  marginBottom: "0.75rem", padding: "0.85rem", background: T.bg,
                  borderRadius: "12px", border: `1px solid ${T.border}`,
                }}>
                  <div style={{
                    width: "52px", height: "52px", background: T.surface, borderRadius: "8px",
                    overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center",
                    justifyContent: "center", border: `1px solid ${T.border}`,
                  }}>
                    {item.image
                      ? <img src={item.image} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="" />
                      : <span style={{ fontSize: "1.5rem" }}>🔩</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: T.text, fontSize: "0.87rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.part_name}</div>
                    <div style={{ color: T.muted, fontSize: "0.75rem", marginTop: "0.15rem" }}>Qty: {item.quantity} · ₹{Number(item.price).toLocaleString()} each</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, color: T.accent, fontSize: "0.95rem" }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                    <button onClick={() => removeFromCart(item.cart_id)} style={{
                      background: "none", border: "none", color: T.danger,
                      cursor: "pointer", fontSize: "0.76rem", marginTop: "0.2rem", fontFamily: T.font,
                    }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Footer */}
            {cartItems.length > 0 && (
              <div style={{ padding: "1.25rem 1.5rem", borderTop: `1px solid ${T.border}`, background: T.bg }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", alignItems: "center" }}>
                  <span style={{ color: T.sub, fontSize: "0.9rem", fontWeight: 600 }}>Total</span>
                  <span style={{ color: T.text, fontWeight: 800, fontSize: "1.2rem" }}>₹{cartTotal.toLocaleString()}</span>
                </div>
                <button onClick={() => { setShowCart(false); navigate("/checkout"); }} style={{
                  width: "100%", padding: "0.88rem",
                  background: "linear-gradient(135deg, #E84A2F, #FF6B35)",
                  color: "#fff", border: "none", borderRadius: "10px",
                  fontWeight: 800, cursor: "pointer", fontSize: "0.95rem", fontFamily: T.font,
                  boxShadow: "0 4px 20px rgba(232,74,47,0.35)",
                }}>
                  Checkout →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
