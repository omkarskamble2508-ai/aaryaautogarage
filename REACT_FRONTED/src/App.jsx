import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FloatingChatbot from "./Components/FloatingChatbot";
import LoadingScreen   from "./Components/LoadingScreen";
import { ToastContainer } from "./Components/Toast";

/* ── Customer pages ── */
import Login           from "./Pages/Login";
import Register        from "./Pages/register";
import CustomerHome    from "./Pages/CustomerHome";
import ViewSpareParts  from "./Pages/ViewSpareParts";
import Checkout        from "./Pages/Checkout";
import ProductDetail   from "./Pages/ProductDetail";
import MyOrders        from "./Pages/MyOrders";

import AboutUs       from "./Pages/AboutUs";
import ContactUs     from "./Pages/ContactUs";

import AdminLogin   from "./Pages/AdminLogin";
import Dashboard    from "./Pages/Dashboard";
import UserList     from "./Pages/UserList";
import AddUser      from "./Pages/AddUser";
import EditUser     from "./Pages/EditUser";
import AddProduct   from "./Pages/AddProduct";
import ProductList  from "./Pages/ProductList";
import Editproduct  from "./Pages/editproduct";
import ChatBot      from "./Pages/chatbot";
import AdminSparePartsView from "./Pages/AdminSparePartsView";
import AdminOrders  from "./Pages/AdminOrders";

/* ── Route guards ── */
import CustomerRoute from "./Components/ProtectedRoute";  // checks sessionStorage.ID
import AdminRoute    from "./Components/AdminRoute";       // checks sessionStorage.ADMIN_AUTH

function App() {
    const [appReady, setAppReady] = useState(false);

    return (
        <>
            {/* ── Animated loading screen (shows on first load) ── */}
            {!appReady && <LoadingScreen onDone={() => setAppReady(true)} />}

            {/* ── Global toast notifications (replaces browser alerts) ── */}
            <ToastContainer />

            <BrowserRouter>
                {/* ── Global floating chatbot — visible on every page ── */}
                <FloatingChatbot />
                <Routes>

                    {/* ════════════════════════════════════
                        CUSTOMER SIDE
                        Public:    /login, /register
                        Protected: /home, /spareparts, /about, /contact
                    ════════════════════════════════════ */}
                    <Route path="/"          element={<CustomerHome />} />
                    <Route path="/login"     element={<Login />} />
                    <Route path="/register"  element={<Register />} />

                    <Route path="/home"
                        element={<CustomerHome />}
                    />
                    <Route path="/spareparts"
                        element={<ViewSpareParts />}
                    />
                    <Route path="/checkout"
                        element={<CustomerRoute><Checkout /></CustomerRoute>}
                    />
                    <Route path="/product/:id"
                        element={<ProductDetail />}
                    />
                    <Route path="/my-orders"
                        element={<CustomerRoute><MyOrders /></CustomerRoute>}
                    />
                    <Route path="/about"
                        element={<AboutUs />}
                    />
                    <Route path="/contact"
                        element={<ContactUs />}
                    />

                    {/* ════════════════════════════════════
                        ADMIN SIDE
                        Public:    /admin
                        Protected: /dashboard and all mgmt routes
                        ↳ AdminRoute checks ADMIN_AUTH only,
                          completely separate from customer auth
                    ════════════════════════════════════ */}
                    <Route path="/admin" element={<AdminLogin />} />

                    <Route path="/dashboard"
                        element={<AdminRoute><Dashboard /></AdminRoute>}
                    />
                    <Route path="/users"
                        element={<AdminRoute><UserList /></AdminRoute>}
                    />
                    <Route path="/add"
                        element={<AdminRoute><AddUser /></AdminRoute>}
                    />
                    <Route path="/edit/:id"
                        element={<AdminRoute><EditUser /></AdminRoute>}
                    />
                    <Route path="/productlist"
                        element={<AdminRoute><ProductList /></AdminRoute>}
                    />
                    <Route path="/addproduct"
                        element={<AdminRoute><AddProduct /></AdminRoute>}
                    />
                    <Route path="/editp/:pid"
                        element={<AdminRoute><Editproduct /></AdminRoute>}
                    />
                    <Route path="/chatbot"
                        element={<AdminRoute><ChatBot /></AdminRoute>}
                    />
                    <Route path="/spareparts-admin"
                        element={<AdminRoute><AdminSparePartsView /></AdminRoute>}
                    />
                    <Route path="/admin-orders"
                        element={<AdminRoute><AdminOrders /></AdminRoute>}
                    />

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />

                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;