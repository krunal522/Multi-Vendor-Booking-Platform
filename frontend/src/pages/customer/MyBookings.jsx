import React, { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { FiStar, FiClock, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

const STATUS_COLORS = {
  pending: "warning", confirmed: "info", in_progress: "purple",
  completed: "success", cancelled: "danger", rejected: "danger"
};

const STATUS_FLOW = ["pending", "confirmed", "in_progress", "completed"];

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, title: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = filterStatus !== "all" ? `?status=${filterStatus}` : "";
      const { data } = await api.get(`/bookings/my${params}`);
      setBookings(data.bookings || []);
    } catch {} finally { setLoading(false); }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: "cancelled", note: "Cancelled by customer" });
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const submitReview = async () => {
    if (!reviewData.comment) { toast.error("Please write a comment"); return; }
    setSubmitting(true);
    try {
      await api.post("/reviews", { bookingId: reviewModal._id, ...reviewData });
      toast.success("Review submitted! ⭐");
      setReviewModal(null);
      fetchBookings();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); } finally { setSubmitting(false); }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-page">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1 className="page-title">My Bookings</h1>
              <p className="text-muted">Track and manage all your service bookings</p>
            </div>
          </div>

          {/* Status Filter */}
          <div className="status-filter-tabs">
            {["all", "pending", "confirmed", "in_progress", "completed", "cancelled"].map((s) => (
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
              <p className="text-muted">You don't have any {filterStatus !== "all" ? filterStatus : ""} bookings yet.</p>
            </div>
          ) : (
            <div className="bookings-cards">
              {bookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} onReview={setReviewModal} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="modal-overlay" onClick={() => setReviewModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-lg" style={{ marginBottom: 8 }}>Write a Review</h3>
            <p className="text-muted text-sm" style={{ marginBottom: 20 }}>For: {reviewModal.service?.title}</p>
            <div className="form-group">
              <label className="form-label">Rating</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setReviewData({ ...reviewData, rating: s })}>
                    <FiStar fill={s <= reviewData.rating ? "#f59e0b" : "none"} color="#f59e0b" size={28} />
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Title (Optional)</label>
              <input type="text" className="form-input" placeholder="Great service!" value={reviewData.title}
                onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Review</label>
              <textarea className="form-textarea" rows={3} placeholder="Share your experience..." value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })} required />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setReviewModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitReview} disabled={submitting}>
                {submitting ? <span className="spinner spinner-sm" /> : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking, onCancel, onReview }) {
  const [expanded, setExpanded] = useState(false);
  const STATUS_COLORS = {
    pending: "warning", confirmed: "info", in_progress: "purple",
    completed: "success", cancelled: "danger", rejected: "danger"
  };

  return (
    <div className="booking-card card">
      <div className="booking-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="booking-card-service">
          <div className="booking-card-icon">
            {booking.service?.category === "Salon" ? "✂️" : booking.service?.category === "Home Cleaning" ? "🧹" : "🛠️"}
          </div>
          <div>
            <div className="font-semibold">{booking.service?.title}</div>
            <div className="text-muted text-sm">by {booking.vendor?.name}</div>
          </div>
        </div>
        <div className="booking-card-meta">
          <div className="booking-card-date">
            <FiClock size={13} /> {booking.slot?.date} · {booking.slot?.startTime}
          </div>
          <div className="booking-card-amount">₹{booking.totalAmount?.toLocaleString()}</div>
          <span className={`badge badge-${STATUS_COLORS[booking.status] || "info"}`}>
            {booking.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="booking-card-details">
          <div className="booking-detail-grid">
            <div><span className="text-muted text-sm">Payment</span><br /><span className="badge badge-{booking.payment?.status === 'paid' ? 'success' : 'warning'}">{booking.payment?.status}</span></div>
            <div><span className="text-muted text-sm">Method</span><br /><span className="font-semibold">{booking.payment?.method}</span></div>
            <div><span className="text-muted text-sm">Booking ID</span><br /><span className="text-sm text-muted">#{booking._id?.slice(-8)}</span></div>
            {booking.customerNotes && (
              <div className="booking-notes">
                <span className="text-muted text-sm">Notes: </span>{booking.customerNotes}
              </div>
            )}
          </div>

          {/* Status History */}
          {booking.statusHistory?.length > 0 && (
            <div className="status-timeline">
              {booking.statusHistory.map((h, i) => (
                <div key={i} className="status-history-item">
                  <FiCheckCircle size={14} color="var(--success)" />
                  <span className="text-sm text-muted">{h.status} {h.note && `— ${h.note}`}</span>
                </div>
              ))}
            </div>
          )}

          <div className="booking-actions">
            {["pending", "confirmed"].includes(booking.status) && (
              <button className="btn btn-outline btn-sm" style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
                onClick={() => onCancel(booking._id)}>
                Cancel Booking
              </button>
            )}
            {booking.status === "completed" && !booking.isReviewed && (
              <button className="btn btn-primary btn-sm" onClick={() => onReview(booking)}>
                <FiStar /> Write Review
              </button>
            )}
            {booking.isReviewed && (
              <span className="text-sm" style={{ color: "var(--success)" }}>
                <FiCheckCircle size={13} /> Reviewed
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
