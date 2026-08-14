import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

function Dashboard() {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalParts: 0,
        totalCartItems: 0,
        lowStockCount: 0,
        inventoryValue: 0,
        totalCategories: 0,
        recentCustomers: [],
        recentParts: [],
        lowStockParts: [],
        categoryStats: []
    });

    const [loading, setLoading] = useState(true);

    const loadDashboard = async () => {

        try {

            setLoading(true);
            const res = await axios.get("https://aaryaautogarage.onrender.com/dashboard/stats");
            setStats(res.data);

        } catch (err) {
            console.error("Error loading dashboard:", err);
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        loadDashboard();
    }, []);

    // Design tokens — light admin theme
    const D = {
        bg: "#F8F9FC", surface: "#FFFFFF", border: "#E4E9F2",
        text: "#111827", sub: "#374151", muted: "#6B7280",
        indigo: "#4F46E5", indigoBg: "#EEF2FF", indigoBorder: "#C7D2FE",
        accent: "#E84A2F",
    };
    const styles = {
        statsGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "1.25rem", marginBottom: "2rem",
        },
        statCard: {
            background: D.surface, border: `1.5px solid ${D.border}`,
            borderRadius: "16px", padding: "1.25rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            transition: "all 0.2s",
            display: "flex", flexDirection: "column", justifyContent: "space-between"
        },
        statTop: { marginBottom: "0.75rem" },
        statIcon: {
            width: "40px", height: "40px", borderRadius: "12px",
            background: D.indigoBg, border: `1.5px solid ${D.indigoBorder}`,
            color: D.indigo,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.1rem", marginBottom: "1rem",
        },
        statChange: () => ({}),
        statValue: {
            fontSize: "1.5rem", fontWeight: 900,
            color: D.text, margin: "0 0 0.2rem",
            lineHeight: 1, letterSpacing: "-0.5px",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
        },
        statLabel: { fontSize: "0.8rem", color: D.muted, fontWeight: 600 },
        sectionGrid: {
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem", marginBottom: "2rem",
        },
        card: {
            background: D.surface, border: `1.5px solid ${D.border}`,
            borderRadius: "16px", overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            minWidth: 0,
        },
        cardHeader: {
            padding: "1.1rem 1.5rem",
            borderBottom: `1px solid ${D.border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: D.bg,
        },
        cardTitle: {
            fontSize: "0.9rem", fontWeight: 800, color: D.text, margin: 0,
            display: "flex", alignItems: "center", gap: "0.5rem",
        },
        viewAllLink: {
            fontSize: "0.78rem", color: D.indigo,
            textDecoration: "none", fontWeight: 700,
        },
        cardBody: { padding: "0.25rem 0" },
        listItem: {
            display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "0.8rem 1.5rem",
            borderBottom: `1px solid ${D.border}`,
            transition: "background 0.15s",
        },
        listAvatar: {
            width: "34px", height: "34px", borderRadius: "50%",
            background: D.indigoBg, border: `1.5px solid ${D.indigoBorder}`,
            color: D.indigo,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: "0.78rem", flexShrink: 0,
        },
        listInfo: { flex: 1, minWidth: 0 },
        listName: {
            fontSize: "0.87rem", fontWeight: 700, color: D.text, margin: 0,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        },
        listSub: { fontSize: "0.73rem", color: D.muted, margin: 0 },
        listRight: { textAlign: "right", flexShrink: 0 },
        listPrice: { fontSize: "0.9rem", fontWeight: 800, color: D.accent },
        listBadge: (color) => ({
            fontSize: "0.68rem", fontWeight: 700,
            padding: "0.2rem 0.55rem", borderRadius: "100px",
            background: color === "red" ? "#FFF0F0" : color === "orange" ? "#FFFBEB" : "#ECFDF5",
            color: color === "red" ? "#EF4444" : color === "orange" ? "#D97706" : "#10B981",
            border: `1px solid ${color === "red" ? "#FFC9C9" : color === "orange" ? "#FDE68A" : "#A7F3D0"}`,
        }),
        fullWidthSection: { marginBottom: "2rem" },
        alertCard: {
            background: D.surface, border: "1.5px solid #FFC9C9",
            borderRadius: "16px", overflow: "hidden",
            boxShadow: "0 2px 8px rgba(239,68,68,0.06)",
        },
        alertHeader: {
            padding: "1rem 1.5rem", borderBottom: "1px solid #FFC9C9",
            display: "flex", alignItems: "center", gap: "0.5rem", background: "#FFF0F0",
        },
        alertTitle: { fontSize: "0.9rem", fontWeight: 800, color: "#EF4444", margin: 0 },
        alertBody: { padding: "0.25rem 0" },
        alertItem: {
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0.75rem 1.5rem", borderBottom: `1px solid ${D.border}`,
        },
        alertItemName: { fontSize: "0.87rem", color: D.text, fontWeight: 700 },
        alertItemBrand: { fontSize: "0.73rem", color: D.muted },
        alertStock: (qty) => ({
            fontSize: "0.72rem", fontWeight: 700,
            color: qty <= 0 ? "#EF4444" : "#D97706",
            background: qty <= 0 ? "#FFF0F0" : "#FFFBEB",
            border: `1px solid ${qty <= 0 ? "#FFC9C9" : "#FDE68A"}`,
            padding: "0.2rem 0.6rem", borderRadius: "100px",
        }),
        categoryGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: "1rem", padding: "1.25rem",
        },
        categoryCard: {
            background: D.bg, border: `1.5px solid ${D.border}`,
            borderRadius: "12px", padding: "1.25rem",
            textAlign: "center", transition: "all 0.18s",
        },
        categoryName: { fontSize: "0.84rem", fontWeight: 700, color: D.sub, marginBottom: "0.4rem" },
        categoryCount: { fontSize: "1.6rem", fontWeight: 900, color: D.indigo, lineHeight: 1 },
        categorySub: { fontSize: "0.71rem", color: D.muted, marginTop: "0.35rem" },
        loadingContainer: {
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: "1rem",
            minHeight: "400px", color: D.muted, fontSize: "1rem",
        },
    };

    const statCards = [
        { label: "Total Customers",  value: stats.totalCustomers,                                icon: "👥" },
        { label: "Spare Parts",      value: stats.totalParts,                                    icon: "🔧" },
        { label: "Cart Items",       value: stats.totalCartItems,                                icon: "🛒" },
        { label: "Low Stock",        value: stats.lowStockCount,                                 icon: "⚠️" },
        { label: "Inventory Value",  value: `₹${Number(stats.inventoryValue).toLocaleString()}`, icon: "💰" },
        { label: "Categories",       value: stats.totalCategories,                               icon: "📂" },
    ];

    if (loading) {
        return (
            <Sidebar>
                <div style={styles.loadingContainer}>
                    <p>Loading dashboard...</p>
                </div>
            </Sidebar>
        );
    }

    return (
        <Sidebar>
            <style>{`
                .hide-scroll::-webkit-scrollbar { display: none; }
                .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
                
                .horizontal-scroll-container {
                    display: flex;
                    overflow-x: auto;
                    gap: 1.25rem;
                    padding: 1.25rem 1.5rem;
                }
                .scroll-card {
                    flex: 0 0 auto;
                    width: 220px;
                    background: ${D.surface};
                    border: 1.5px solid ${D.border};
                    border-radius: 14px;
                    padding: 1.25rem;
                    transition: all 0.2s;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.03);
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .scroll-card:hover {
                    border-color: ${D.indigoBorder};
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.06);
                }
            `}</style>

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        style={styles.statCard}
                        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = D.indigoBorder; }}
                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = D.border; }}
                    >
                        <div style={styles.statTop}>
                            <div style={styles.statIcon}>{stat.icon}</div>
                        </div>
                        <p style={styles.statValue}>{stat.value}</p>
                        <p style={styles.statLabel}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Customers & Recent Parts */}
            <div style={styles.sectionGrid}>

                {/* Recent Customers */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>Recent Customers</h3>
                        <Link to="/users" style={styles.viewAllLink}>View All →</Link>
                    </div>
                    <div className="horizontal-scroll-container hide-scroll">
                        {stats.recentCustomers.length === 0 ? (
                            <div style={{ width:"100%", padding: "2rem", textAlign: "center", color: "#7f8c8d" }}>
                                No customers found
                            </div>
                        ) : (
                            stats.recentCustomers.map((customer) => (
                                <div key={customer.id} className="scroll-card">
                                    <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                                        <div style={styles.listAvatar}>
                                            {customer.name ? customer.name.charAt(0).toUpperCase() : "?"}
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{...styles.listName, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{customer.name}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p style={{...styles.listSub, color:D.text, marginBottom:"0.2rem", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{customer.email}</p>
                                        <p style={{ ...styles.listSub, fontSize: "0.7rem" }}>
                                            Joined: {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Parts */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>🔧 Recent Parts</h3>
                        <Link to="/spareparts-admin" style={styles.viewAllLink}>View All →</Link>
                    </div>
                    <div className="horizontal-scroll-container hide-scroll">
                        {stats.recentParts.length === 0 ? (
                            <div style={{ width:"100%", padding: "2rem", textAlign: "center", color: "#7f8c8d" }}>
                                No spare parts found
                            </div>
                        ) : (
                            stats.recentParts.map((part) => (
                                <div key={part.part_id} className="scroll-card">
                                    <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                                        <div style={styles.listAvatar}>
                                            {part.part_name ? part.part_name.charAt(0).toUpperCase() : "P"}
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{...styles.listName, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{part.part_name}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p style={{...styles.listSub, color:D.text, marginBottom:"0.2rem", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                                            {part.brand} · {part.categories ? (
                                                part.categories.split(",")[0].trim().charAt(0).toUpperCase() + part.categories.split(",")[0].trim().slice(1).toLowerCase()
                                            ) : "Other"}
                                        </p>
                                    </div>
                                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:"auto", paddingTop:"0.25rem" }}>
                                        <p style={styles.listPrice}>₹{Number(part.price).toLocaleString()}</p>
                                        <span style={styles.listBadge(
                                            part.stock_quantity <= 0 ? "red" : part.stock_quantity <= 5 ? "orange" : "green"
                                        )}>
                                            Stock: {part.stock_quantity}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            {/* Low Stock Alerts */}
            {stats.lowStockParts.length > 0 && (
                <div style={styles.fullWidthSection}>
                    <div style={styles.alertCard}>
                        <div style={styles.alertHeader}>
                            <h3 style={styles.alertTitle}>Low Stock Alerts</h3>
                        </div>
                        <div style={styles.alertBody}>
                            {stats.lowStockParts.map((part) => (
                                <div key={part.part_id} style={styles.alertItem}>
                                    <div>
                                        <p style={styles.alertItemName}>{part.part_name}</p>
                                        <p style={styles.alertItemBrand}>{part.brand}</p>
                                    </div>
                                    <span style={styles.alertStock(part.stock_quantity)}>
                                        {part.stock_quantity <= 0 ? "Out of Stock" : `${part.stock_quantity} left`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Category Distribution */}
            {stats.categoryStats.length > 0 && (
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>📂 Category Distribution</h3>
                    </div>
                    <div style={styles.categoryGrid}>
                        {stats.categoryStats.map((cat, index) => (
                            <div
                                key={index}
                                style={styles.categoryCard}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "#3B82F6";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = D.border;
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                <p style={styles.categoryName}>{cat.categories || "Uncategorized"}</p>
                                <p style={styles.categoryCount}>{cat.count}</p>
                                <p style={styles.categorySub}>
                                    {cat.totalStock} units in stock
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </Sidebar>
    );
}

export default Dashboard;
