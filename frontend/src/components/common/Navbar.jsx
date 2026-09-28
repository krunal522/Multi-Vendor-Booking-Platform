import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../hooks/useSocket";
import api from "../../utils/api";
import { FiBell, FiMenu, FiX, FiChevronDown, FiLogOut, FiUser, FiSettings, FiGrid, FiUsers, FiCalendar, FiCompass } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on("notification", (notif) => {
        setNotifications((prev) => [notif, ...prev.slice(0, 19)]);
        setUnread((prev) => prev + 1);
      });
    }
    return () => { if (socket) socket.off("notification"); };
  }, [socket]);

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data.notifications);
      setUnread(data.notifications.filter((n) => !n.isRead).length);
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setUnread(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "vendor") return "/vendor/dashboard";
    return "/customer/dashboard";
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Logo size="md" />

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive("/") ? "nav-link-active" : ""}`}>Home</Link>
          <Link to="/services" className={`nav-link ${isActive("/services") ? "nav-link-active" : ""}`}>Services</Link>
          {!user && (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
          {user && (
            <div className="navbar-user-actions">
              {/* Notifications */}
              <div className="notif-wrapper" ref={notifRef}>
                <button className="icon-btn" onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markAllRead(); }}>
                  <FiBell size={20} />
                  {unread > 0 && <span className="notif-badge">{unread > 9 ? "9+" : unread}</span>}
                </button>
                {notifOpen && (
                  <div className="notif-dropdown">
                    <div className="notif-header">
                      <span className="font-semibold">Notifications</span>
                      {unread > 0 && <button onClick={markAllRead} className="text-sm" style={{ color: "var(--primary)", background: "none", border: "none", cursor: "pointer" }}>Mark all read</button>}
                    </div>
                    {notifications.length === 0 ? (
                      <div className="notif-empty">No notifications yet</div>
                    ) : (
                      notifications.slice(0, 8).map((n) => (
                        <div key={n._id} className={`notif-item ${!n.isRead ? "notif-unread" : ""}`}>
                          <div className="notif-title">
                            {n.title?.replace(/in_progress/gi, "In Progress").replace(/_/g, " ")}
                          </div>
                          <div className="notif-msg text-muted text-sm">
                            {n.message?.replace(/in_progress/gi, "In Progress").replace(/_/g, " ")}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="profile-wrapper" ref={profileRef}>
                <button className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                  <div className="avatar-sm">
                    {user.avatar ? <img src={user.avatar} alt={user.name} /> : <span>{user.name?.[0]?.toUpperCase()}</span>}
                  </div>
                  <span className="profile-name">{user.name?.split(" ")[0]}</span>
                  <FiChevronDown size={14} />
                </button>
                {profileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-header">
                      <div className="font-semibold" style={{ fontSize: 15, color: "#fff" }}>{user.name}</div>
                      <div className="text-sm text-muted" style={{ fontSize: 12, marginTop: 2 }}>{user.email}</div>
                      <span className={`badge badge-${user.role === "admin" ? "danger" : user.role === "vendor" ? "warning" : "info"}`} style={{ marginTop: 8, textTransform: "capitalize", fontSize: 11, padding: "3px 8px" }}>
                        ● {user.role}
                      </span>
                    </div>

                    <div className="profile-menu">
                      <Link to={getDashboardLink()} className="profile-item" onClick={() => setProfileOpen(false)}>
                        <MdDashboard size={16} /> Dashboard
                      </Link>

                      {user.role === "admin" && (
                        <>
                          <Link to="/admin/services" className="profile-item" onClick={() => setProfileOpen(false)}>
                            <FiGrid size={16} /> Manage Services
                          </Link>
                          <Link to="/admin/users" className="profile-item" onClick={() => setProfileOpen(false)}>
                            <FiUsers size={16} /> Manage Users
                          </Link>
                        </>
                      )}

                      {user.role === "vendor" && (
                        <>
                          <Link to="/vendor/services" className="profile-item" onClick={() => setProfileOpen(false)}>
                            <FiGrid size={16} /> My Services
                          </Link>
                          <Link to="/vendor/bookings" className="profile-item" onClick={() => setProfileOpen(false)}>
                            <FiCalendar size={16} /> Bookings
                          </Link>
                        </>
                      )}

                      {user.role === "customer" && (
                        <>
                          <Link to="/customer/bookings" className="profile-item" onClick={() => setProfileOpen(false)}>
                            <FiCalendar size={16} /> My Bookings
                          </Link>
                          <Link to="/services" className="profile-item" onClick={() => setProfileOpen(false)}>
                            <FiCompass size={16} /> Browse Services
                          </Link>
                        </>
                      )}

                      <div className="dropdown-divider" />

                      <button className="profile-item profile-logout" onClick={() => { setProfileOpen(false); logout(); }}>
                        <FiLogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Header Controls */}
        <div style={{ display: "none" }} className="mobile-header-actions">
          {user && (
            <button 
              className="icon-btn" 
              onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markAllRead(); }}
              style={{ marginRight: 8 }}
              aria-label="Notifications"
            >
              <FiBell size={19} />
              {unread > 0 && <span className="notif-badge">{unread > 9 ? "9+" : unread}</span>}
            </button>
          )}
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="mobile-menu">
          {user ? (
            <div className="mobile-user-card">
              <div className="avatar-sm">
                {user.avatar ? <img src={user.avatar} alt={user.name} /> : <span>{user.name?.[0]?.toUpperCase()}</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.name}
                </div>
                <div className="text-muted text-xs" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.email}
                </div>
                <span 
                  className={`badge badge-${user.role === "admin" ? "danger" : user.role === "vendor" ? "warning" : "info"}`} 
                  style={{ marginTop: 4, textTransform: "capitalize", fontSize: 10, padding: "2px 7px" }}
                >
                  ● {user.role}
                </span>
              </div>
            </div>
          ) : null}

          <Link to="/" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
            <FiCompass size={18} /> Home
          </Link>
          <Link to="/services" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
            <FiGrid size={18} /> Services
          </Link>

          {user ? (
            <>
              <Link to={getDashboardLink()} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                <MdDashboard size={18} /> Dashboard
              </Link>
              {user.role === "customer" && (
                <Link to="/customer/bookings" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                  <FiCalendar size={18} /> My Bookings
                </Link>
              )}
              {user.role === "vendor" && (
                <>
                  <Link to="/vendor/services" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                    <FiGrid size={18} /> My Services
                  </Link>
                  <Link to="/vendor/bookings" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                    <FiCalendar size={18} /> Customer Bookings
                  </Link>
                </>
              )}
              {user.role === "admin" && (
                <>
                  <Link to="/admin/services" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                    <FiGrid size={18} /> Manage Services
                  </Link>
                  <Link to="/admin/users" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                    <FiUsers size={18} /> Manage Users
                  </Link>
                </>
              )}
              <div className="dropdown-divider" style={{ margin: "10px 0" }} />
              <button 
                className="mobile-nav-link" 
                style={{ background: "rgba(239, 68, 68, 0.08)", border: "none", width: "100%", cursor: "pointer", color: "#f87171" }} 
                onClick={() => { setMenuOpen(false); logout(); }}
              >
                <FiLogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ width: "100%" }} onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ width: "100%" }} onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
