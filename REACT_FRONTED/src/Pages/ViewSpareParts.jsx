import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import CustomerNavbar from "../Components/CustomerNavbar";
import { toast } from "../Components/Toast";

const T = {
  bg:        "#F8F9FC",
  surface:   "#FFFFFF",
  card:      "#FFFFFF",
  border:    "#E4E9F2",
  text:      "#111827",
  sub:       "#374151",
  muted:     "#6B7280",
  accent:    "#E84A2F",
  blue:      "#3B6FFF",
  blueHov:   "#2554E8",
  font:      "'Inter', 'Segoe UI', system-ui, sans-serif",
};

const CATEGORIES = ["Engine", "Brakes", "Suspension", "Electricals", "Body Parts", "Filters"];
const CAT_ICONS  = { Engine: "⚙️", Brakes: "🛑", Suspension: "🔩", Electricals: "⚡", "Body Parts": "🚗", Filters: "🔧" };

function ViewSpareParts() {
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = sessionStorage.getItem("ID") || localStorage.getItem("ID");

  // Read ?category= from URL on first mount
  const initialCategory = new URLSearchParams(location.search).get("category") || "";

  const [parts,      setParts]      = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [search,     setSearch]     = useState(initialCategory);
  const [activeTag,  setActiveTag]  = useState(initialCategory);
  const [loading,    setLoading]    = useState(true);
  const [addedId,    setAddedId]    = useState(null);
  const [hoveredId,  setHoveredId]  = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  /* Fetch all parts once */
  useEffect(() => {
    axios.get("https://aaryaautogarage.onrender.com/spare_parts")
      .then(r => { setParts(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Re-apply filter whenever parts / search / activeTag change */
  useEffect(() => {
    let r = parts;
    const q = (search || activeTag).trim().toLowerCase();
    if (q) {
      r = r.filter(p =>
        p.part_name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.categories?.toLowerCase().includes(q) ||
        p.applicable_model?.toLowerCase().includes(q) ||
        p.applicability_base_model?.toLowerCase().includes(q)
      );
    }
    setFiltered(r);
    setCurrentPage(1);
  }, [search, activeTag, parts]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTagClick = (cat) => {
    if (activeTag === cat) {
      // deselect
      setActiveTag("");
      setSearch("");
    } else {
      setActiveTag(cat);
      setSearch(cat);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setActiveTag(""); // clear category chip when typing manually
  };

  const addToCart = async (partId) => {
    if (!customerId) { toast.warning("Please log in to add products to the cart."); navigate("/login"); return; }
    try {
      await axios.post("https://aaryaautogarage.onrender.com/cart/add", { customer_id: customerId, part_id: partId });
      window.dispatchEvent(new Event("cartUpdated"));
      setAddedId(partId);
      toast.success("Item added to cart!");
      setTimeout(() => setAddedId(null), 1400);
    } catch { toast.error("Could not add to cart"); }
  };

  const buyNow = async (partId) => {
    if (!customerId) { toast.warning("Please log in to proceed with the purchase."); navigate("/login"); return; }
    try {
      await axios.post("https://aaryaautogarage.onrender.com/cart/add", { customer_id: customerId, part_id: partId });
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/checkout");
    } catch { toast.error("Could not process Buy Now"); }
  };

  const stockInfo = (qty) => {
    if (qty <= 0) return { label: "Out of Stock", color: "#EF4444", bg: "#FFF0F0" };
    if (qty <= 5) return { label: `Only ${qty} left`, color: "#F59E0B", bg: "#FFFBEB" };
    return { label: "In Stock", color: "#10B981", bg: "#ECFDF5" };
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.font }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <CustomerNavbar />

      <style>{`
        @media (max-width: 640px) {
          .cat-header { padding: 2rem 1.5rem !important; }
          .cat-filters { padding: 1rem 1.5rem !important; }
          .cat-grid { padding: 1.5rem 1rem !important; }
          .search-bar { min-width: 100% !important; }
          .mobile-product-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
            gap: 0.6rem !important;
          }
          .product-card { padding: 0.8rem !important; }
          .product-img-box { height: 110px !important; margin-bottom: 0.5rem !important; }
          .mobile-cat-chips {
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            justify-content: flex-start !important;
            width: 100% !important;
            padding-bottom: 0.25rem !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none; /* Firefox */
          }
          .mobile-cat-chips::-webkit-scrollbar {
            display: none; /* Safari and Chrome */
          }
          .mobile-cat-chips > button {
            flex-shrink: 0 !important;
          }
          .mobile-results-text {
            width: 100% !important;
            text-align: center !important;
            display: block !important;
          }
        }
      `}</style>
      {/* ── Page Header ── */}
      <div className="cat-header" style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)",
        padding: "3.5rem 2.5rem 3rem",
      }}>
        <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
          <span style={{ color: "#FF6B35", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>Catalogue</span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", margin: "0 0 0.4rem", letterSpacing: "-0.5px" }}>
            Spare Parts
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", margin: 0 }}>
            Browse {parts.length} genuine parts — search, filter by category, and add to cart.
          </p>
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div className="cat-filters" style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "1.25rem 2.5rem", position: "sticky", top: "62px", zIndex: 40 }}>
        <div style={{ maxWidth: "1150px", margin: "0 auto", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* Search box */}
          <div className="search-bar" style={{ flex: 1, minWidth: "220px", position: "relative" }}>
            <span style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: T.muted, fontSize: "1rem" }}>🔍</span>
            <input
              type="text"
              placeholder="Search by name, brand or model..."
              value={search}
              onChange={handleSearchChange}
              style={{
                width: "100%", padding: "0.7rem 1rem 0.7rem 2.5rem",
                background: T.bg, border: `1.5px solid ${T.border}`,
                borderRadius: "10px", color: T.text, fontSize: "0.9rem",
                outline: "none", fontFamily: T.font, boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.currentTarget.style.borderColor = T.blue}
              onBlur={e => e.currentTarget.style.borderColor = T.border}
            />
          </div>

          {/* Category chips */}
          <div className="mobile-cat-chips" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => {
              const active = activeTag === cat;
              return (
                <button key={cat}
                  onClick={() => handleTagClick(cat)}
                  style={{
                    padding: "0.42rem 1rem", borderRadius: "100px",
                    border: `1.5px solid ${active ? T.blue : T.border}`,
                    background: active ? "#EEF3FF" : T.bg,
                    color: active ? T.blue : T.muted,
                    fontSize: "0.82rem", fontWeight: active ? 700 : 500,
                    cursor: "pointer", fontFamily: T.font, transition: "all 0.18s",
                    display: "flex", alignItems: "center", gap: "0.3rem",
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = T.blue; e.currentTarget.style.color = T.blue; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}}
                >
                  {CAT_ICONS[cat]} {cat}
                </button>
              );
            })}
          </div>

          <span className="mobile-results-text" style={{ color: T.muted, fontSize: "0.82rem", whiteSpace: "nowrap", fontWeight: 600 }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── Active filter banner ── */}
      {activeTag && (
        <div style={{ maxWidth: "1150px", margin: "0.75rem auto 0", padding: "0 2.5rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.6rem",
            background: "#EEF3FF", border: "1.5px solid #C7D7FF", borderRadius: "100px",
            padding: "0.35rem 1rem", fontSize: "0.83rem", color: T.blue, fontWeight: 600,
          }}>
            {CAT_ICONS[activeTag] || "🏷️"} Showing: <strong>{activeTag}</strong>
            <button onClick={() => { setActiveTag(""); setSearch(""); }} style={{
              background: "none", border: "none", color: T.muted, cursor: "pointer",
              fontSize: "1rem", lineHeight: 1, padding: "0 0.1rem",
            }}>✕</button>
          </div>
        </div>
      )}

      {/* ── Grid ── */}
      <div className="cat-grid" style={{ maxWidth: "1150px", margin: "1.5rem auto 4rem", padding: "0 2.5rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem", color: T.muted, fontSize: "1.1rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⏳</div>
            Loading spare parts...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem", color: T.muted }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <p style={{ fontWeight: 700, color: T.sub, fontSize: "1.05rem" }}>No parts match "{search}"</p>
            <p style={{ fontSize: "0.88rem" }}>Try a different search term or clear the filter.</p>
            <button onClick={() => { setSearch(""); setActiveTag(""); }} style={{
              marginTop: "1rem", padding: "0.65rem 1.5rem",
              background: T.blue, border: "none", borderRadius: "8px",
              color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: T.font,
            }}>Clear filter</button>
          </div>
        ) : (
          <div className="mobile-product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr))", gap: "1.25rem" }}>
            {currentItems.map(part => {
              const s = stockInfo(part.stock_quantity);
              const oos = part.stock_quantity <= 0;
              const added = addedId === part.part_id;
              const hovered = hoveredId === part.part_id;

              return (
                <div className="product-card" key={part.part_id}
                  onClick={() => navigate(`/product/${part.part_id}`)}
                  onMouseEnter={() => setHoveredId(part.part_id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    background: T.card, borderRadius: "16px",
                    border: `1.5px solid ${hovered ? T.blue : T.border}`,
                    padding: "1.25rem", transition: "all 0.22s ease",
                    display: "flex", flexDirection: "column", cursor: "pointer",
                    boxShadow: hovered ? "0 12px 32px rgba(59,111,255,0.12)" : "0 2px 8px rgba(0,0,0,0.04)",
                    transform: hovered ? "translateY(-4px)" : "none",
                  }}
                >
                  {/* Product Image */}
                  <div className="product-img-box" style={{
                    width: "100%", height: "160px", marginBottom: "1rem", borderRadius: "10px",
                    overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                    background: "#F8F9FC", border: `1px solid ${T.border}`,
                    position: "relative",
                  }}>
                    {part.image
                      ? <img src={part.image} alt={part.part_name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      : <span style={{ fontSize: "3rem" }}>🔩</span>}
                    {/* Stock badge overlay */}
                    <span style={{
                      position: "absolute", top: "0.6rem", right: "0.6rem",
                      background: s.bg, color: s.color,
                      borderRadius: "100px", padding: "0.2rem 0.65rem",
                      fontSize: "0.68rem", fontWeight: 700,
                      border: `1px solid ${s.color}40`,
                    }}>{s.label}</span>
                  </div>

                  <p style={{ color: T.text, fontWeight: 700, fontSize: "0.95rem", margin: "0 0 0.25rem", lineHeight: 1.35 }}>{part.part_name}</p>
                  <p style={{ color: T.muted, fontSize: "0.78rem", margin: "0 0 1rem" }}>
                    {part.brand || "—"}
                    {part.applicable_model ? ` · ${part.applicable_model}` : ""}
                  </p>

                  <div style={{ marginTop: "auto" }}>
                    <span style={{ color: T.accent, fontWeight: 800, fontSize: "1.2rem", display: "block", marginBottom: "0.85rem" }}>
                      ₹{Number(part.price).toLocaleString()}
                    </span>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        disabled={oos}
                        onClick={e => { e.stopPropagation(); !oos && addToCart(part.part_id); }}
                        style={{
                          flex: 1, padding: "0.6rem 0.5rem",
                          background: oos ? "#F3F4F6" : added ? "#10B981" : "linear-gradient(135deg, #E84A2F, #FF6B35)",
                          border: "none", borderRadius: "8px",
                          color: oos ? T.muted : "#fff",
                          fontSize: "0.85rem", fontWeight: 700,
                          cursor: oos ? "not-allowed" : "pointer", fontFamily: T.font,
                          boxShadow: oos || added ? "none" : "0 3px 12px rgba(232,74,47,0.35)",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { if (!oos && !added) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(232,74,47,0.45)"; }}}
                        onMouseLeave={e => { if (!oos && !added) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 3px 12px rgba(232,74,47,0.35)"; }}}
                      >
                        {oos ? "Out of Stock" : added ? "✓ Added!" : "+ Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && !loading && filtered.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1.5rem", marginTop: "3rem" }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              style={{
                padding: "0.6rem 1.25rem", borderRadius: "8px", fontFamily: T.font, fontWeight: 600, fontSize: "0.9rem",
                background: currentPage === 1 ? T.bg : "#EEF3FF",
                color: currentPage === 1 ? T.muted : T.blue,
                border: `1.5px solid ${currentPage === 1 ? T.border : "#C7D7FF"}`,
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                transition: "all 0.15s"
              }}
              onMouseEnter={e => { if(currentPage !== 1) { e.currentTarget.style.background = T.blue; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = T.blue; } }}
              onMouseLeave={e => { if(currentPage !== 1) { e.currentTarget.style.background = "#EEF3FF"; e.currentTarget.style.color = T.blue; e.currentTarget.style.borderColor = "#C7D7FF"; } }}
            >
              ← Previous
            </button>

            <span style={{ color: T.sub, fontWeight: 600, fontSize: "0.95rem" }}>
              Page {currentPage} of {totalPages}
            </span>

            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              style={{
                padding: "0.6rem 1.25rem", borderRadius: "8px", fontFamily: T.font, fontWeight: 600, fontSize: "0.9rem",
                background: currentPage === totalPages ? T.bg : "#EEF3FF",
                color: currentPage === totalPages ? T.muted : T.blue,
                border: `1.5px solid ${currentPage === totalPages ? T.border : "#C7D7FF"}`,
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                transition: "all 0.15s"
              }}
              onMouseEnter={e => { if(currentPage !== totalPages) { e.currentTarget.style.background = T.blue; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = T.blue; } }}
              onMouseLeave={e => { if(currentPage !== totalPages) { e.currentTarget.style.background = "#EEF3FF"; e.currentTarget.style.color = T.blue; e.currentTarget.style.borderColor = "#C7D7FF"; } }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        background: "#0F172A", borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "1.5rem 2.5rem", textAlign: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
          <img src="/logo.png" alt="" style={{ width: "20px", height: "20px", objectFit: "contain", opacity: 0.6 }} />
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>© 2025 Aarya Auto Garage</span>
        </div>
      </footer>
    </div>
  );
}

export default ViewSpareParts;
