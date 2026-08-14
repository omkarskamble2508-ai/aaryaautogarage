import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const T = {
  bg: "#F8F9FC", surface: "#FFFFFF", border: "#E4E9F2",
  text: "#111827", sub: "#374151", muted: "#6B7280",
  indigo: "#4F46E5", indigoBg: "#EEF2FF", indigoBorder: "#C7D2FE",
  font: "'Inter', 'Segoe UI', system-ui, sans-serif",
};

const S = {
  bg: "#0B1120", surface: "#0F172A", border: "rgba(255,255,255,0.08)",
  text: "#F8FAFC", sub: "#CBD5E1", muted: "#94A3B8",
  indigo: "#818CF8", indigoBg: "rgba(99,102,241,0.15)", indigoBorder: "rgba(99,102,241,0.3)",
};

const icons = {
  dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  product:   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  add:       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  wrench:    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  users:     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  addUser:   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="11" x2="22" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  orders:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  bot:       <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M12 11V3"/><circle cx="12" cy="3" r="1"/></svg>,
};

const GROUPS = [
  { label: "Overview",  items: [{ path:"/dashboard", label:"Dashboard", icon: icons.dashboard }] },
  { label: "Catalogue", items: [
    { path:"/productlist",      label:"Products",      icon: icons.product },
    { path:"/addproduct",       label:"Add Product",   icon: icons.add     },
    { path:"/spareparts-admin", label:"Spare Parts",   icon: icons.wrench  },
  ]},
  { label: "Customers", items: [
    { path:"/users", label:"All Customers", icon: icons.users   },
    { path:"/add",   label:"Add Customer",  icon: icons.addUser },
  ]},
  { label: "Operations", items: [
    { path:"/admin-orders", label:"Orders",       icon: icons.orders },
    { path:"/chatbot",      label:"AI Assistant", icon: icons.bot    },
  ]},
];

