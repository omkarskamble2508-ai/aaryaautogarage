import { Navigate } from "react-router-dom";

// Guards ADMIN routes only.
// Checks sessionStorage.ADMIN_AUTH — set by AdminLogin at /admin
// Has NO knowledge of customer sessions — completely independent.
function AdminRoute({ children }) {
    const isAdmin = sessionStorage.getItem("ADMIN_AUTH") === "true";
    return isAdmin ? children : <Navigate to="/admin" replace />;
}

export default AdminRoute;
