import React, { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { FiPlus, FiEdit, FiTrash2, FiCheck, FiX, FiClock, FiMapPin, FiCalendar, FiAlertCircle } from "react-icons/fi";
import { format, addDays } from "date-fns";
import { getServiceImage, CATEGORY_IMAGE_MAP } from "../../utils/serviceImages";

const CATEGORIES = ["Salon","Home Cleaning","Plumbing","Electrical","AC Repair","Pest Control","Painting","Carpentry","Appliance Repair","Beauty & Spa"];
const PRICE_TYPES = ["fixed", "hourly", "starting_from"];

const EMPTY_SERVICE = {
  title: "", description: "", category: "Salon", price: "", priceType: "fixed", duration: 60,
  "location.city": "", "location.state": "", "location.pincode": "", tags: "", image: ""
};

export default function VendorServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editService, setEditService] = useState(null);
  const [form, setForm] = useState(EMPTY_SERVICE);
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [slotModal, setSlotModal] = useState(null);

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const { data } = await api.get("/services?vendor=me&limit=50");
      // Get vendor services - use admin all services endpoint filtered
      const res = await api.get("/vendor/dashboard");
      // Fetch by listing services created by this vendor
      const sres = await api.get("/services?limit=50");
      setServices(sres.data.services?.filter(s => true) || []);
    } catch {} finally { setLoading(false); }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "title":
        if (!value || !value.trim()) return "Service title is required";
        if (value.trim().length < 5) return "Title must be at least 5 characters";
        if (value.trim().length > 100) return "Title cannot exceed 100 characters";
        return "";
      case "price":
        if (value === "" || value === null || value === undefined) return "Price is required";
        if (Number(value) <= 0) return "Price must be greater than ₹0";
        return "";
      case "duration":
        if (value === "" || value === null) return "Duration is required";
        if (Number(value) < 15 || Number(value) > 600) return "Duration must be between 15 and 600 mins";
        return "";
      case "location.city":
        if (!value || !value.trim()) return "City is required";
        return "";
      case "description":
        if (!value || !value.trim()) return "Description is required";
        if (value.trim().length < 15) return "Description must be at least 15 characters";
        return "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const errs = {};
    const tErr = validateField("title", form.title);
    if (tErr) errs.title = tErr;
    const pErr = validateField("price", form.price);
    if (pErr) errs.price = pErr;
    const dErr = validateField("duration", form.duration);
    if (dErr) errs.duration = dErr;
    const cErr = validateField("location.city", form["location.city"]);
    if (cErr) errs["location.city"] = cErr;
    const descErr = validateField("description", form.description);
    if (descErr) errs.description = descErr;

    setFormErrors(errs);
    setFormTouched({ title: true, price: true, duration: true, "location.city": true, description: true });
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        duration: Number(form.duration),
        tags: form.tags ? form.tags.split(",").map(t => t.trim()) : [],
        location: {
          city: form["location.city"].trim(),
          state: form["location.state"],
          pincode: form["location.pincode"],
        },
        images: form.image ? [form.image] : (editService?.images?.length ? editService.images : [CATEGORY_IMAGE_MAP[form.category] || "/services/home-cleaning.jpg"])
      };
      delete payload["location.city"]; delete payload["location.state"]; delete payload["location.pincode"]; delete payload.image;

      if (editService) {
        await api.put(`/services/${editService._id}`, payload);
        toast.success("Service updated!");
      } else {
        await api.post("/services", payload);
        toast.success("Service created! Pending admin approval.");
      }
      setShowForm(false);
      setEditService(null);
      setForm(EMPTY_SERVICE);
      setFormErrors({});
      setFormTouched({});
      fetchServices();
    } catch (err) {
      if (err.response?.data?.errors) {
        const backendErrs = {};
        for (const [key, msg] of Object.entries(err.response.data.errors)) {
          backendErrs[key] = msg;
        }
        setFormErrors(backendErrs);
        setFormTouched(prev => ({ ...prev, ...backendErrs }));
      }
      toast.error(err.response?.data?.message || "Failed to save service");
    } finally { 
      setSubmitting(false); 
    }
  };

  const handleEdit = (service) => {
    setEditService(service);
    setForm({
      title: service.title, description: service.description, category: service.category,
      price: service.price, priceType: service.priceType, duration: service.duration,
      "location.city": service.location?.city || "",
      "location.state": service.location?.state || "",
      "location.pincode": service.location?.pincode || "",
      tags: service.tags?.join(", ") || "",
      image: service.images?.[0] || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success("Deleted");
      fetchServices();
    } catch {}
  };

  const addSlots = async (serviceId) => {
    // Generate slots for next 14 days
    const slots = [];
    for (let d = 1; d <= 14; d++) {
      const date = format(addDays(new Date(), d), "yyyy-MM-dd");
      ["09:00","11:00","13:00","15:00","17:00"].forEach(time => {
        const [h] = time.split(":").map(Number);
        slots.push({ date, startTime: time, endTime: `${String(h+1).padStart(2,"0")}:00` });
      });
    }
    try {
      await api.post(`/services/${serviceId}/slots`, { slots });
      toast.success("Slots added for next 14 days!");
      setSlotModal(null);
    } catch (err) { toast.error("Failed to add slots"); }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-page">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1 className="page-title">My Services</h1>
              <p className="text-muted">Manage your service listings</p>
            </div>
            <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditService(null); setForm(EMPTY_SERVICE); }}>
              <FiPlus /> Add Service
            </button>
          </div>

          {/* Service Form */}
          {showForm && (
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-header">
                <h3 className="font-semibold">{editService ? "Edit Service" : "Add New Service"}</h3>
                <button onClick={() => { setShowForm(false); setEditService(null); }}><FiX /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Service Title *</label>
                    <input 
                      type="text" 
                      className={`form-input ${formTouched.title && formErrors.title ? "input-error" : ""}`} 
                      value={form.title} 
                      onChange={e => {
                        const val = e.target.value;
                        setForm({...form, title: val});
                        if (formTouched.title) setFormErrors(prev => ({ ...prev, title: validateField("title", val) }));
                      }} 
                      onBlur={() => {
                        setFormTouched(prev => ({ ...prev, title: true }));
                        setFormErrors(prev => ({ ...prev, title: validateField("title", form.title) }));
                      }}
                      placeholder="e.g. Deep Home Cleaning & Sanitization"
                      required 
                    />
                    {formTouched.title && formErrors.title && (
                      <div className="field-error-msg">
                        <FiAlertCircle size={13} />
                        <span>{formErrors.title}</span>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
                      <option value="">Select...</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input 
                      type="number" 
                      className={`form-input ${formTouched.price && formErrors.price ? "input-error" : ""}`} 
                      value={form.price} 
                      onChange={e => {
                        const val = e.target.value;
                        setForm({...form, price: val});
                        if (formTouched.price) setFormErrors(prev => ({ ...prev, price: validateField("price", val) }));
                      }} 
                      onBlur={() => {
                        setFormTouched(prev => ({ ...prev, price: true }));
                        setFormErrors(prev => ({ ...prev, price: validateField("price", form.price) }));
                      }}
                      placeholder="e.g. 799"
                      required 
                      min={1} 
                    />
                    {formTouched.price && formErrors.price && (
                      <div className="field-error-msg">
                        <FiAlertCircle size={13} />
                        <span>{formErrors.price}</span>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price Type</label>
                    <select className="form-select" value={form.priceType} onChange={e => setForm({...form, priceType: e.target.value})}>
                      {PRICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Duration (minutes) *</label>
                    <input 
                      type="number" 
                      className={`form-input ${formTouched.duration && formErrors.duration ? "input-error" : ""}`} 
                      value={form.duration} 
                      onChange={e => {
                        const val = e.target.value;
                        setForm({...form, duration: val});
                        if (formTouched.duration) setFormErrors(prev => ({ ...prev, duration: validateField("duration", val) }));
                      }} 
                      onBlur={() => {
                        setFormTouched(prev => ({ ...prev, duration: true }));
                        setFormErrors(prev => ({ ...prev, duration: validateField("duration", form.duration) }));
                      }}
                      min={15} 
                      max={600}
                    />
                    {formTouched.duration && formErrors.duration && (
                      <div className="field-error-msg">
                        <FiAlertCircle size={13} />
                        <span>{formErrors.duration}</span>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input 
                      type="text" 
                      className={`form-input ${formTouched["location.city"] && formErrors["location.city"] ? "input-error" : ""}`} 
                      value={form["location.city"]} 
                      onChange={e => {
                        const val = e.target.value;
                        setForm({...form, "location.city": val});
                        if (formTouched["location.city"]) setFormErrors(prev => ({ ...prev, "location.city": validateField("location.city", val) }));
                      }} 
                      onBlur={() => {
                        setFormTouched(prev => ({ ...prev, "location.city": true }));
                        setFormErrors(prev => ({ ...prev, "location.city": validateField("location.city", form["location.city"]) }));
                      }}
                      placeholder="e.g. Mumbai"
                      required 
                    />
                    {formTouched["location.city"] && formErrors["location.city"] && (
                      <div className="field-error-msg">
                        <FiAlertCircle size={13} />
                        <span>{formErrors["location.city"]}</span>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input type="text" className="form-input" value={form["location.state"]} onChange={e => setForm({...form, "location.state": e.target.value})} placeholder="e.g. Maharashtra" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tags (comma separated)</label>
                    <input type="text" className="form-input" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="e.g. spa, massage, relaxation" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Picture / Image URL</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={form.image} 
                      onChange={e => setForm({...form, image: e.target.value})} 
                      placeholder="e.g. /services/spa-massage.jpg or https://..." 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <label className="form-label" style={{ margin: 0 }}>Description *</label>
                    <span className="text-xs" style={{ color: form.description.length < 15 ? "var(--text-muted)" : "var(--success)" }}>
                      {form.description.length} / 15 chars min
                    </span>
                  </div>
                  <textarea 
                    className={`form-textarea ${formTouched.description && formErrors.description ? "input-error" : ""}`} 
                    rows={3} 
                    value={form.description} 
                    onChange={e => {
                      const val = e.target.value;
                      setForm({...form, description: val});
                      if (formTouched.description) setFormErrors(prev => ({ ...prev, description: validateField("description", val) }));
                    }} 
                    onBlur={() => {
                      setFormTouched(prev => ({ ...prev, description: true }));
                      setFormErrors(prev => ({ ...prev, description: validateField("description", form.description) }));
                    }}
                    placeholder="Provide full description of service, deliverables, and requirements (min 15 characters)..."
                    required 
                  />
                  {formTouched.description && formErrors.description && (
                    <div className="field-error-msg">
                      <FiAlertCircle size={13} />
                      <span>{formErrors.description}</span>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                  <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); setFormErrors({}); setFormTouched({}); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? <span className="spinner spinner-sm" /> : editService ? "Update Service" : "Create Service"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Services List */}
          {loading ? (
            <div className="loading-page"><div className="spinner" /></div>
          ) : services.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">🛠️</div>
              <h3>No services yet</h3>
              <p className="text-muted">Create your first service listing</p>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowForm(true)}>
                <FiPlus /> Add Service
              </button>
            </div>
          ) : (
            <div className="services-mgmt-list">
              {services.map((service) => (
                <div key={service._id} className="service-mgmt-card card" style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  {/* Service Picture */}
                  <div 
                    style={{
                      width: 140,
                      minWidth: 140,
                      height: 105,
                      borderRadius: 10,
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      background: "var(--surface2)",
                      flexShrink: 0
                    }}
                  >
                    <img 
                      src={getServiceImage(service)} 
                      alt={service.title} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.src = "/services/home-cleaning.jpg";
                      }}
                    />
                  </div>

                  <div className="service-mgmt-info" style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                      <span className="badge badge-purple">{service.category}</span>
                      <span className={`badge ${service.isApproved ? "badge-success" : "badge-warning"}`}>
                        {service.isApproved ? "✓ Approved" : "⏳ Pending"}
                      </span>
                      {service.isFeatured && <span className="badge badge-warning">⭐ Featured</span>}
                    </div>
                    <h3 className="font-semibold" style={{ marginBottom: 4 }}>{service.title}</h3>
                    <p className="text-muted text-sm" style={{ marginBottom: 8 }}>{service.description?.slice(0, 100)}...</p>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <span className="text-sm text-muted"><FiClock size={12} /> {service.duration} min</span>
                      <span className="text-sm text-muted"><FiMapPin size={12} /> {service.location?.city}</span>
                      <span className="text-sm text-muted">📅 {service.slots?.filter(s => !s.isBooked).length} free slots</span>
                    </div>
                  </div>
                  <div className="service-mgmt-actions">
                    <div className="service-mgmt-price">₹{service.price?.toLocaleString()}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => setSlotModal(service._id)}>
                        <FiCalendar /> Slots
                      </button>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(service)}>
                        <FiEdit />
                      </button>
                      <button className="btn btn-outline btn-sm" style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
                        onClick={() => handleDelete(service._id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Slot Add Confirmation */}
          {slotModal && (
            <div className="modal-overlay" onClick={() => setSlotModal(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="font-semibold text-lg" style={{ marginBottom: 12 }}>Add Availability Slots</h3>
                <p className="text-muted">This will add slots for the next 14 days (9AM, 11AM, 1PM, 3PM, 5PM). Existing slots won't be affected.</p>
                <div className="modal-actions" style={{ marginTop: 20 }}>
                  <button className="btn btn-outline" onClick={() => setSlotModal(null)}>Cancel</button>
                  <button className="btn btn-primary" onClick={() => addSlots(slotModal)}>
                    <FiCalendar /> Add Slots
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
