import React, { useState, useEffect, useCallback, useMemo } from "react";
import Navbar from "../../components/common/Navbar";
import BookingStepper from "../../components/common/BookingStepper";
import InvoiceModal from "../../components/common/InvoiceModal";
import ErrorBoundary from "../../components/common/ErrorBoundary";
import { useSocket } from "../../hooks/useSocket";
import api from "../../utils/api";
import toast from "react-hot-toast";
import {
  FiStar,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiPrinter,
  FiFileText,
  FiPhone,
  FiMail,
  FiMessageSquare,
} from "react-icons/fi";
import { format } from "date-fns";

const STATUS_COLORS = {
  pending: "warning",
  confirmed: "info",
  in_progress: "purple",
  completed: "success",
  cancelled: "danger",
  rejected: "danger",
};

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

const formatStatusLabel = (s) => {
  if (!s) return "";
  if (s.toLowerCase() === "in_progress") return "In Progress";
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
};

const formatAddress = (addr) => {
  if (!addr) return "Customer Residence";
  if (typeof addr === "string") return addr;
  const parts = [addr.street, addr.city, addr.state, addr.pincode].filter(Boolean);
  return parts.length ? parts.join(", ") : "Customer Residence";
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, title: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [invoiceModalBooking, setInvoiceModalBooking] = useState(null);

  const socket = useSocket();

  const fetchBookings = useCallback(
    async (showSpinner = true) => {
      if (showSpinner) setLoading(true);
      try {
        const params = filterStatus !== "all" ? `?status=${filterStatus}` : "";
        const { data } = await api.get(`/bookings/my${params}`);
        setBookings(data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        if (showSpinner) setLoading(false);
      }
    },
    [filterStatus]
  );

  useEffect(() => {
    fetchBookings(true);
  }, [fetchBookings]);

  // Real-time Socket.io listeners for instant live updates
  useEffect(() => {
    if (!socket) return;

    const handleBookingUpdate = (payload) => {
      const { bookingId, status, booking } = payload || {};
      if (!bookingId) return;

      setBookings((prev) => {
        const exists = prev.some((b) => b._id === bookingId);
        if (!exists) return prev;

        return prev.map((b) => {
          if (b._id === bookingId) {
            return {
              ...b,
              status: status || b.status,
              ...(booking || {}),
            };
          }
          return b;
        });
      });

      if (status === "completed") {
        toast.success("🎉 Your service has been completed! You can now leave a review.", {
          duration: 5000,
        });
      } else if (status === "confirmed") {
        toast.success("✅ Vendor confirmed your booking appointment!", {
          duration: 4000,
        });
      } else if (status === "in_progress") {
        toast("🛠️ Service is now in progress!", {
          icon: "🚀",
          duration: 4000,
        });
      } else if (status === "cancelled" || status === "rejected") {
        toast.error(`Booking was ${status}.`, { duration: 4000 });
      }

      fetchBookings(false);
    };

    const handleNotification = (notif) => {
      if (notif?.type === "booking") {
        fetchBookings(false);
      }
    };

    socket.on("booking_updated", handleBookingUpdate);
    socket.on("booking_status_changed", handleBookingUpdate);
    socket.on("notification", handleNotification);

    return () => {
      socket.off("booking_updated", handleBookingUpdate);
      socket.off("booking_status_changed", handleBookingUpdate);
      socket.off("notification", handleNotification);
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

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.put(`/bookings/${bookingId}/status`, {
        status: "cancelled",
        note: "Cancelled by customer",
      });
      toast.success("Booking cancelled");
      fetchBookings(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  const submitReview = async () => {
    if (!reviewData.comment) {
      toast.error("Please write a comment for your review");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/reviews", { bookingId: reviewModal._id, ...reviewData });
      toast.success("Review submitted! ⭐ Thank you!");
      setReviewModal(null);
      fetchBookings(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered Bookings via Search Query
  const filteredBookings = useMemo(() => {
    if (!searchQuery.trim()) return bookings;
    const q = searchQuery.toLowerCase().trim();
    return bookings.filter(
      (b) =>
        b.service?.title?.toLowerCase().includes(q) ||
        b.vendor?.name?.toLowerCase().includes(q) ||
        b.vendor?.businessName?.toLowerCase().includes(q) ||
        b._id?.toLowerCase().includes(q)
    );
  }, [bookings, searchQuery]);

  return (
    <ErrorBoundary>
      <div className="page-wrapper">
        <Navbar />
        <div className="dashboard-page">
          <div className="container">
            <div className="dashboard-header" style={{ flexWrap: "wrap", gap: 16 }}>
              <div>
                <h1 className="page-title">My Bookings</h1>
                <p className="text-muted">Track, manage, review and print tax receipts for your bookings</p>
              </div>

              {/* Real-time Search Bar */}
              <div style={{ position: "relative", minWidth: 260 }}>
                <FiSearch
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by service, vendor or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: 38, width: "100%", borderRadius: 24 }}
                />
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="status-filter-tabs">
              {["all", "pending", "confirmed", "in_progress", "completed", "cancelled"].map((s) => (
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
            ) : filteredBookings.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-icon">📋</div>
                <h3>No bookings found</h3>
                <p className="text-muted">
                  {searchQuery
                    ? `No bookings match your search "${searchQuery}".`
                    : `You don't have any ${filterStatus !== "all" ? filterStatus.replace("_", " ") : ""} bookings yet.`}
                </p>
              </div>
            ) : (
              <div className="bookings-cards">
                {filteredBookings.map((booking) => (
                  <ErrorBoundary key={booking._id}>
                    <BookingCard
                      booking={booking}
                      onCancel={handleCancel}
                      onReview={setReviewModal}
                      onViewInvoice={setInvoiceModalBooking}
                    />
                  </ErrorBoundary>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tax Invoice Generator Modal */}
        {invoiceModalBooking && (
          <InvoiceModal
            booking={invoiceModalBooking}
            onClose={() => setInvoiceModalBooking(null)}
          />
        )}

        {/* Review Modal */}
        {reviewModal && (
          <div className="modal-overlay" onClick={() => setReviewModal(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-semibold text-lg" style={{ marginBottom: 8 }}>
                Write a Review
              </h3>
              <p className="text-muted text-sm" style={{ marginBottom: 20 }}>
                For: <strong>{reviewModal.service?.title}</strong>
              </p>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: s })}
                    >
                      <FiStar
                        fill={s <= reviewData.rating ? "#f59e0b" : "none"}
                        color="#f59e0b"
                        size={28}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Title (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Great service experience!"
                  value={reviewData.title}
                  onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Review Comment</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Share your experience with this vendor..."
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button className="btn btn-outline" onClick={() => setReviewModal(null)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={submitReview} disabled={submitting}>
                  {submitting ? <span className="spinner spinner-sm" /> : "Submit Review ⭐"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

function BookingCard({ booking, onCancel, onReview, onViewInvoice }) {
  const [expanded, setExpanded] = useState(false);

  const vendorPhone = booking.vendor?.phone;
  const vendorEmail = booking.vendor?.email;
  const whatsappUrl = vendorPhone
    ? `https://wa.me/${vendorPhone.replace(/\D/g, "")}?text=Hi, regarding my booking #${booking._id?.slice(-6)} on ServeBook`
    : null;

  return (
    <div className="booking-card card">
      <div className="booking-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="booking-card-service">
          <div className="booking-card-icon">
            {booking.service?.category === "Salon"
              ? "✂️"
              : booking.service?.category === "Home Cleaning"
              ? "🧹"
              : booking.service?.category === "Plumbing"
              ? "🔧"
              : booking.service?.category === "AC Repair"
              ? "❄️"
              : "⚡"}
          </div>
          <div>
            <div className="font-semibold text-base">{booking.service?.title}</div>
            <div className="text-muted text-sm">
              by {booking.vendor?.businessName || booking.vendor?.name}
            </div>
          </div>
        </div>

        <div className="booking-card-meta">
          <div className="booking-card-date">
            <FiClock size={13} /> {formatBookingDate(booking.slot?.date)} · {booking.slot?.startTime}
          </div>
          <div className="booking-card-amount">₹{booking.totalAmount?.toLocaleString()}</div>
          <span className={`badge badge-${STATUS_COLORS[booking.status] || "info"}`}>
            {formatStatusLabel(booking.status)}
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{
              padding: "6px 8px",
              color: "var(--text-muted)",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "50%",
            }}
            aria-label="Toggle details"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Animated Step Indicator Progress Tracker */}
      <BookingStepper status={booking.status} cancelReason={booking.cancelReason} />

      {/* Direct Quick Actions Bar */}
      <div
        style={{
          marginTop: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Tax Invoice button for Completed or Paid bookings */}
          {["completed", "confirmed"].includes(booking.status) && (
            <button
              className="btn btn-outline btn-sm"
              style={{ fontSize: 12, padding: "5px 12px" }}
              onClick={(e) => {
                e.stopPropagation();
                onViewInvoice(booking);
              }}
            >
              <FiFileText /> View Tax Invoice
            </button>
          )}
        </div>

        {/* Direct Quick Action for Completed Booking: Rate & Review */}
        {booking.status === "completed" && !booking.isReviewed && (
          <button
            className="btn btn-primary btn-sm"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              borderColor: "#d97706",
              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
              fontWeight: 600,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onReview(booking);
            }}
          >
            <FiStar /> Write Review & Rate Vendor
          </button>
        )}
      </div>

      {expanded && (
        <div className="booking-card-details">
          <div className="booking-detail-grid">
            <div>
              <span className="text-muted text-sm">Payment Status</span>
              <br />
              <span
                className={`badge badge-${
                  booking.payment?.status === "paid" ? "success" : "warning"
                }`}
              >
                {booking.payment?.status}
              </span>
            </div>
            <div>
              <span className="text-muted text-sm">Method</span>
              <br />
              <span className="font-semibold text-sm capitalize">
                {booking.payment?.method || "Online"}
              </span>
            </div>
            <div>
              <span className="text-muted text-sm">Booking ID</span>
              <br />
              <span className="text-sm font-mono text-muted">#{booking._id?.slice(-8)}</span>
            </div>

            {/* Safe Address formatting (Never crashes) */}
            <div style={{ flexBasis: "100%" }}>
              <span className="text-muted text-sm">Service Address: </span>
              <span className="text-sm font-medium">{formatAddress(booking.address)}</span>
            </div>

            {booking.customerNotes && (
              <div className="booking-notes" style={{ flexBasis: "100%" }}>
                <span className="text-muted text-sm">Notes: </span>
                {booking.customerNotes}
              </div>
            )}
          </div>

          {/* Direct Vendor Contact Actions (Enterprise Feature) */}
          <div
            style={{
              margin: "14px 0",
              padding: "10px 14px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <span className="text-xs text-muted font-semibold uppercase">Contact Service Partner:</span>
            <div style={{ display: "flex", gap: 10 }}>
              {vendorPhone && (
                <a
                  href={`tel:${vendorPhone}`}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: 12, padding: "4px 10px" }}
                >
                  <FiPhone size={12} /> Call Partner
                </a>
              )}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: 12, padding: "4px 10px", color: "#22c55e", borderColor: "rgba(34, 197, 94, 0.3)" }}
                >
                  <FiMessageSquare size={12} /> WhatsApp
                </a>
              )}
              {vendorEmail && (
                <a
                  href={`mailto:${vendorEmail}`}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: 12, padding: "4px 10px" }}
                >
                  <FiMail size={12} /> Email
                </a>
              )}
            </div>
          </div>

          {/* Status History Timeline */}
          {booking.statusHistory?.length > 0 && (
            <div className="status-timeline">
              <span className="text-xs text-muted font-semibold uppercase tracking-wider">
                Status History:
              </span>
              {booking.statusHistory.map((h, i) => (
                <div key={i} className="status-history-item">
                  <FiCheckCircle size={14} color="var(--success)" />
                  <span className="text-sm text-muted">
                    <strong style={{ color: "var(--text)" }}>{formatStatusLabel(h.status)}</strong>{" "}
                    {h.note && `— ${h.note}`}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="booking-actions" style={{ marginTop: 14 }}>
            {["pending", "confirmed"].includes(booking.status) && (
              <button
                className="btn btn-outline btn-sm"
                style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
                onClick={() => onCancel(booking._id)}
              >
                Cancel Booking
              </button>
            )}
            {booking.isReviewed && (
              <span
                className="text-sm"
                style={{
                  color: "var(--success)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FiCheckCircle size={14} /> You have reviewed this booking
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
