import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/common/Navbar";
import BookingStepper from "../../components/common/BookingStepper";
import { useSocket } from "../../hooks/useSocket";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { FiClock, FiPhone, FiMail, FiCheck, FiX, FiCheckCircle } from "react-icons/fi";

const STATUS_COLORS = {
  pending: "warning",
  confirmed: "info",
  in_progress: "purple",
  completed: "success",
  cancelled: "danger",
  rejected: "danger",
};

const VENDOR_ACTIONS = {
  pending: ["confirmed", "rejected"],
  confirmed: ["in_progress"],
  in_progress: ["completed"],
};

const formatStatusLabel = (s) => {
  if (!s) return "";
  if (s.toLowerCase() === "in_progress") return "In Progress";
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
};

export default function VendorBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [updating, setUpdating] = useState(null);
  const [noteModal, setNoteModal] = useState(null);
  const [note, setNote] = useState("");

  const socket = useSocket();

  const fetchBookings = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (filterDate) params.set("date", filterDate);
      const { data } = await api.get(`/vendor/bookings?${params.toString()}`);
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Error fetching vendor bookings:", err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, [filterStatus, filterDate]);

  useEffect(() => {
    fetchBookings(true);
  }, [fetchBookings]);

  // Real-time Socket.io listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewBooking = (newBooking) => {
      toast.success("🔔 New booking request received!", { duration: 5000 });
      fetchBookings(false);
    };

    const handleBookingUpdate = (payload) => {
      const { bookingId, status, booking } = payload || {};
      if (!bookingId) return;

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: status || b.status, ...(booking || {}) } : b))
      );

      fetchBookings(false);
    };

    socket.on("booking_created", handleNewBooking);
    socket.on("new_booking_created", handleNewBooking);
    socket.on("booking_updated", handleBookingUpdate);
    socket.on("booking_status_changed", handleBookingUpdate);

    return () => {
      socket.off("booking_created", handleNewBooking);
      socket.off("new_booking_created", handleNewBooking);
      socket.off("booking_updated", handleBookingUpdate);
      socket.off("booking_status_changed", handleBookingUpdate);
    };
  }, [socket, fetchBookings]);

  // Tab focus & 15-second background sync fallback
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchBookings(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    const interval = setInterval(() => {
      fetchBookings(false);
    }, 15000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(interval);
    };
  }, [fetchBookings]);

  const updateStatus = async (bookingId, status, noteText = "") => {
    setUpdating(bookingId);
    // Optimistic UI update
    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
    );

    try {
      await api.put(`/bookings/${bookingId}/status`, { status, note: noteText });
      toast.success(
        status === "confirmed"
          ? "Booking Confirmed! ✅"
          : status === "in_progress"
          ? "Service started! 🛠️"
          : status === "completed"
          ? "Service marked as Completed! 🎉"
          : `Booking ${status}`
      );
      setNoteModal(null);
      fetchBookings(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
      fetchBookings(false);
    } finally {
      setUpdating(null);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return null;
    if (typeof addr === "string") return addr;
    const parts = [addr.street, addr.city, addr.pincode].filter(Boolean);
    return parts.length ? parts.join(", ") : null;
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-page">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1 className="page-title">Manage Bookings</h1>
              <p className="text-muted">Live dashboard to monitor and update customer bookings</p>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <input
                type="date"
                className="form-input"
                style={{ width: "auto" }}
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
              {filterDate && (
                <button className="btn btn-ghost btn-sm" onClick={() => setFilterDate("")}>
                  Clear Date
                </button>
              )}
            </div>
          </div>

          {/* Status Tabs */}
          <div className="status-filter-tabs">
            {["all", "pending", "confirmed", "in_progress", "completed", "cancelled", "rejected"].map((s) => (
              <button
                key={s}
                className={`status-filter-tab ${filterStatus === s ? "status-tab-active" : ""}`}
                onClick={() => setFilterStatus(s)}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-page">
              <div className="spinner" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">📋</div>
              <h3>No bookings found</h3>
              <p className="text-muted">
                No bookings match your current filter ({filterStatus.replace("_", " ")}).
              </p>
            </div>
          ) : (
            <div className="bookings-cards">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card card">
                  <div className="booking-card-header">
                    <div className="booking-card-service">
                      <div
                        className="avatar-sm"
                        style={{
                          background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                          color: "white",
                          fontWeight: 700,
                        }}
                      >
                        {booking.customer?.name?.[0]?.toUpperCase() || "C"}
                      </div>
                      <div>
                        <div className="font-semibold text-base">
                          {booking.customer?.name || "Customer"}
                        </div>
                        <div className="text-muted text-sm">{booking.service?.title}</div>
                      </div>
                    </div>

                    <div className="booking-card-meta">
                      <span className={`badge badge-${STATUS_COLORS[booking.status] || "info"}`}>
                        {formatStatusLabel(booking.status)}
                      </span>
                      <div className="font-semibold text-base">
                        ₹{booking.totalAmount?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Animated Stepper for Visual Lifecycle */}
                  <BookingStepper status={booking.status} cancelReason={booking.cancelReason} />

                  <div className="booking-card-details" style={{ display: "block", marginTop: 12 }}>
                    <div className="booking-detail-grid">
                      <div className="detail-meta-item">
                        <FiClock size={13} color="var(--text-muted)" />
                        <span className="text-sm">
                          {booking.slot?.date} · {booking.slot?.startTime} — {booking.slot?.endTime}
                        </span>
                      </div>
                      {booking.customer?.phone && (
                        <div className="detail-meta-item">
                          <FiPhone size={13} color="var(--text-muted)" />
                          <span className="text-sm">{booking.customer.phone}</span>
                        </div>
                      )}
                      {booking.customer?.email && (
                        <div className="detail-meta-item">
                          <FiMail size={13} color="var(--text-muted)" />
                          <span className="text-sm">{booking.customer.email}</span>
                        </div>
                      )}
                    </div>

                    {formatAddress(booking.address) && (
                      <div className="text-sm text-muted" style={{ marginTop: 8 }}>
                        📍 {formatAddress(booking.address)}
                      </div>
                    )}
                    {booking.customerNotes && (
                      <div className="text-sm text-muted" style={{ marginTop: 4 }}>
                        📝 {booking.customerNotes}
                      </div>
                    )}

                    {/* Quick Status Action Buttons */}
                    {VENDOR_ACTIONS[booking.status] && (
                      <div className="vendor-action-bar">
                        {VENDOR_ACTIONS[booking.status].map((action) => (
                          <button
                            key={action}
                            className={`btn btn-sm ${
                              action === "rejected"
                                ? "btn-outline"
                                : action === "completed"
                                ? "btn-success"
                                : "btn-primary"
                            }`}
                            style={
                              action === "rejected"
                                ? { color: "var(--danger)", borderColor: "var(--danger)" }
                                : action === "completed"
                                ? {
                                    background: "linear-gradient(135deg, #10b981, #059669)",
                                    border: "none",
                                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                                  }
                                : action === "in_progress"
                                ? {
                                    background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                                    border: "none",
                                    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                                  }
                                : {}
                            }
                            disabled={updating === booking._id}
                            onClick={() => {
                              if (action === "rejected") {
                                setNoteModal({ id: booking._id, action });
                              } else {
                                updateStatus(booking._id, action);
                              }
                            }}
                          >
                            {updating === booking._id ? (
                              <span className="spinner spinner-sm" />
                            ) : action === "rejected" ? (
                              <>
                                <FiX /> Reject Booking
                              </>
                            ) : action === "confirmed" ? (
                              <>
                                <FiCheck /> Accept & Confirm
                              </>
                            ) : action === "in_progress" ? (
                              <>🛠️ Start Service (In Progress)</>
                            ) : (
                              <>
                                <FiCheckCircle /> Mark Completed 🎉
                              </>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {booking.status === "completed" && (
                      <div
                        style={{
                          marginTop: 10,
                          fontSize: 13,
                          color: "var(--success)",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontWeight: 500,
                        }}
                      >
                        <FiCheckCircle size={15} /> Service Completed · Payment Finalized
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
            <h3 className="font-semibold" style={{ marginBottom: 16 }}>
              Reason for Rejection
            </h3>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="State a polite reason (e.g. fully booked at this time)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="modal-actions" style={{ marginTop: 16 }}>
              <button className="btn btn-outline" onClick={() => setNoteModal(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ background: "var(--danger)", border: "none" }}
                onClick={() => updateStatus(noteModal.id, noteModal.action, note)}
              >
                Reject Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
