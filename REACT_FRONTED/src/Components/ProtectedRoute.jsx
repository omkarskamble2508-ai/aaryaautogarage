import { Navigate } from "react-router-dom";
import FloatingChatbot from "./FloatingChatbot";

// Guards CUSTOMER routes only.
// Checks sessionStorage.ID — set by customer login at /login
// Has NO knowledge of admin sessions — completely independent.
function CustomerRoute({ children }) {
    // Both sessionStorage and localStorage are used in this app for customer ID, checking both
    const customerId = sessionStorage.getItem("ID") || localStorage.getItem("ID");
    
    return customerId ? (
        <>
            {children}
            <FloatingChatbot />
        </>
    ) : (
        <Navigate to="/login" replace />
    );
}

export default CustomerRoute;