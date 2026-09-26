import React, { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { FiClock, FiPhone, FiMail, FiCheck, FiX } from "react-icons/fi";

const STATUS_COLORS = {
  pending: "warning", confirmed: "info", in_progress: "purple",
  completed: "success", cancelled: "danger", rejected: "danger"
};

const VENDOR_ACTIONS = {
  pending: ["confirmed", "rejected"],
  confirmed: ["in_progress"],
  in_progress: ["completed"],
};

export default function VendorBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [updating, setUpdating] = useState(null);
  const [noteModal, setNoteModal] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => { fetchBookings(); }, [filterStatus, filterDate]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (filterDate) params.set("date", filterDate);
      const { data } = await api.get(`/vendor/bookings?${params}`);
      setBookings(data.bookings || []);
    } catch {} finally { setLoading(false); }
  };

  const updateStatus = async (bookingId, status, noteText = "") => {
    setUpdating(bookingId);
    try {
      await api.put(`/bookings/${bookingId}/status`, { status, note: noteText });
      toast.success(`Booking ${status}!`);
      setNoteModal(null);
      fetchBookings();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); } finally { setUpdating(null); }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-page">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1 className="page-title">Manage Bookings</h1>
              <p className="text-muted">View and manage all incoming bookings</p>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <input type="date" className="form-input" style={{ width: "auto" }} value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)} />
            </div>
          </div>

          {/* Status Tabs */}
          <div className="status-filter-tabs">
            {["all", "pending", "confirmed", "in_progress", "completed", "cancelled", "rejected"].map((s) => (
              <button key={s} className={`status-filter-tab ${filterStatus === s ? "status-tab-active" : ""}`}
                onClick={() => setFilterStatus(s)}>
                {s.replace("_", " ")}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-page"><div className="spinner" /></div>
          ) : bookings.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">📋</div>
              <h3>No bookings found</h3>
            </div>
          ) : (
            <div className="bookings-cards">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card card">
                  <div className="booking-card-header">
                    <div className="booking-card-service">
                      <div className="avatar-sm" style={{ background: "var(--primary)", color: "white" }}>
                        {booking.customer?.name?.[0]}
                      </div>
                      <div>
                        <div className="font-semibold">{booking.customer?.name}</div>
                        <div className="text-muted text-sm">{booking.service?.title}</div>
                      </div>
                    </div>
                    <div className="booking-card-meta">
                      <span className={`badge badge-${STATUS_COLORS[booking.status] || "info"}`}>
                        {booking.status.replace("_", " ")}
                      </span>
                      <div className="font-semibold">₹{booking.totalAmount?.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="booking-card-details" style={{ display: "block" }}>
                    <div className="booking-detail-grid">
                      <div className="detail-meta-item">
                        <FiClock size={13} color="var(--text-muted)" />
                        <span className="text-sm">{booking.slot?.date} · {booking.slot?.startTime} — {booking.slot?.endTime}</span>
                      </div>
                      {booking.customer?.phone && (
                        <div className="detail-meta-item">
                          <FiPhone size={13} color="var(--text-muted)" />
                          <span className="text-sm">{booking.customer.phone}</span>
                        </div>
                      )}
                      <div className="detail-meta-item">
                        <FiMail size={13} color="var(--text-muted)" />
                        <span className="text-sm">{booking.customer?.email}</span>
                      </div>
                    </div>

                    {booking.address?.street && (
                      <div className="text-sm text-muted" style={{ marginTop: 8 }}>
                        📍 {booking.address.street}, {booking.address.city} {booking.address.pincode}
                      </div>
                    )}
                    {booking.customerNotes && (
                      <div className="text-sm text-muted" style={{ marginTop: 4 }}>
                        📝 {booking.customerNotes}
                      </div>
                    )}

                    {/* Action Buttons */}
                    {VENDOR_ACTIONS[booking.status] && (
                      <div className="booking-actions" style={{ marginTop: 16 }}>
                        {VENDOR_ACTIONS[booking.status].map((action) => (
                          <button key={action}
                            className={`btn btn-sm ${action === "rejected" || action === "cancelled" ? "btn-outline" : "btn-primary"}`}
                            style={action === "rejected" ? { color: "var(--danger)", borderColor: "var(--danger)" } : {}}
                            disabled={updating === booking._id}
                            onClick={() => {
                              if (action === "rejected") {
                                setNoteModal({ id: booking._id, action });
                              } else {
                                updateStatus(booking._id, action);
                              }
                            }}>
                            {updating === booking._id ? <span className="spinner spinner-sm" /> : (
                              action === "rejected" ? <><FiX /> Reject</> :
                              action === "confirmed" ? <><FiCheck /> Confirm</> :
                              action === "in_progress" ? "Start Service" : "Complete"
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Note Modal for rejection */}
      {noteModal && (
        <div className="modal-overlay" onClick={() => setNoteModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold" style={{ marginBottom: 16 }}>Reason for Rejection</h3>
            <textarea className="form-textarea" rows={3} placeholder="Provide a reason..." value={note}
              onChange={(e) => setNote(e.target.value)} />
            <div className="modal-actions" style={{ marginTop: 16 }}>
              <button className="btn btn-outline" onClick={() => setNoteModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: "var(--danger)", border: "none" }}
                onClick={() => updateStatus(noteModal.id, noteModal.action, note)}>
                Reject Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
