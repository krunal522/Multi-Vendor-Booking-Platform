import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FiStar, FiClock, FiMapPin, FiPhone, FiChevronLeft, FiCalendar, FiCheck, FiAlertCircle } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { format, addDays } from "date-fns";
import { getServiceImage } from "../utils/serviceImages";

export default function ServiceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [showBooking, setShowBooking] = useState(false);
  const [address, setAddress] = useState({ street: "", city: "", state: "", pincode: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [activeTab, setActiveTab] = useState("overview");

  // Generate next 7 days
  const upcomingDates = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(new Date(), i + 1);
    return format(d, "yyyy-MM-dd");
  });

  useEffect(() => {
    fetchService();
    fetchReviews();
  }, [id]);

  const fetchService = async () => {
    try {
      const { data } = await api.get(`/services/${id}`);
      setService(data.service);
      if (data.service?.slots?.length > 0) {
        setSelectedDate(data.service.slots.find((s) => !s.isBooked)?.date || "");
      }
    } catch {
      toast.error("Service not found");
      navigate("/services");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/${id}`);
      setReviews(data.reviews || []);
    } catch {}
  };

  const availableSlots = service?.slots?.filter(
    (s) => s.date === selectedDate && !s.isBooked
  ) || [];

  const validateField = (name, value) => {
    switch (name) {
      case "street":
        if (!value || !value.trim()) return "Street address is required";
        if (value.trim().length < 5) return "Please enter complete street/house address (min 5 characters)";
        return "";
      case "city":
        if (!value || !value.trim()) return "City is required";
        return "";
      case "pincode":
        if (!value || !value.trim()) return "Postal pincode is required";
        if (!/^[1-9][0-9]{5}$/.test(value.trim())) return "Enter a valid 6-digit postal code (e.g. 400001)";
        return "";
      default:
        return "";
    }
  };

  const validateBooking = () => {
    const newErrors = {};
    const streetErr = validateField("street", address.street);
    if (streetErr) newErrors.street = streetErr;
    const cityErr = validateField("city", address.city);
    if (cityErr) newErrors.city = cityErr;
    const pincodeErr = validateField("pincode", address.pincode);
    if (pincodeErr) newErrors.pincode = pincodeErr;

    setErrors(newErrors);
    setTouched({ street: true, city: true, pincode: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleBook = async () => {
    if (!user) {
      toast.error("Please login to proceed with booking");
      navigate("/login");
      return;
    }
    if (!selectedSlot) {
      toast.error("Please select a date and time slot");
      return;
    }
    if (!validateBooking()) {
      toast.error("Please fill in valid address details");
      return;
    }

    setBookingLoading(true);
    try {
      const { data } = await api.post("/bookings", {
        service: service._id,
        serviceId: service._id,
        slotDate: selectedSlot.date,
        slotStartTime: selectedSlot.startTime,
        slotEndTime: selectedSlot.endTime,
        slot: {
          date: selectedSlot.date,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime
        },
        address,
        customerNotes: notes,
        paymentMethod,
      });
      toast.success("🎉 Booking confirmed successfully!");
      navigate("/customer/bookings");
    } catch (err) {
      if (err.response?.data?.errors) {
        const backendErrors = {};
        for (const [key, msg] of Object.entries(err.response.data.errors)) {
          const shortKey = key.replace("address.", "");
          backendErrors[shortKey] = msg;
        }
        setErrors(backendErrors);
        setTouched({ street: true, city: true, pincode: true });
      }
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;
  if (!service) return null;

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(service.rating || 0));

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="detail-page">
        <div className="container">
          {/* Back */}
          <Link to="/services" className="back-link">
            <FiChevronLeft /> Back to Services
          </Link>

          <div className="detail-layout">
            {/* Left: Main Content */}
            <div className="detail-main">
              {/* Service Image */}
              <div className="detail-image">
                <img 
                  src={getServiceImage(service)} 
                  alt={service.title} 
                  onError={(e) => {
                    e.currentTarget.src = "/services/home-cleaning.jpg";
                  }}
                />
              </div>

              {/* Service Info */}
              <div className="detail-info card">
                <div className="detail-badges">
                  <span className="badge badge-purple">{service.category}</span>
                  {service.isFeatured && <span className="badge badge-warning">⭐ Featured</span>}
                  <span className={`badge ${service.isApproved ? "badge-success" : "badge-warning"}`}>
                    {service.isApproved ? "✓ Verified" : "Pending Approval"}
                  </span>
                </div>

                <h1 className="detail-title">{service.title}</h1>

                <div className="detail-meta">
                  <div className="detail-meta-item">
                    <div className="stars-row">
                      {stars.map((filled, i) => (
                        <FiStar key={i} fill={filled ? "#f59e0b" : "none"} color="#f59e0b" size={16} />
                      ))}
                    </div>
                    <span className="font-semibold">{service.rating?.toFixed(1) || "New"}</span>
                    <span className="text-muted">({service.totalReviews} reviews)</span>
                  </div>
                  <div className="detail-meta-item">
                    <FiClock color="var(--text-muted)" />
                    <span>{service.duration} minutes</span>
                  </div>
                  <div className="detail-meta-item">
                    <FiMapPin color="var(--text-muted)" />
                    <span>{service.location?.city}, {service.location?.state}</span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="detail-tabs">
                  {["overview", "vendor", "reviews"].map((tab) => (
                    <button key={tab} className={`detail-tab ${activeTab === tab ? "detail-tab-active" : ""}`}
                      onClick={() => setActiveTab(tab)}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {activeTab === "overview" && (
                  <div className="detail-tab-content">
                    <p style={{ lineHeight: 1.8, color: "var(--text-muted)" }}>{service.description}</p>
                    {service.tags?.length > 0 && (
                      <div className="tags-row" style={{ marginTop: 16 }}>
                        {service.tags.map((tag) => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="service-stats" style={{ marginTop: 24 }}>
                      <div className="service-stat">
                        <div className="service-stat-val">{service.totalBookings || 0}</div>
                        <div className="text-muted text-sm">Total Bookings</div>
                      </div>
                      <div className="service-stat">
                        <div className="service-stat-val">{service.totalReviews || 0}</div>
                        <div className="text-muted text-sm">Reviews</div>
                      </div>
                      <div className="service-stat">
                        <div className="service-stat-val">{service.rating?.toFixed(1) || "—"}</div>
                        <div className="text-muted text-sm">Rating</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "vendor" && service.vendor && (
                  <div className="detail-tab-content">
                    <div className="vendor-profile">
                      <div className="vendor-avatar">{service.vendor.name?.[0]}</div>
                      <div>
                        <div className="font-semibold" style={{ fontSize: 18 }}>{service.vendor.businessName || service.vendor.name}</div>
                        <div className="text-muted text-sm">{service.vendor.businessDescription}</div>
                        <div style={{ marginTop: 8 }}>
                          <MdVerified color="#10b981" /> <span className="text-sm" style={{ color: "#10b981" }}>Verified Vendor</span>
                        </div>
                        <div className="vendor-stats-row" style={{ marginTop: 12 }}>
                          <span className="badge badge-warning">⭐ {service.vendor.rating?.toFixed(1)} Rating</span>
                          <span className="badge badge-info">{service.vendor.totalReviews} Reviews</span>
                        </div>
                        {service.vendor.phone && (
                          <div className="detail-meta-item" style={{ marginTop: 12 }}>
                            <FiPhone color="var(--text-muted)" />
                            <span>{service.vendor.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="detail-tab-content">
                    {reviews.length === 0 ? (
                      <div className="empty-state" style={{ padding: "32px 0" }}>
                        <div className="empty-icon">⭐</div>
                        <p className="text-muted">No reviews yet. Be the first!</p>
                      </div>
                    ) : (
                      reviews.map((r) => (
                        <div key={r._id} className="review-card">
                          <div className="review-header">
                            <div className="avatar-sm">{r.customer?.name?.[0]}</div>
                            <div>
                              <div className="font-semibold">{r.customer?.name}</div>
                              <div className="stars-row">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <FiStar key={i} fill={i < r.rating ? "#f59e0b" : "none"} color="#f59e0b" size={13} />
                                ))}
                              </div>
                            </div>
                          </div>
                          {r.title && <div className="font-semibold" style={{ marginTop: 8 }}>{r.title}</div>}
                          <p className="text-muted" style={{ marginTop: 4 }}>{r.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Booking Panel */}
            <div className="detail-sidebar">
              <div className="booking-panel card">
                <div className="booking-price">
                  <span className="price-type">{service.priceType === "starting_from" ? "Starting from" : ""}</span>
                  <span className="price-main">₹{service.price?.toLocaleString()}</span>
                  {service.priceType === "hourly" && <span className="text-muted">/hr</span>}
                </div>
                <div className="price-breakdown text-muted text-sm">
                  Platform fee: ₹{Math.round(service.price * 0.1)} · Vendor gets: ₹{service.price - Math.round(service.price * 0.1)}
                </div>

                {!showBooking ? (
                  <>
                    {/* Quick slot picker */}
                    <div className="form-group" style={{ marginTop: 20 }}>
                      <label className="form-label"><FiCalendar /> Select Date</label>
                      <div className="date-picker">
                        {upcomingDates.slice(0, 7).map((date) => {
                          const hasSlots = service.slots?.some((s) => s.date === date && !s.isBooked);
                          return (
                            <button key={date} disabled={!hasSlots}
                              className={`date-btn ${selectedDate === date ? "date-btn-active" : ""} ${!hasSlots ? "date-btn-disabled" : ""}`}
                              onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}>
                              <div className="date-btn-day">{format(new Date(date + "T00:00:00"), "EEE")}</div>
                              <div className="date-btn-num">{format(new Date(date + "T00:00:00"), "d")}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {selectedDate && (
                      <div className="form-group">
                        <label className="form-label">Available Slots</label>
                        {availableSlots.length === 0 ? (
                          <p className="text-muted text-sm">No slots available for this date</p>
                        ) : (
                          <div className="slots-grid">
                            {availableSlots.map((slot) => (
                              <button key={slot._id}
                                className={`slot-btn ${selectedSlot?._id === slot._id ? "slot-btn-active" : ""}`}
                                onClick={() => setSelectedSlot(slot)}>
                                {slot.startTime} - {slot.endTime}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      className="btn btn-primary w-full btn-lg"
                      style={{ marginTop: 8 }}
                      onClick={() => {
                        if (!user) { navigate("/login"); return; }
                        if (!selectedSlot) { toast.error("Please select a time slot"); return; }
                        setShowBooking(true);
                      }}
                      disabled={!selectedSlot}
                    >
                      Book Now
                    </button>
                  </>
                ) : (
                  <div className="booking-form">
                    <div className="booking-summary">
                      <FiCheck color="var(--success)" />
                      <span className="text-sm">{selectedDate} · {selectedSlot?.startTime} - {selectedSlot?.endTime}</span>
                      <button onClick={() => setShowBooking(false)} className="text-sm" style={{ color: "var(--primary)", background: "none", border: "none", cursor: "pointer" }}>Change</button>
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Service Address *</span>
                        <span className="text-muted text-xs">Doorstep Service</span>
                      </label>
                      <input 
                        type="text" 
                        className={`form-input ${touched.street && errors.street ? "input-error" : ""}`} 
                        placeholder="House/Flat No., Building, Street (min 5 chars)" 
                        value={address.street}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAddress({ ...address, street: val });
                          if (touched.street) {
                            setErrors(prev => ({ ...prev, street: validateField("street", val) }));
                          }
                        }}
                        onBlur={() => {
                          setTouched(prev => ({ ...prev, street: true }));
                          setErrors(prev => ({ ...prev, street: validateField("street", address.street) }));
                        }}
                        style={{ marginBottom: touched.street && errors.street ? 4 : 8 }} 
                      />
                      {touched.street && errors.street && (
                        <div className="field-error-msg" style={{ marginBottom: 8 }}>
                          <FiAlertCircle size={13} />
                          <span>{errors.street}</span>
                        </div>
                      )}

                      <div className="grid-2">
                        <div>
                          <input 
                            type="text" 
                            className={`form-input ${touched.city && errors.city ? "input-error" : ""}`} 
                            placeholder="City (e.g. Mumbai)" 
                            value={address.city}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAddress({ ...address, city: val });
                              if (touched.city) {
                                setErrors(prev => ({ ...prev, city: validateField("city", val) }));
                              }
                            }}
                            onBlur={() => {
                              setTouched(prev => ({ ...prev, city: true }));
                              setErrors(prev => ({ ...prev, city: validateField("city", address.city) }));
                            }}
                          />
                          {touched.city && errors.city && (
                            <div className="field-error-msg">
                              <FiAlertCircle size={13} />
                              <span>{errors.city}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <input 
                            type="text" 
                            maxLength={6}
                            className={`form-input ${touched.pincode && errors.pincode ? "input-error" : ""}`} 
                            placeholder="6-digit Pincode" 
                            value={address.pincode}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              setAddress({ ...address, pincode: val });
                              if (touched.pincode) {
                                setErrors(prev => ({ ...prev, pincode: validateField("pincode", val) }));
                              }
                            }}
                            onBlur={() => {
                              setTouched(prev => ({ ...prev, pincode: true }));
                              setErrors(prev => ({ ...prev, pincode: validateField("pincode", address.pincode) }));
                            }}
                          />
                          {touched.pincode && errors.pincode && (
                            <div className="field-error-msg">
                              <FiAlertCircle size={13} />
                              <span>{errors.pincode}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Special Instructions</label>
                      <textarea className="form-textarea" rows={2} placeholder="Any special requirements..." value={notes}
                        onChange={(e) => setNotes(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Payment Method</label>
                      <div className="payment-options">
                        {[{ value: "online", label: "💳 Pay Online" }, { value: "cash", label: "💵 Cash on Service" }].map((opt) => (
                          <button key={opt.value} type="button"
                            className={`payment-option ${paymentMethod === opt.value ? "payment-option-active" : ""}`}
                            onClick={() => setPaymentMethod(opt.value)}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button className="btn btn-primary w-full btn-lg" onClick={handleBook} disabled={bookingLoading}>
                      {bookingLoading ? <span className="spinner spinner-sm" /> : `Confirm & Pay ₹${service.price?.toLocaleString()}`}
                    </button>
                  </div>
                )}

                <div className="booking-guarantee">
                  <FiCheck color="var(--success)" /> 100% Service Guarantee
                  <FiCheck color="var(--success)" style={{ marginLeft: 8 }} /> Instant Confirmation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
