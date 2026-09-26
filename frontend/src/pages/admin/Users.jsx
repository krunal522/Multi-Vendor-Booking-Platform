import React, { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { FiSearch, FiCheck, FiX, FiUser } from "react-icons/fi";
import { MdVerified } from "react-icons/md";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchUsers(); }, [filterRole, search, page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (filterRole !== "all") params.set("role", filterRole);
      if (search) params.set("search", search);
      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch {} finally { setLoading(false); }
  };

  const approveVendor = async (userId, approve) => {
    try {
      await api.put(`/admin/vendors/${userId}/approve`, { approve });
      toast.success(`Vendor ${approve ? "approved" : "rejected"}!`);
      fetchUsers();
    } catch { toast.error("Failed"); }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle`);
      toast.success("User status updated");
      fetchUsers();
    } catch {}
  };

  const ROLE_COLORS = { customer: "info", vendor: "warning", admin: "danger" };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-page">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1 className="page-title">User Management</h1>
              <p className="text-muted">{total} total users</p>
            </div>
          </div>

          {/* Filters */}
          <div className="admin-filters">
            <div className="input-with-icon" style={{ flex: 1 }}>
              <FiSearch className="input-icon" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input type="text" className="form-input" style={{ paddingLeft: 42 }} placeholder="Search users..."
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="status-filter-tabs" style={{ marginBottom: 0 }}>
              {["all", "customer", "vendor", "admin"].map((r) => (
                <button key={r} className={`status-filter-tab ${filterRole === r ? "status-tab-active" : ""}`}
                  onClick={() => { setFilterRole(r); setPage(1); }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-page"><div className="spinner" /></div>
          ) : (
            <div className="card" style={{ overflow: "hidden" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Business</th>
                    <th>Status</th>
                    <th>Vendor Approval</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="avatar-sm">{user.name?.[0]}</div>
                          <div>
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-muted text-sm">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className={`badge badge-${ROLE_COLORS[user.role]}`}>{user.role}</span></td>
                      <td className="text-muted text-sm">{user.businessName || "—"}</td>
                      <td>
                        <span className={`badge ${user.isActive ? "badge-success" : "badge-danger"}`}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        {user.role === "vendor" ? (
                          user.isApproved ? (
                            <span className="badge badge-success"><MdVerified /> Approved</span>
                          ) : (
                            <div style={{ display: "flex", gap: 6 }}>
                              <button className="btn btn-sm btn-primary" onClick={() => approveVendor(user._id, true)}>
                                <FiCheck /> Approve
                              </button>
                              <button className="btn btn-sm btn-outline" style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
                                onClick={() => approveVendor(user._id, false)}>
                                <FiX />
                              </button>
                            </div>
                          )
                        ) : "—"}
                      </td>
                      <td className="text-muted text-sm">
                        {new Date(user.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td>
                        {user.role !== "admin" && (
                          <button className={`btn btn-sm btn-outline ${user.isActive ? "" : ""}`}
                            style={{ color: user.isActive ? "var(--danger)" : "var(--success)", borderColor: user.isActive ? "var(--danger)" : "var(--success)" }}
                            onClick={() => toggleUserStatus(user._id)}>
                            {user.isActive ? "Deactivate" : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="empty-state" style={{ padding: "32px 0" }}>
                  <p className="text-muted">No users found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
