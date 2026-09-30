import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { FiCalendar, FiStar, FiShoppingBag, FiTrendingUp, FiArrowRight, FiClock } from "react-icons/fi";
import { format } from "date-fns";

const formatBookingDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + (dateStr.includes("T") ? "" : "T00:00:00"));
    if (isNaN(d.getTime())) return dateStr;
    return format(d, "EEE, d MMM yyyy");
  } catch {
    return dateStr;
  }
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings/my?limit=5");
      setBookings(data.bookings || []);
    } catch {} finally { setLoading(false); }
  };

  const upcoming = bookings.filter(b => ["pending", "confirmed"].includes(b.status));
  const completed = bookings.filter(b => b.status === "completed");

  const STATUS_COLORS = {
    pending: "warning", confirmed: "info", in_progress: "purple",
    completed: "success", cancelled: "danger", rejected: "danger"
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-page">
        <div className="container">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="page-title">Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
              <p className="text-muted">Here's an overview of your bookings</p>
            </div>
            <Link to="/services" className="btn btn-primary">
              Book a Service <FiArrowRight />
            </Link>
          </div>

          {/* Stats */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(99,102,241,0.1)", color: "var(--primary)" }}><FiShoppingBag /></div>
              <div>
                <div className="stat-card-val">{bookings.length}</div>
                <div className="stat-card-label">Total Bookings</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(14,165,233,0.1)", color: "var(--info)" }}><FiCalendar /></div>
              <div>
                <div className="stat-card-val">{upcoming.length}</div>
                <div className="stat-card-label">Upcoming</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(16,185,129,0.1)", color: "var(--success)" }}><FiTrendingUp /></div>
              <div>
                <div className="stat-card-val">{completed.length}</div>
                <div className="stat-card-label">Completed</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(245,158,11,0.1)", color: "var(--warning)" }}><FiStar /></div>
              <div>
                <div className="stat-card-val">{completed.filter(b => b.isReviewed).length}</div>
                <div className="stat-card-label">Reviews Given</div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="dashboard-grid">
            <div className="card" style={{ gridColumn: "1 / -1" }}>
              <div className="card-header">
                <h3 className="font-semibold text-lg">Recent Bookings</h3>
                <Link to="/customer/bookings" className="text-sm" style={{ color: "var(--primary)" }}>View all →</Link>
              </div>
              {loading ? (
                <div className="loading-page" style={{ minHeight: 200 }}><div className="spinner" /></div>
              ) : bookings.length === 0 ? (
                <div className="empty-state" style={{ padding: "40px 0" }}>
                  <div className="empty-icon">📋</div>
                  <h3>No bookings yet</h3>
                  <p className="text-muted">Start by booking a service!</p>
                  <Link to="/services" className="btn btn-primary" style={{ marginTop: 16 }}>Explore Services</Link>
                </div>
              ) : (
                <div className="bookings-list">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="booking-row">
                      <div className="booking-row-icon">
                        {booking.service?.category === "Salon" ? "✂️" : booking.service?.category === "Home Cleaning" ? "🧹" : "🛠️"}
                      </div>
                      <div className="booking-row-info">
                        <div className="font-semibold">{booking.service?.title}</div>
                        <div className="text-muted text-sm">
                          <FiClock size={11} /> {formatBookingDate(booking.slot?.date)} · {booking.slot?.startTime}
                        </div>
                      </div>
                      <div className="booking-row-vendor text-muted text-sm">
                        {booking.vendor?.name}
                      </div>
                      <div className="booking-row-price">₹{booking.totalAmount?.toLocaleString()}</div>
                      <span className={`badge badge-${STATUS_COLORS[booking.status] || "info"}`}>
                        {booking.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3 className="font-semibold" style={{ marginBottom: 16 }}>Quick Actions</h3>
            <div className="grid-3">
              {[
                { icon: "✂️", label: "Book Salon", category: "Salon" },
                { icon: "🧹", label: "Home Cleaning", category: "Home Cleaning" },
                { icon: "🔧", label: "Plumbing", category: "Plumbing" },
                { icon: "❄️", label: "AC Repair", category: "AC Repair" },
                { icon: "⚡", label: "Electrical", category: "Electrical" },
                { icon: "🐛", label: "Pest Control", category: "Pest Control" },
              ].map((qa) => (
                <Link key={qa.label} to={`/services?category=${encodeURIComponent(qa.category)}`} className="quick-action-card">
                  <span className="quick-action-icon">{qa.icon}</span>
                  <span className="text-sm font-semibold">{qa.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
