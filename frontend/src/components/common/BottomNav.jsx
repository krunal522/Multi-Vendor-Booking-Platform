import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiHome, FiCompass, FiCalendar, FiUser } from "react-icons/fi";

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getProfileLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "vendor") return "/vendor/dashboard";
    return "/customer/dashboard";
  };

  const getBookingsLink = () => {
    if (!user) return "/login";
    if (user.role === "vendor") return "/vendor/bookings";
    return "/customer/bookings";
  };

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`bottom-nav-item ${isActive("/") ? "active" : ""}`}>
        <FiHome size={20} />
        <span>Home</span>
      </Link>
      <Link to="/services" className={`bottom-nav-item ${isActive("/services") ? "active" : ""}`}>
        <FiCompass size={20} />
        <span>Explore</span>
      </Link>
      <Link to={getBookingsLink()} className={`bottom-nav-item ${isActive("/customer/bookings") || isActive("/vendor/bookings") ? "active" : ""}`}>
        <FiCalendar size={20} />
        <span>Bookings</span>
      </Link>
      <Link to={getProfileLink()} className={`bottom-nav-item ${isActive("/customer/dashboard") || isActive("/vendor/dashboard") || isActive("/admin") || isActive("/login") ? "active" : ""}`}>
        <FiUser size={20} />
        <span>{user ? user.name?.split(" ")[0] : "Account"}</span>
      </Link>
    </nav>
  );
}