function Sidebar({ children }) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const adminName = sessionStorage.getItem("ADMIN_NAME") || "Administrator";
  const isActive  = (p) => location.pathname === p;

  const logout = () => {
    sessionStorage.removeItem("ADMIN_AUTH");
    sessionStorage.removeItem("ADMIN_NAME");
    navigate("/admin");
  };

  const pageTitle = () => {
    const all = GROUPS.flatMap(g => g.items);
    const m = all.find(i => i.path === location.pathname);
    if (m) return m.label;
    if (location.pathname.startsWith("/edit/"))  return "Edit Customer";
    if (location.pathname.startsWith("/editp/")) return "Edit Product";
    return "Admin";
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        .admin-main { margin-left: 240px; padding: 2rem; }
        .mobile-toggle { display: none !important; }
        .mobile-overlay { display: none; }
        .top-bar-pad { padding: 0 2rem; }
        @media (max-width: 900px) {
          .admin-main { margin-left: 0 !important; padding: 1rem !important; }
          .admin-sidebar { 
            transform: translateX(-100%); 
            transition: transform 0.3s ease; 
          }
          .admin-sidebar.open { transform: translateX(0) !important; }
          .mobile-toggle { display: flex !important; }
          .mobile-overlay.open { 
            display: block !important; position: fixed; inset: 0; 
            background: rgba(15,23,42,0.5); z-index: 99; backdrop-filter: blur(4px); 
          }
          .top-bar-pad { padding: 0 1rem !important; }
          .user-name-hide { display: none !important; }
          .mobile-close-btn { display: block !important; }
        }
        .mobile-close-btn { display: none; background: transparent; border: none; color: ${S.muted}; font-size: 1.2rem; cursor: pointer; padding: 0.25rem; }
      `}</style>
      <div style={{ display:"flex", minHeight:"100vh", background:T.bg, fontFamily:T.font }}>

        <div className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)} />

        {/* Sidebar */}
        <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`} style={{
          width:"240px", minWidth:"240px", background:S.bg,
          borderRight:`1px solid ${S.border}`,
          display:"flex", flexDirection:"column",
          position:"fixed", top:0, left:0, bottom:0, zIndex:100,
          boxShadow:"2px 0 12px rgba(0,0,0,0.2)",
        }}>
          {/* Logo */}
          <div style={{ height:"66px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 1.25rem", borderBottom:`1px solid ${S.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.7rem" }}>
              <img src="/logo.png" alt="Aarya Auto Garage" style={{ width:"36px", height:"36px", objectFit:"contain" }} />
              <div>
                <div style={{ color:S.text, fontWeight:800, fontSize:"0.9rem", lineHeight:1.1 }}>Aarya Auto</div>
                <div style={{ display:"flex", alignItems:"center", gap:"0.35rem", marginTop:"0.1rem" }}>
                  <span style={{ background:S.indigoBg, border:`1px solid ${S.indigoBorder}`, borderRadius:"100px", padding:"0.08rem 0.5rem", fontSize:"0.58rem", color:S.indigo, fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase" }}>Admin Panel</span>
                </div>
              </div>
            </div>
            <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>✕</button>
          </div>

          {/* Nav groups */}
          <nav style={{ flex:1, padding:"1rem 0.75rem", overflowY:"auto" }}>
            {GROUPS.map(group => (
              <div key={group.label} style={{ marginBottom:"1.5rem" }}>
                <span style={{ color:S.muted, fontSize:"0.63rem", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", padding:"0 0.5rem", display:"block", marginBottom:"0.5rem" }}>{group.label}</span>
                {group.items.map(item => {
                  const active = isActive(item.path);
                  return (
                    <Link key={item.path} to={item.path} style={{
                      display:"flex", alignItems:"center", gap:"0.65rem",
                      padding:"0.58rem 0.75rem", borderRadius:"10px",
                      textDecoration:"none", fontSize:"0.85rem",
                      fontWeight: active ? 700 : 500,
                      color: active ? S.indigo : S.sub,
                      background: active ? S.indigoBg : "transparent",
                      border: `1.5px solid ${active ? S.indigoBorder : "transparent"}`,
                      marginBottom:"2px", transition:"all 0.15s",
                    }}
                      onMouseEnter={e=>{ if(!active){ e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color=S.text; }}}
                      onMouseLeave={e=>{ if(!active){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=S.sub; }}}
                    >
                      <span style={{ color: active ? S.indigo : S.muted, display:"flex" }}>{item.icon}</span>
                      {item.label}
                      {active && <div style={{ marginLeft:"auto", width:"6px", height:"6px", borderRadius:"50%", background:S.indigo, boxShadow:`0 0 8px ${S.indigo}` }} />}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* User footer */}
          <div style={{ padding:"1rem", borderTop:`1px solid ${S.border}`, background:S.surface }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.65rem", marginBottom:"0.85rem" }}>
              <div style={{ width:"34px", height:"34px", borderRadius:"50%", background:"linear-gradient(135deg, #4F46E5, #6366F1)", color:"#fff", fontSize:"0.82rem", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 2px 8px rgba(79,70,229,0.3)" }}>
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ color:S.text, fontSize:"0.82rem", fontWeight:700 }}>{adminName}</div>
                <div style={{ color:S.muted, fontSize:"0.67rem" }}>Administrator</div>
              </div>
            </div>
            <button onClick={logout} style={{
              width:"100%", padding:"0.55rem",
              background:"rgba(255,255,255,0.03)", border:`1.5px solid ${S.border}`,
              borderRadius:"8px", color:S.muted, cursor:"pointer",
              fontSize:"0.78rem", fontFamily:T.font, transition:"all 0.15s",
            }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="#EF4444"; e.currentTarget.style.color="#EF4444"; e.currentTarget.style.background="rgba(239,68,68,0.1)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=S.border; e.currentTarget.style.color=S.muted; e.currentTarget.style.background="rgba(255,255,255,0.03)"; }}
            >Sign out</button>
          </div>
        </aside>

        {/* Main content */}
        <main className="admin-main" style={{ flex:1, minHeight:"100vh", overflowY:"auto", background:T.bg, boxSizing: "border-box" }}>
          {/* Top bar */}
          <div className="top-bar-pad" style={{
            height:"66px", background:T.surface,
            borderBottom:`1px solid ${T.border}`,
            display:"flex", alignItems:"center", justifyContent:"space-between",
            position:"sticky", top:0, zIndex:50,
            boxShadow:"0 1px 8px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <button className="mobile-toggle" onClick={() => setMobileMenuOpen(true)} style={{ background: "none", border: "none", fontSize: "1.2rem", color: T.text, cursor: "pointer", padding: "0.25rem" }}>☰</button>
              <div>
                <h2 style={{ color:T.text, fontSize:"1rem", fontWeight:800, margin:0, letterSpacing:"-0.3px" }}>{pageTitle()}</h2>
                <p style={{ color:T.muted, fontSize:"0.73rem", margin:0, marginTop:"0.1rem" }}>Aarya Auto Garage Admin</p>
              </div>
            </div>
            <div className="user-name-hide" style={{ border:`1.5px solid ${T.border}`, borderRadius:"100px", padding:"0.28rem 0.85rem 0.28rem 0.5rem", display:"flex", alignItems:"center", gap:"0.55rem", background:T.bg }}>
              <div style={{ width:"26px", height:"26px", borderRadius:"50%", background:"linear-gradient(135deg, #4F46E5, #6366F1)", color:"#fff", fontSize:"0.68rem", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {adminName.charAt(0).toUpperCase()}
              </div>
              <span style={{ color:T.sub, fontSize:"0.8rem", fontWeight:600 }}>{adminName}</span>
            </div>
          </div>
          <div style={{ padding:"1.5rem" }}>{children}</div>
        </main>
      </div>
    </>
  );
}

export default Sidebar;
