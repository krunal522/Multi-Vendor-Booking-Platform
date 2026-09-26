import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const Home            = lazy(() => import("./pages/Home"));
const Login           = lazy(() => import("./pages/Login"));
const Register        = lazy(() => import("./pages/Register"));
const Services        = lazy(() => import("./pages/Services"));
const ServiceDetail   = lazy(() => import("./pages/ServiceDetail"));
const PrivacyPolicy   = lazy(() => import("./pages/PrivacyPolicy"));

// Customer
const CustomerDashboard = lazy(() => import("./pages/customer/Dashboard"));
const MyBookings        = lazy(() => import("./pages/customer/MyBookings"));

// Vendor
const VendorDashboard = lazy(() => import("./pages/vendor/Dashboard"));
const VendorServices  = lazy(() => import("./pages/vendor/Services"));
const VendorBookings  = lazy(() => import("./pages/vendor/Bookings"));

// Admin
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminUsers     = lazy(() => import("./pages/admin/Users"));
const AdminServices  = lazy(() => import("./pages/admin/Services"));

const Loader = () => (
  <div className="loading-page">
    <div className="spinner"></div>
    <p className="text-muted">Loading...</p>
  </div>
);

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public */}
          <Route path="/"               element={<Home />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/register"       element={<Register />} />
          <Route path="/services"       element={<Services />} />
          <Route path="/services/:id"   element={<ServiceDetail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/privacy"        element={<PrivacyPolicy />} />

          {/* Customer */}
          <Route path="/customer/dashboard" element={<PrivateRoute roles={["customer"]}><CustomerDashboard /></PrivateRoute>} />
          <Route path="/customer/bookings"  element={<PrivateRoute roles={["customer"]}><MyBookings /></PrivateRoute>} />

          {/* Vendor */}
          <Route path="/vendor/dashboard" element={<PrivateRoute roles={["vendor"]}><VendorDashboard /></PrivateRoute>} />
          <Route path="/vendor/services"  element={<PrivateRoute roles={["vendor"]}><VendorServices /></PrivateRoute>} />
          <Route path="/vendor/bookings"  element={<PrivateRoute roles={["vendor"]}><VendorBookings /></PrivateRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<PrivateRoute roles={["admin"]}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/users"     element={<PrivateRoute roles={["admin"]}><AdminUsers /></PrivateRoute>} />
          <Route path="/admin/services"  element={<PrivateRoute roles={["admin"]}><AdminServices /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
