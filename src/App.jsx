// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// ---- Your existing site components ----
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Contact from "./pages/Contact";

// ---- Order flow (4 pages) ----
import { OrderProvider, useOrder } from "./context/OrderContext";
import { OrderProgressProvider } from "./context/OrderProgressContext";
import { useLeaveConfirm } from "./hooks/useLeaveConfirm";
import InfoPage from "./pages/InfoPage";
import ProductsPage from "./pages/ProductsPage";
import ReviewPage from "./pages/ReviewPage";
import PaymentPage from "./pages/PaymentPage";
import RequireStep from "./routes/RequireStep";

// Layout for order pages only: wires confirm-on-leave using order state
function OrderLayout() {
    const { state } = useOrder();
    useLeaveConfirm(state.dirty);
    return <Outlet />;
}

// Optional: simple confirm page + 404 stubs
function ThankYou() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-2xl">
                ✓
            </div>
            <h1 className="mt-4 text-2xl font-semibold">Order placed</h1>
            <p className="mt-2 text-slate-600">
                We’ve received your order and sent a confirmation to your email/phone.
            </p>
            <div className="mt-6 flex justify-center gap-3">
                <a
                    href="/"
                    className="px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900"
                >
                    Home
                </a>
                <a
                    href="/contact"
                    className="px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-900"
                >
                    Contact
                </a>
            </div>
        </div>
    );
}

function NotFound() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-semibold">Not Found</h1>
            <p className="text-slate-600 mt-2">This page does not exist.</p>
        </div>
    );
}

export default function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-20">
                <Routes>
                    {/* Existing site routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductDetails />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Order flow under /order/* with its own providers + layout */}
                    <Route
                        path="/order"
                        element={
                            <OrderProvider>
                                <OrderProgressProvider>
                                    <OrderLayout />
                                </OrderProgressProvider>
                            </OrderProvider>
                        }
                    >
                        <Route index element={<Navigate to="info" replace />} />

                        <Route
                            path="info"
                            element={
                                <RequireStep requiredStepId={1}>
                                    <InfoPage />
                                </RequireStep>
                            }
                        />
                        <Route
                            path="products"
                            element={
                                <RequireStep requiredStepId={2}>
                                    <ProductsPage />
                                </RequireStep>
                            }
                        />
                        <Route
                            path="review"
                            element={
                                <RequireStep requiredStepId={3}>
                                    <ReviewPage />
                                </RequireStep>
                            }
                        />
                        <Route
                            path="payment"
                            element={
                                <RequireStep requiredStepId={3}>
                                    <PaymentPage />
                                </RequireStep>
                            }
                        />

                        <Route path="confirm" element={<ThankYou />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}
