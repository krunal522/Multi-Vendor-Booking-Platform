import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import api from "../../utils/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { FiUsers, FiShoppingBag, FiDollarSign, FiAlertCircle, FiTrendingUp, FiStar } from "react-icons/fi";
import { MdVerified } from "react-icons/md";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PIE_COLORS = ["#6366f1","#0ea5e9","#10b981","#f59e0b","#ef4444"];

export default function AdminDashboard() {
  const [dash, setDash] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDash(); }, []);

  const fetchDash = async () => {
    try {
      const { data } = await api.get("/admin/dashboard");
      setDash(data);
    } catch {} finally { setLoading(false); }
  };

  if (loading) return (
    <div className="page-wrapper"><Navbar />
      <div className="loading-page"><div className="spinner" /></div>
    </div>
  );

  const { stats = {}, monthlyBookings = [], topVendors = [] } = dash || {};

  const chartData = monthlyBookings.map((d) => ({
    month: MONTH_NAMES[d._id.month - 1],
    bookings: d.count,
    revenue: d.revenue,
  }));

  const pieData = [
    { name: "Customers", value: stats.totalUsers || 0 },
    { name: "Vendors", value: stats.totalVendors || 0 },
  ];

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-page">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1 className="page-title">Admin Dashboard</h1>
              <p className="text-muted">Platform overview and analytics</p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Link to="/admin/users" className="btn btn-outline btn-sm">Manage Users</Link>
              <Link to="/admin/services" className="btn btn-primary btn-sm">Manage Services</Link>
            </div>
          </div>

          {/* Pending Approvals Alert */}
          {(stats.pendingVendors > 0 || stats.pendingServices > 0) && (
            <div className="alert-banner" style={{ marginBottom: 24 }}>
              <FiAlertCircle />
              {stats.pendingVendors > 0 && <span><strong>{stats.pendingVendors}</strong> vendor{stats.pendingVendors !== 1 ? "s" : ""} awaiting approval</span>}
              {stats.pendingVendors > 0 && stats.pendingServices > 0 && " · "}
              {stats.pendingServices > 0 && <span><strong>{stats.pendingServices}</strong> service{stats.pendingServices !== 1 ? "s" : ""} awaiting approval</span>}
              <Link to="/admin/services" style={{ color: "var(--primary)", marginLeft: 8 }}>Review now →</Link>
            </div>
          )}

          {/* Stats Grid */}
          <div className="admin-stats-grid">
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(99,102,241,0.1)", color: "var(--primary)" }}><FiUsers /></div>
              <div>
                <div className="stat-card-val">{stats.totalUsers?.toLocaleString() || 0}</div>
                <div className="stat-card-label">Total Customers</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(14,165,233,0.1)", color: "var(--info)" }}><MdVerified /></div>
              <div>
                <div className="stat-card-val">{stats.totalVendors?.toLocaleString() || 0}</div>
                <div className="stat-card-label">Total Vendors</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(16,185,129,0.1)", color: "var(--success)" }}><FiShoppingBag /></div>
              <div>
                <div className="stat-card-val">{stats.totalBookings?.toLocaleString() || 0}</div>
                <div className="stat-card-label">Total Bookings</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(245,158,11,0.1)", color: "var(--warning)" }}><FiDollarSign /></div>
              <div>
                <div className="stat-card-val">₹{(stats.totalRevenue || 0).toLocaleString()}</div>
                <div className="stat-card-label">Total Revenue</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(99,102,241,0.1)", color: "var(--primary)" }}><FiTrendingUp /></div>
              <div>
                <div className="stat-card-val">₹{(stats.platformRevenue || 0).toLocaleString()}</div>
                <div className="stat-card-label">Platform Revenue (10%)</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)" }}><FiAlertCircle /></div>
              <div>
                <div className="stat-card-val">{(stats.pendingVendors || 0) + (stats.pendingServices || 0)}</div>
                <div className="stat-card-label">Pending Approvals</div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="charts-row">
            {/* Monthly Bookings Chart */}
            <div className="card chart-card">
              <h3 className="font-semibold text-lg" style={{ marginBottom: 20 }}>Monthly Bookings & Revenue</h3>
              {chartData.length === 0 ? (
                <div className="empty-state" style={{ padding: 32 }}><p className="text-muted">No data yet</p></div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                    <Bar dataKey="bookings" fill="#6366f1" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* User Distribution */}
            <div className="card chart-card" style={{ maxWidth: 300 }}>
              <h3 className="font-semibold text-lg" style={{ marginBottom: 20 }}>User Distribution</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Vendors */}
          {topVendors.length > 0 && (
            <div className="card" style={{ marginTop: 24 }}>
              <h3 className="font-semibold text-lg" style={{ marginBottom: 20 }}>Top Performing Vendors</h3>
              <div className="top-vendors-list">
                {topVendors.map((v, i) => (
                  <div key={v._id} className="top-vendor-row">
                    <div className="top-vendor-rank">#{i + 1}</div>
                    <div className="avatar-sm">{v.vendor?.name?.[0]}</div>
                    <div className="booking-row-info">
                      <div className="font-semibold">{v.vendor?.businessName || v.vendor?.name}</div>
                    </div>
                    <div className="text-sm text-muted">{v.totalBookings} bookings</div>
                    <div className="font-semibold">₹{v.revenue?.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
