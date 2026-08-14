import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { toast } from "../Components/Toast";

function SparePartsList() {
    const navigate = useNavigate();

    const [parts, setParts] = useState([]);
    const [filteredParts, setFilteredParts] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [cartCount, setCartCount] = useState(0);
    const [addingId, setAddingId] = useState(null); // track which part is animating
    const [cartItems, setCartItems] = useState([]); // items currently in cart
    const [showCart, setShowCart] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const customerId = localStorage.getItem("ID");
    const customerName = localStorage.getItem("Name");

    // Load spare parts
    const loadParts = async () => {
        try {
            setLoading(true);
            const res = await axios.get("https://aaryaautogarage.onrender.com/spare_parts");
            setParts(res.data);
            setFilteredParts(res.data);
        } catch (err) {
            console.error("Error loading spare parts:", err);
        } finally {
            setLoading(false);
        }
    };

    // Load cart count
    const loadCartCount = async () => {
        if (!customerId) return;
        try {
            const res = await axios.get(`https://aaryaautogarage.onrender.com/cart/count/${customerId}`);
            setCartCount(res.data.totalItems);
        } catch (err) {
            console.error("Error loading cart count:", err);
        }
    };

    // Load cart items
    const loadCartItems = async () => {
        if (!customerId) return;
        try {
            const res = await axios.get(`https://aaryaautogarage.onrender.com/cart/${customerId}`);
            setCartItems(res.data);
        } catch (err) {
            console.error("Error loading cart items:", err);
        }
    };

    useEffect(() => {
        if (!customerId) {
            navigate("/login");
            return;
        }
        loadParts();
        loadCartCount();
    }, []);

    // Filter by search + category
    useEffect(() => {
        let result = parts;

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.part_name?.toLowerCase().includes(q) ||
                    p.brand?.toLowerCase().includes(q)
            );
        }

        if (selectedCategory !== "All") {
            result = result.filter((p) => p.category === selectedCategory);
        }

        setFilteredParts(result);
        setCurrentPage(1);
    }, [search, selectedCategory, parts]);

    const totalPages = Math.ceil(filteredParts.length / itemsPerPage);
    const currentItems = filteredParts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Get unique categories
    const categories = ["All", ...new Set(parts.map((p) => p.category).filter(Boolean))];

    // Add to cart handler
    const addToCart = async (partId) => {
        if (!customerId) {
            toast.warning("Please login first!");
            navigate("/login");
            return;
        }

        setAddingId(partId);

        try {
            await axios.post("https://aaryaautogarage.onrender.com/cart/add", {
                customer_id: customerId,
                part_id: partId,
            });
            await loadCartCount();
            toast.success("Item added to cart!");
        } catch (err) {
            toast.error("Failed to add to cart: " + (err.response?.data?.message || err.message));
        } finally {
            setTimeout(() => setAddingId(null), 600);
        }
    };

    // Remove from cart
    const removeFromCart = async (cartId) => {
        try {
            await axios.delete(`https://aaryaautogarage.onrender.com/cart/remove/${cartId}`);
            await loadCartItems();
            await loadCartCount();
        } catch (err) {
            toast.error("Failed to remove item");
        }
    };

    // Toggle cart panel
    const toggleCart = async () => {
        if (!showCart) await loadCartItems();
        setShowCart(!showCart);
    };

    // Logout
    const logout = () => {
        sessionStorage.clear();
        localStorage.clear();
        navigate("/login");
    };

    // Get stock badge color
    const getStockColor = (qty) => {
        if (qty <= 0) return { bg: "#FEE2E2", color: "#EF4444", text: "Out of Stock" };
        if (qty <= 5) return { bg: "#FEF3C7", color: "#D97706", text: `Only ${qty} left` };
        return { bg: "#DCFCE7", color: "#10B981", text: `In Stock (${qty})` };
    };

    // =========== STYLES ===========
    const styles = {
        page: {
            minHeight: "100vh",
            background: "#F8FAFC",
            color: "#0F172A",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
        },
        navbar: {
            background: "#FFFFFF",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #E2E8F0",
            padding: "0.75rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 100,
        },
        logo: {
            color: "#3B82F6",
            fontWeight: 700,
            fontSize: "1.25rem",
            letterSpacing: "0.5px",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
        },
        navRight: {
            display: "flex",
            alignItems: "center",
            gap: "1rem",
        },
        userName: {
            color: "#475569",
            fontSize: "0.9rem",
        },
        cartBtn: {
            position: "relative",
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "0.5rem",
            padding: "0.5rem 0.85rem",
            color: "#0F172A",
            cursor: "pointer",
            fontSize: "1.05rem",
            transition: "all 0.3s ease",
        },
        cartBadge: {
            position: "absolute",
            top: "-6px",
            right: "-6px",
            background: "#3B82F6",
            color: "#fff",
            fontSize: "0.7rem",
            fontWeight: 700,
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        logoutBtn: {
            background: "transparent",
            border: "1px solid #e74c3c",
            color: "#e74c3c",
            borderRadius: "0.5rem",
            padding: "0.45rem 1rem",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 600,
            transition: "all 0.3s ease",
        },
        container: {
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "2rem 1.5rem",
        },
        header: {
            textAlign: "center",
            marginBottom: "2rem",
        },
        title: {
            fontSize: "2.2rem",
            fontWeight: 700,
            color: "#0F172A",
            margin: "0 0 0.5rem",
            letterSpacing: "-0.5px",
        },
        subtitle: {
            color: "#64748B",
            fontSize: "1rem",
            margin: 0,
        },
        controls: {
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "2rem",
        },
        searchInput: {
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            color: "#0F172A",
            borderRadius: "0.6rem",
            padding: "0.65rem 1rem 0.65rem 2.5rem",
            fontSize: "0.9rem",
            width: "320px",
            outline: "none",
            transition: "border-color 0.3s ease",
        },
        searchWrapper: {
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
        },
        searchIcon: {
            position: "absolute",
            left: "0.85rem",
            color: "#64748B",
            fontSize: "0.95rem",
            pointerEvents: "none",
        },
        categoryBtn: (active) => ({
            background: active ? "#3B82F6" : "#FFFFFF",
            border: active ? "none" : "1px solid #E2E8F0",
            color: active ? "#fff" : "#64748B",
            borderRadius: "2rem",
            padding: "0.45rem 1.15rem",
            cursor: "pointer",
            fontSize: "0.82rem",
            fontWeight: active ? 700 : 500,
            transition: "all 0.3s ease",
            whiteSpace: "nowrap",
        }),
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
        },
        card: {
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "0.85rem",
            overflow: "hidden",
            transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
            cursor: "default",
        },
        cardHover: {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 40px rgba(59, 130, 246, 0.15)",
            borderColor: "#3B82F6",
        },
        cardImage: {
            width: "100%",
            height: "170px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "3rem",
            fontWeight: 700,
        },
        cardBody: {
            padding: "1.25rem",
        },
        partName: {
            fontSize: "1.05rem",
            fontWeight: 600,
            color: "#0F172A",
            margin: "0 0 0.3rem",
            lineHeight: 1.3,
        },
        brand: {
            fontSize: "0.82rem",
            color: "#64748B",
            margin: "0 0 0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
        },
        priceRow: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.85rem",
        },
        price: {
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#3B82F6",
        },
        stockBadge: (stockInfo) => ({
            background: stockInfo.bg,
            color: stockInfo.color,
            fontSize: "0.72rem",
            fontWeight: 600,
            padding: "0.25rem 0.65rem",
            borderRadius: "1rem",
        }),
        category: {
            display: "inline-block",
            background: "#DBEAFE",
            color: "#3B82F6",
            fontSize: "0.72rem",
            fontWeight: 600,
            padding: "0.2rem 0.6rem",
            borderRadius: "0.3rem",
            marginBottom: "0.85rem",
        },
        addBtn: (isAdding) => ({
            width: "100%",
            padding: "0.65rem",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            background: isAdding
                ? "#10B981"
                : "#3B82F6",
            color: "#fff",
            boxShadow: isAdding
                ? "0 4px 15px rgba(16, 185, 129, 0.3)"
                : "0 4px 15px rgba(59, 130, 246, 0.3)",
            transform: isAdding ? "scale(0.96)" : "scale(1)",
            letterSpacing: "0.3px",
        }),
        disabledBtn: {
            width: "100%",
            padding: "0.65rem",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "not-allowed",
            background: "#E2E8F0",
            color: "#94A3B8",
            letterSpacing: "0.3px",
        },
        emptyState: {
            textAlign: "center",
            padding: "4rem 2rem",
            color: "#7f8c8d",
        },
        // Cart sidebar
        cartOverlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 200,
            transition: "opacity 0.3s ease",
        },
        cartSidebar: {
            position: "fixed",
            top: 0,
            right: 0,
            width: "400px",
            maxWidth: "90vw",
            height: "100vh",
            background: "#FFFFFF",
            borderLeft: "1px solid #E2E8F0",
            zIndex: 201,
            display: "flex",
            flexDirection: "column",
            boxShadow: "-8px 0 30px rgba(0,0,0,0.1)",
        },
        cartHeader: {
            padding: "1.5rem",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        cartTitle: {
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#0F172A",
            margin: 0,
        },
        closeBtn: {
            background: "transparent",
            border: "none",
            color: "#7f8c8d",
            fontSize: "1.5rem",
            cursor: "pointer",
            padding: "0.25rem",
            lineHeight: 1,
        },
        cartBody: {
            flex: 1,
            overflowY: "auto",
            padding: "1rem 1.5rem",
        },
        cartItem: {
            display: "flex",
            gap: "1rem",
            padding: "1rem 0",
            borderBottom: "1px solid #E2E8F0",
            alignItems: "center",
        },
        cartItemIcon: {
            width: "48px",
            height: "48px",
            borderRadius: "0.5rem",
            background: "#DBEAFE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.25rem",
            flexShrink: 0,
        },
        cartItemInfo: {
            flex: 1,
        },
        cartItemName: {
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "#0F172A",
            margin: 0,
        },
        cartItemDetail: {
            fontSize: "0.78rem",
            color: "#64748B",
            margin: "0.15rem 0 0",
        },
        cartItemPrice: {
            fontSize: "1rem",
            fontWeight: 700,
            color: "#3B82F6",
            whiteSpace: "nowrap",
        },
        cartRemoveBtn: {
            background: "transparent",
            border: "none",
            color: "#e74c3c",
            cursor: "pointer",
            fontSize: "1rem",
            padding: "0.25rem",
        },
        cartFooter: {
            padding: "1.25rem 1.5rem",
            borderTop: "1px solid #E2E8F0",
        },
        cartTotal: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#0F172A",
            marginBottom: "0.75rem",
        },
        cartTotalPrice: {
            color: "#3B82F6",
            fontSize: "1.3rem",
        },
        resultCount: {
            textAlign: "center",
            color: "#7f8c8d",
            fontSize: "0.85rem",
            marginBottom: "1rem",
        },
    };

    // Card color gradients for the image area based on category
    const getCategoryGradient = (category) => {
        const gradients = {
            Engine: "linear-gradient(135deg, #1a1a2e 0%, #2d1b3d 100%)",
            Brakes: "linear-gradient(135deg, #1a2e1a 0%, #1b3d2d 100%)",
            Suspension: "linear-gradient(135deg, #2e1a1a 0%, #3d1b2d 100%)",
            Electrical: "linear-gradient(135deg, #1a2e2e 0%, #1b3d3d 100%)",
            Body: "linear-gradient(135deg, #2e2e1a 0%, #3d3d1b 100%)",
            General: "linear-gradient(135deg, #1e1e2f 0%, #2a2a3d 100%)",
        };
        return gradients[category] || "linear-gradient(135deg, #1e1e2f 0%, #2a2a3d 100%)";
    };

    const getCategoryEmoji = (category) => {
        const emojis = {
            Engine: "⚙️",
            Brakes: "🔧",
            Suspension: "🛞",
            Electrical: "⚡",
            Body: "🚗",
            General: "🔩",
        };
        return emojis[category] || "🔩";
    };

    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <Sidebar>
        <div style={{ minHeight: "100vh" }}>
            {/* Cart button floating */}
            <div style={{ position: "fixed", top: "1rem", right: "2rem", zIndex: 90 }}>
                <button
                    style={styles.cartBtn}
                    onClick={toggleCart}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#e67e22";
                        e.currentTarget.style.background = "rgba(230, 126, 34, 0.08)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#3a3a50";
                        e.currentTarget.style.background = "transparent";
                    }}
                >
                    🛒
                    {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
                </button>
            </div>

            {/* ========= MAIN CONTENT ========= */}
            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <h1 style={styles.title}>Spare Parts Catalog</h1>
                    <p style={styles.subtitle}>
                        Browse premium quality auto spare parts for your vehicle
                    </p>
                </div>

                {/* Search & Filters */}
                <div style={styles.controls}>
                    <div style={styles.searchWrapper}>
                        <span style={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search parts by name or brand..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={styles.searchInput}
                            onFocus={(e) => (e.target.style.borderColor = "#e67e22")}
                            onBlur={(e) => (e.target.style.borderColor = "#3a3a50")}
                        />
                    </div>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            style={styles.categoryBtn(selectedCategory === cat)}
                            onClick={() => setSelectedCategory(cat)}
                            onMouseEnter={(e) => {
                                if (selectedCategory !== cat) {
                                    e.currentTarget.style.borderColor = "#e67e22";
                                    e.currentTarget.style.color = "#e67e22";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedCategory !== cat) {
                                    e.currentTarget.style.borderColor = "#3a3a50";
                                    e.currentTarget.style.color = "#bdc3c7";
                                }
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Result count */}
                <p style={styles.resultCount}>
                    Showing {filteredParts.length} of {parts.length} parts
                </p>

                {/* Loading */}
                {loading && (
                    <div style={styles.emptyState}>
                        <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⏳</p>
                        <p>Loading spare parts...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredParts.length === 0 && (
                    <div style={styles.emptyState}>
                        <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</p>
                        <h3 style={{ color: "#bdc3c7", margin: "0 0 0.5rem" }}>No Parts Found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                )}

                {/* Parts Grid */}
                {!loading && (
                    <div style={styles.grid}>
                        {currentItems.map((part) => {
                            const stockInfo = getStockColor(part.stock_quantity);
                            const isAdding = addingId === part.part_id;
                            const outOfStock = part.stock_quantity <= 0;

                            return (
                                <div
                                    key={part.part_id}
                                    style={styles.card}
                                    onMouseEnter={(e) => {
                                        Object.assign(e.currentTarget.style, styles.cardHover);
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                        e.currentTarget.style.borderColor = "#2a2a3d";
                                    }}
                                >
                                    {/* Card image area */}
                                    <div
                                        style={{
                                            ...styles.cardImage,
                                            background: getCategoryGradient(part.category),
                                        }}
                                    >
                                        {getCategoryEmoji(part.category)}
                                    </div>

                                    {/* Card body */}
                                    <div style={styles.cardBody}>
                                        <span style={styles.category}>{part.category || "General"}</span>
                                        <h3 style={styles.partName}>{part.part_name}</h3>
                                        <p style={styles.brand}>
                                            🏷️ {part.brand || "N/A"}
                                        </p>
                                        <div style={styles.priceRow}>
                                            <span style={styles.price}>₹{Number(part.price).toLocaleString()}</span>
                                            <span style={styles.stockBadge(stockInfo)}>
                                                {stockInfo.text}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => !outOfStock && addToCart(part.part_id)}
                                            style={
                                                outOfStock
                                                    ? styles.disabledBtn
                                                    : styles.addBtn(isAdding)
                                            }
                                            disabled={outOfStock}
                                            onMouseEnter={(e) => {
                                                if (!outOfStock && !isAdding) {
                                                    e.currentTarget.style.transform = "translateY(-1px)";
                                                    e.currentTarget.style.boxShadow =
                                                        "0 6px 20px rgba(230, 126, 34, 0.45)";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!outOfStock && !isAdding) {
                                                    e.currentTarget.style.transform = "translateY(0)";
                                                    e.currentTarget.style.boxShadow =
                                                        "0 4px 15px rgba(230, 126, 34, 0.3)";
                                                }
                                            }}
                                        >
                                            {outOfStock
                                                ? "Out of Stock"
                                                : isAdding
                                                ? "✓ Added!"
                                                : "🛒 Add to Cart"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && !loading && filteredParts.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "3rem" }}>
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                            style={{
                                padding: "0.6rem 1.25rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.9rem",
                                background: currentPage === 1 ? "#F8FAFC" : "#3B82F6",
                                color: currentPage === 1 ? "#94A3B8" : "#fff",
                                border: `1px solid ${currentPage === 1 ? "#E2E8F0" : "#3B82F6"}`,
                                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                transition: "all 0.15s"
                            }}
                        >
                            ← Previous
                        </button>

                        <span style={{ color: "#475569", fontWeight: 600, fontSize: "0.95rem" }}>
                            Page {currentPage} of {totalPages}
                        </span>

                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                            style={{
                                padding: "0.6rem 1.25rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.9rem",
                                background: currentPage === totalPages ? "#F8FAFC" : "#3B82F6",
                                color: currentPage === totalPages ? "#94A3B8" : "#fff",
                                border: `1px solid ${currentPage === totalPages ? "#E2E8F0" : "#3B82F6"}`,
                                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                transition: "all 0.15s"
                            }}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

            {/* ========= CART SIDEBAR ========= */}
            {showCart && (
                <>
                    <div style={styles.cartOverlay} onClick={toggleCart} />
                    <div style={styles.cartSidebar}>
                        <div style={styles.cartHeader}>
                            <h3 style={styles.cartTitle}>🛒 Your Cart</h3>
                            <button style={styles.closeBtn} onClick={toggleCart}>
                                ✕
                            </button>
                        </div>

                        <div style={styles.cartBody}>
                            {cartItems.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#7f8c8d" }}>
                                    <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛒</p>
                                    <p style={{ fontWeight: 600, color: "#bdc3c7" }}>Your cart is empty</p>
                                    <p style={{ fontSize: "0.85rem" }}>Browse parts and add them to your cart</p>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item.cart_id} style={styles.cartItem}>
                                        <div style={styles.cartItemIcon}>
                                            {getCategoryEmoji(item.category)}
                                        </div>
                                        <div style={styles.cartItemInfo}>
                                            <p style={styles.cartItemName}>{item.part_name}</p>
                                            <p style={styles.cartItemDetail}>
                                                {item.brand} · Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <span style={styles.cartItemPrice}>
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </span>
                                        <button
                                            style={styles.cartRemoveBtn}
                                            onClick={() => removeFromCart(item.cart_id)}
                                            title="Remove from cart"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <div style={styles.cartFooter}>
                                <div style={styles.cartTotal}>
                                    <span>Total</span>
                                    <span style={styles.cartTotalPrice}>
                                        ₹{cartTotal.toLocaleString()}
                                    </span>
                                </div>
                                <p style={{ fontSize: "0.75rem", color: "#7f8c8d", margin: 0 }}>
                                    Customer ID: {customerId}
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
        </Sidebar>
    );
}

export default SparePartsList;
