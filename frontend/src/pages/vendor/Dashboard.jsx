import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FiTrendingUp, FiCalendar, FiDollarSign, FiShoppingBag, FiAlertCircle, FiArrowRight } from "react-icons/fi";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const STATUS_COLORS = {
  pending: "warning", confirmed: "info", in_progress: "purple",
  completed: "success", cancelled: "danger", rejected: "danger"
};

export default function VendorDashboard() {
  const { user } = useAuth();
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/vendor/dashboard");
      setDashData(data);
    } catch {} finally { setLoading(false); }
  };

  if (loading) return (
    <div className="page-wrapper">
      <Navbar />
      <div className="loading-page"><div className="spinner" /></div>
    </div>
  );

  const chartData = dashData?.revenueData?.map((d) => ({
    month: MONTH_NAMES[d._id.month - 1],
    revenue: d.revenue,
    bookings: d.count,
  })) || [];

  const { stats = {}, recentBookings = [] } = dashData || {};

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-page">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1 className="page-title">Vendor Dashboard</h1>
              <p className="text-muted">{user?.businessName || user?.name} — {user?.isApproved ? "✓ Approved" : "⏳ Pending Approval"}</p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Link to="/vendor/services" className="btn btn-outline btn-sm">My Services</Link>
              <Link to="/vendor/bookings" className="btn btn-primary btn-sm">Manage Bookings <FiArrowRight /></Link>
            </div>
          </div>

          {!user?.isApproved && (
            <div className="alert-banner">
              <FiAlertCircle /> Your account is pending admin approval. Services won't be visible to customers until approved.
            </div>
          )}

          {/* Stats */}
          <div className="dashboard-stats">
            <div className="stat-card stat-card-primary">
              <div className="stat-card-icon" style={{ background: "rgba(99,102,241,0.2)", color: "var(--primary)" }}><FiDollarSign /></div>
              <div>
                <div className="stat-card-val">₹{stats.totalRevenue?.toLocaleString() || 0}</div>
                <div className="stat-card-label">Total Earnings</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(14,165,233,0.1)", color: "var(--info)" }}><FiShoppingBag /></div>
              <div>
                <div className="stat-card-val">{stats.totalBookings || 0}</div>
                <div className="stat-card-label">Total Bookings</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(245,158,11,0.1)", color: "var(--warning)" }}><FiCalendar /></div>
              <div>
                <div className="stat-card-val">{stats.pendingBookings || 0}</div>
                <div className="stat-card-label">Pending</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(16,185,129,0.1)", color: "var(--success)" }}><FiTrendingUp /></div>
              <div>
                <div className="stat-card-val">{stats.completedBookings || 0}</div>
                <div className="stat-card-label">Completed</div>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <h3 className="font-semibold text-lg">Revenue (Last 6 Months)</h3>
            </div>
            {chartData.length === 0 ? (
              <div className="empty-state" style={{ padding: "32px 0" }}>
                <p className="text-muted">No revenue data yet. Start accepting bookings!</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                    formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#revenueGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold text-lg">Recent Bookings</h3>
              <Link to="/vendor/bookings" className="text-sm" style={{ color: "var(--primary)" }}>View all →</Link>
            </div>
            {recentBookings.length === 0 ? (
              <div className="empty-state" style={{ padding: "32px 0" }}>
                <div className="empty-icon">📋</div>
                <p className="text-muted">No bookings yet</p>
              </div>
            ) : (
              <div className="bookings-list">
                {recentBookings.map((b) => (
                  <div key={b._id} className="booking-row">
                    <div className="avatar-sm">{b.customer?.name?.[0]}</div>
                    <div className="booking-row-info">
                      <div className="font-semibold">{b.customer?.name}</div>
                      <div className="text-muted text-sm">{b.service?.title}</div>
                    </div>
                    <div className="text-muted text-sm">{b.slot?.date} · {b.slot?.startTime}</div>
                    <div className="font-semibold">₹{b.totalAmount?.toLocaleString()}</div>
                    <span className={`badge badge-${STATUS_COLORS[b.status] || "info"}`}>{b.status.replace("_", " ")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
