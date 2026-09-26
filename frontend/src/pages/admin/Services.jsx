import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { 
  FiCheck, FiX, FiStar, FiSearch, FiExternalLink, 
  FiClock, FiMapPin, FiTag, FiEye, FiCalendar, FiPlus, FiTrash2, FiEdit3, FiAlertCircle
} from "react-icons/fi";
import { CATEGORY_IMAGE_MAP } from "../../utils/serviceImages";

const CATEGORIES = ["All", "Salon", "Home Cleaning", "Plumbing", "Electrical", "AC Repair", "Pest Control", "Painting", "Carpentry", "Appliance Repair", "Beauty & Spa"];
const SERVICE_CATEGORIES = ["Salon", "Home Cleaning", "Plumbing", "Electrical", "AC Repair", "Pest Control", "Painting", "Carpentry", "Appliance Repair", "Beauty & Spa"];

const PRESET_IMAGES = [
  { label: "Salon & Spa", url: "/services/spa-massage.jpg" },
  { label: "Bridal Makeup", url: "/services/bridal-makeup.jpg" },
  { label: "Home Cleaning", url: "/services/home-cleaning.jpg" },
  { label: "Plumbing Repair", url: "/services/plumbing-repair.jpg" },
  { label: "AC Repair & Jet", url: "/services/ac-repair.jpg" },
  { label: "Electrical Wiring", url: "/services/electrical-repair.jpg" },
];

const INITIAL_SERVICE_FORM = {
  title: "",
  category: "Home Cleaning",
  vendor: "",
  price: "",
  priceType: "fixed",
  duration: 60,
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400001",
  image: "/services/home-cleaning.jpg",
  description: "",
  tags: ""
};

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterApproved, setFilterApproved] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedService, setSelectedService] = useState(null);

  // Add Service Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(INITIAL_SERVICE_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const [creating, setCreating] = useState(false);

  useEffect(() => { 
    fetchServices(); 
  }, [filterApproved, selectedCategory, searchTerm, page]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 30 });
      if (filterApproved !== "all") params.set("approved", filterApproved);
      if (selectedCategory !== "All") params.set("category", selectedCategory);
      if (searchTerm.trim()) params.set("search", searchTerm.trim());

      const { data } = await api.get(`/admin/services?${params}`);
      setServices(data.services || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error("Failed to load services");
    } finally { 
      setLoading(false); 
    }
  };

  const fetchVendors = async () => {
    try {
      const { data } = await api.get("/admin/users?role=vendor&limit=50");
      setVendors(data.users || []);
      if (data.users?.length > 0) {
        setAddForm(prev => ({ ...prev, vendor: data.users[0]._id }));
      }
    } catch {}
  };

  const approveService = async (serviceId, approve) => {
    try {
      await api.put(`/admin/services/${serviceId}/approve`, { approve });
      toast.success(`Service ${approve ? "approved & live" : "rejected"}!`);
      if (selectedService && selectedService._id === serviceId) {
        setSelectedService((prev) => ({ ...prev, isApproved: approve }));
      }
      fetchServices();
    } catch { 
      toast.error("Action failed"); 
    }
  };

  const toggleFeatured = async (service) => {
    try {
      const updatedStatus = !service.isFeatured;
      await api.put(`/services/${service._id}`, { isFeatured: updatedStatus });
      toast.success(`Service ${updatedStatus ? "marked as Featured ⭐" : "removed from Featured"}`);
      if (selectedService && selectedService._id === service._id) {
        setSelectedService((prev) => ({ ...prev, isFeatured: updatedStatus }));
      }
      fetchServices();
    } catch {
      toast.error("Failed to update featured status");
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to permanently delete this service?")) return;
    try {
      await api.delete(`/services/${serviceId}`);
      toast.success("Service deleted permanently!");
      if (selectedService?._id === serviceId) setSelectedService(null);
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete service");
    }
  };

  const validateServiceField = (name, value) => {
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
      case "city":
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

  const validateServiceForm = () => {
    const errs = {};
    const tErr = validateServiceField("title", addForm.title);
    if (tErr) errs.title = tErr;
    const pErr = validateServiceField("price", addForm.price);
    if (pErr) errs.price = pErr;
    const dErr = validateServiceField("duration", addForm.duration);
    if (dErr) errs.duration = dErr;
    const cErr = validateServiceField("city", addForm.city);
    if (cErr) errs.city = cErr;
    const descErr = validateServiceField("description", addForm.description);
    if (descErr) errs.description = descErr;

    setFormErrors(errs);
    setFormTouched({ title: true, price: true, duration: true, city: true, description: true });
    return Object.keys(errs).length === 0;
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!validateServiceForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setCreating(true);
    try {
      const chosenImage = addForm.image || CATEGORY_IMAGE_MAP[addForm.category] || "/services/home-cleaning.jpg";
      const payload = {
        title: addForm.title.trim(),
        description: addForm.description.trim(),
        category: addForm.category,
        vendor: addForm.vendor || (vendors[0]?._id),
        price: Number(addForm.price),
        priceType: addForm.priceType,
        duration: Number(addForm.duration) || 60,
        location: {
          city: addForm.city.trim(),
          state: addForm.state || "Maharashtra",
          pincode: addForm.pincode || "400001",
        },
        images: [chosenImage],
        tags: addForm.tags ? addForm.tags.split(",").map(t => t.trim()).filter(Boolean) : [addForm.category.toLowerCase()],
        isApproved: true,
        isActive: true
      };

      await api.post("/services", payload);
      toast.success("New service added successfully with picture!");
      setShowAddModal(false);
      setAddForm({
        ...INITIAL_SERVICE_FORM,
        vendor: vendors[0]?._id || ""
      });
      setFormErrors({});
      setFormTouched({});
      fetchServices();
    } catch (err) {
      if (err.response?.data?.errors) {
        const backendErrs = {};
        for (const [key, msg] of Object.entries(err.response.data.errors)) {
          const shortKey = key.replace("location.", "");
          backendErrs[shortKey] = msg;
        }
        setFormErrors(backendErrs);
        setFormTouched(prev => ({ ...prev, ...backendErrs }));
      }
      toast.error(err.response?.data?.message || "Failed to create service");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-page">
        <div className="container">
          {/* Header */}
          <div className="dashboard-header" style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span>Service Catalog Management</span>
                <span className="badge badge-purple" style={{ fontSize: 13 }}>Admin</span>
              </h1>
              <p className="text-muted">
                Inspect, review pictures, add new services directly, approve or feature platform listings
              </p>
            </div>
            
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddModal(true)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px" }}
              >
                <FiPlus size={18} /> Add New Service
              </button>

              <div className="stat-pill" style={{ background: "var(--surface2)", padding: "8px 16px", borderRadius: "var(--radius)", border: "1px solid var(--border2)" }}>
                <span className="text-muted text-sm">Total: </span>
                <strong style={{ color: "var(--primary)" }}>{total}</strong>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="card" style={{ marginBottom: 24, padding: "16px 20px" }}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
              {/* Search */}
              <div className="input-with-icon" style={{ flex: "1 1 260px", position: "relative" }}>
                <FiSearch style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: 42 }} 
                  placeholder="Search by service title, vendor, or city..."
                  value={searchTerm} 
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} 
                />
              </div>

              {/* Status Filter */}
              <div className="status-filter-tabs" style={{ marginBottom: 0 }}>
                {[
                  { val: "all", label: "All Status" }, 
                  { val: "false", label: "⏳ Pending Approval" }, 
                  { val: "true", label: "✓ Approved" }
                ].map((t) => (
                  <button 
                    key={t.val} 
                    className={`status-filter-tab ${filterApproved === t.val ? "status-tab-active" : ""}`}
                    onClick={() => { setFilterApproved(t.val); setPage(1); }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Chips */}
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
              <span className="text-muted text-sm" style={{ fontWeight: 600, marginRight: 4 }}>Category:</span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setPage(1); }}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    border: "1px solid",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: selectedCategory === cat ? "var(--primary)" : "var(--surface2)",
                    color: selectedCategory === cat ? "#fff" : "var(--text-muted)",
                    borderColor: selectedCategory === cat ? "var(--primary)" : "var(--border2)"
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Services List with Pictures */}
          {loading ? (
            <div className="loading-page"><div className="spinner" /></div>
          ) : services.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">🔍</div>
              <h3>No matching services found</h3>
              <p className="text-muted">Try changing your search terms or filters</p>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowAddModal(true)}>
                <FiPlus /> Add First Service
              </button>
            </div>
          ) : (
            <div className="admin-services-list">
              {services.map((service) => {
                const serviceImg = service.images?.[0] || CATEGORY_IMAGE_MAP[service.category] || "/services/home-cleaning.jpg";
                const freeSlots = service.slots?.filter(s => !s.isBooked)?.length || 0;
                
                return (
                  <div key={service._id} className="card service-admin-card" style={{ padding: 18 }}>
                    {/* Picture Thumbnail with Zoom Preview Button */}
                    <div 
                      className="service-admin-media"
                      style={{
                        position: "relative",
                        width: 170,
                        minWidth: 170,
                        height: 125,
                        borderRadius: 12,
                        overflow: "hidden",
                        border: "1px solid var(--border2)",
                        background: "var(--surface2)",
                        cursor: "pointer"
                      }}
                      onClick={() => setSelectedService(service)}
                      title="Click to view full picture and details"
                    >
                      <img 
                        src={serviceImg} 
                        alt={service.title} 
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease"
                        }}
                        onError={(e) => {
                          e.currentTarget.src = "/services/home-cleaning.jpg";
                        }}
                      />
                      <div 
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(15, 23, 42, 0.4)",
                          opacity: 0,
                          transition: "opacity 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 600
                        }}
                        className="service-img-overlay"
                      >
                        <FiEye size={16} /> View
                      </div>
                      {service.isFeatured && (
                        <span 
                          style={{
                            position: "absolute",
                            top: 6,
                            left: 6,
                            background: "rgba(245, 158, 11, 0.9)",
                            color: "#fff",
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: 4,
                            backdropFilter: "blur(4px)"
                          }}
                        >
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    {/* Service Info & Details */}
                    <div className="service-admin-info" style={{ flex: 1 }}>
                      {/* Top Badges */}
                      <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <span className="badge badge-purple">{service.category}</span>
                        <span className={`badge ${service.isApproved ? "badge-success" : "badge-warning"}`}>
                          {service.isApproved ? "✓ Approved & Active" : "⏳ Pending Approval"}
                        </span>
                        {service.priceType === "starting_from" && (
                          <span className="badge badge-info">Starting Price</span>
                        )}
                      </div>

                      {/* Title & Vendor */}
                      <h3 
                        className="font-semibold" 
                        style={{ fontSize: 18, marginBottom: 4, cursor: "pointer", color: "var(--text)" }}
                        onClick={() => setSelectedService(service)}
                      >
                        {service.title}
                      </h3>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div className="avatar-xs" style={{ width: 22, height: 22, fontSize: 11 }}>
                            {service.vendor?.name?.[0] || "V"}
                          </div>
                          <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                            {service.vendor?.businessName || service.vendor?.name}
                          </span>
                        </div>
                        {service.location?.city && (
                          <span className="text-sm text-muted" style={{ display: "flex", alignItems: "center", gap: 3 }}>
                            <FiMapPin size={13} color="var(--primary)" /> {service.location.city}
                          </span>
                        )}
                        <span className="text-sm text-muted" style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <FiClock size={13} /> {service.duration || 60} mins
                        </span>
                      </div>

                      {/* Meta Stats Badges Row */}
                      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>
                          ₹{service.price?.toLocaleString()}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#f59e0b", fontWeight: 600 }}>
                          <FiStar size={14} fill="#f59e0b" color="#f59e0b" />
                          <span>{service.rating?.toFixed(1) || "5.0"}</span>
                          <span className="text-muted" style={{ fontWeight: 400 }}>({service.totalReviews || 0} reviews)</span>
                        </div>
                        <div className="text-muted text-sm" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span>📦 {service.totalBookings || 0} bookings</span>
                        </div>
                        <div className="text-muted text-sm" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <FiCalendar size={13} color="var(--success)" />
                          <span>{freeSlots} available slots</span>
                        </div>
                      </div>

                      {/* Description Preview */}
                      <p className="text-muted text-sm" style={{ lineHeight: 1.5, marginBottom: 8 }}>
                        {service.description?.slice(0, 140)}...
                      </p>

                      {/* Tags */}
                      {service.tags?.length > 0 && (
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {service.tags.map((tag) => (
                            <span 
                              key={tag} 
                              style={{ 
                                fontSize: 11, 
                                background: "rgba(255,255,255,0.04)", 
                                border: "1px solid var(--border)", 
                                padding: "2px 8px", 
                                borderRadius: 4, 
                                color: "var(--text-dim)" 
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions Panel */}
                    <div className="service-admin-actions" style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 150 }}>
                      {/* View Details Button */}
                      <button 
                        className="btn btn-outline btn-sm w-full"
                        onClick={() => setSelectedService(service)}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                      >
                        <FiEye size={14} /> Full Details
                      </button>

                      {/* View Live Customer Page */}
                      <Link 
                        to={`/services/${service._id}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn btn-outline btn-sm w-full"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12 }}
                      >
                        <FiExternalLink size={13} /> View Live <span style={{ opacity: 0.6 }}>↗</span>
                      </Link>

                      {/* Approval Toggle */}
                      {!service.isApproved ? (
                        <button 
                          className="btn btn-primary btn-sm w-full" 
                          onClick={() => approveService(service._id, true)}
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                        >
                          <FiCheck size={14} /> Approve
                        </button>
                      ) : (
                        <button 
                          className="btn btn-outline btn-sm w-full" 
                          onClick={() => approveService(service._id, false)}
                          style={{ color: "var(--danger)", borderColor: "rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                        >
                          <FiX size={14} /> Reject
                        </button>
                      )}

                      {/* Feature Toggle */}
                      <button 
                        className="btn btn-outline btn-sm w-full" 
                        onClick={() => toggleFeatured(service)}
                        style={{ 
                          fontSize: 12,
                          color: service.isFeatured ? "#f59e0b" : "var(--text-muted)", 
                          borderColor: service.isFeatured ? "rgba(245,158,11,0.4)" : "var(--border2)" 
                        }}
                      >
                        {service.isFeatured ? "⭐ Featured" : "☆ Make Feature"}
                      </button>

                      {/* Delete Service */}
                      <button 
                        className="btn btn-outline btn-sm w-full"
                        onClick={() => handleDeleteService(service._id)}
                        style={{ color: "var(--danger)", borderColor: "rgba(239,68,68,0.25)", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                      >
                        <FiTrash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ADD NEW SERVICE MODAL */}
          {showAddModal && (
            <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
              <div 
                className="modal" 
                style={{ maxWidth: 700, maxHeight: "90vh", overflowY: "auto" }} 
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800 }}>Add New Service (Admin)</h2>
                    <p className="text-muted text-sm">Directly publish a new verified service to the platform catalog</p>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(false)} 
                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                  >
                    <FiX size={22} />
                  </button>
                </div>

                <form onSubmit={handleCreateService}>
                  <div className="grid-2">
                    {/* Title */}
                    <div className="form-group">
                      <label className="form-label">Service Title *</label>
                      <input 
                        type="text" 
                        className={`form-input ${formTouched.title && formErrors.title ? "input-error" : ""}`} 
                        required 
                        value={addForm.title} 
                        onChange={e => {
                          const val = e.target.value;
                          setAddForm({ ...addForm, title: val });
                          if (formTouched.title) setFormErrors(prev => ({ ...prev, title: validateServiceField("title", val) }));
                        }} 
                        onBlur={() => {
                          setFormTouched(prev => ({ ...prev, title: true }));
                          setFormErrors(prev => ({ ...prev, title: validateServiceField("title", addForm.title) }));
                        }}
                        placeholder="e.g. Ultra HD Bridal Styling & Makeup" 
                      />
                      {formTouched.title && formErrors.title && (
                        <div className="field-error-msg">
                          <FiAlertCircle size={13} />
                          <span>{formErrors.title}</span>
                        </div>
                      )}
                    </div>

                    {/* Category */}
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select 
                        className="form-select" 
                        required 
                        value={addForm.category} 
                        onChange={e => {
                          const cat = e.target.value;
                          setAddForm({ 
                            ...addForm, 
                            category: cat,
                            image: CATEGORY_IMAGE_MAP[cat] || "/services/home-cleaning.jpg"
                          });
                        }}
                      >
                        {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {/* Assign to Vendor */}
                    <div className="form-group">
                      <label className="form-label">Assign to Vendor *</label>
                      <select 
                        className="form-select" 
                        required 
                        value={addForm.vendor} 
                        onChange={e => setAddForm({ ...addForm, vendor: e.target.value })}
                      >
                        {vendors.map(v => (
                          <option key={v._id} value={v._id}>
                            {v.businessName || v.name} ({v.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price & Price Type */}
                    <div className="form-group">
                      <label className="form-label">Price (₹) & Type *</label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input 
                          type="number" 
                          className={`form-input ${formTouched.price && formErrors.price ? "input-error" : ""}`} 
                          required 
                          min={1}
                          value={addForm.price} 
                          onChange={e => {
                            const val = e.target.value;
                            setAddForm({ ...addForm, price: val });
                            if (formTouched.price) setFormErrors(prev => ({ ...prev, price: validateServiceField("price", val) }));
                          }} 
                          onBlur={() => {
                            setFormTouched(prev => ({ ...prev, price: true }));
                            setFormErrors(prev => ({ ...prev, price: validateServiceField("price", addForm.price) }));
                          }}
                          placeholder="Price"
                          style={{ flex: 1 }}
                        />
                        <select 
                          className="form-select" 
                          value={addForm.priceType} 
                          onChange={e => setAddForm({ ...addForm, priceType: e.target.value })}
                          style={{ width: 140 }}
                        >
                          <option value="fixed">Fixed</option>
                          <option value="starting_from">From</option>
                          <option value="hourly">Hourly</option>
                        </select>
                      </div>
                      {formTouched.price && formErrors.price && (
                        <div className="field-error-msg">
                          <FiAlertCircle size={13} />
                          <span>{formErrors.price}</span>
                        </div>
                      )}
                    </div>

                    {/* Duration */}
                    <div className="form-group">
                      <label className="form-label">Duration (Minutes) *</label>
                      <input 
                        type="number" 
                        className={`form-input ${formTouched.duration && formErrors.duration ? "input-error" : ""}`} 
                        value={addForm.duration} 
                        onChange={e => {
                          const val = e.target.value;
                          setAddForm({ ...addForm, duration: val });
                          if (formTouched.duration) setFormErrors(prev => ({ ...prev, duration: validateServiceField("duration", val) }));
                        }} 
                        onBlur={() => {
                          setFormTouched(prev => ({ ...prev, duration: true }));
                          setFormErrors(prev => ({ ...prev, duration: validateServiceField("duration", addForm.duration) }));
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

                    {/* City & State */}
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input 
                        type="text" 
                        className={`form-input ${formTouched.city && formErrors.city ? "input-error" : ""}`} 
                        required 
                        value={addForm.city} 
                        onChange={e => {
                          const val = e.target.value;
                          setAddForm({ ...addForm, city: val });
                          if (formTouched.city) setFormErrors(prev => ({ ...prev, city: validateServiceField("city", val) }));
                        }} 
                        onBlur={() => {
                          setFormTouched(prev => ({ ...prev, city: true }));
                          setFormErrors(prev => ({ ...prev, city: validateServiceField("city", addForm.city) }));
                        }}
                        placeholder="e.g. Mumbai" 
                      />
                      {formTouched.city && formErrors.city && (
                        <div className="field-error-msg">
                          <FiAlertCircle size={13} />
                          <span>{formErrors.city}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Picture / Image Selector */}
                  <div className="form-group">
                    <label className="form-label">Service Picture / Photo *</label>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={addForm.image} 
                        onChange={e => setAddForm({ ...addForm, image: e.target.value })} 
                        placeholder="Picture URL (e.g. /services/spa-massage.jpg or https://...)" 
                        style={{ flex: 1 }}
                      />
                      <div style={{ width: 60, height: 44, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)", flexShrink: 0 }}>
                        <img 
                          src={addForm.image || "/services/home-cleaning.jpg"} 
                          alt="preview" 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                          onError={e => { e.currentTarget.src = "/services/home-cleaning.jpg"; }}
                        />
                      </div>
                    </div>

                    {/* Preset Photo Quick Pickers */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      <span className="text-muted text-xs">Quick Photo Presets:</span>
                      {PRESET_IMAGES.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setAddForm({ ...addForm, image: preset.url })}
                          style={{
                            padding: "3px 10px",
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            border: "1px solid",
                            background: addForm.image === preset.url ? "var(--primary)" : "var(--surface2)",
                            color: addForm.image === preset.url ? "#fff" : "var(--text-muted)",
                            borderColor: addForm.image === preset.url ? "var(--primary)" : "var(--border2)"
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <label className="form-label" style={{ margin: 0 }}>Detailed Description *</label>
                      <span className="text-xs" style={{ color: addForm.description.length < 15 ? "var(--text-muted)" : "var(--success)" }}>
                        {addForm.description.length} / 15 chars min
                      </span>
                    </div>
                    <textarea 
                      className={`form-textarea ${formTouched.description && formErrors.description ? "input-error" : ""}`} 
                      rows={3} 
                      required 
                      value={addForm.description} 
                      onChange={e => {
                        const val = e.target.value;
                        setAddForm({ ...addForm, description: val });
                        if (formTouched.description) setFormErrors(prev => ({ ...prev, description: validateServiceField("description", val) }));
                      }} 
                      onBlur={() => {
                        setFormTouched(prev => ({ ...prev, description: true }));
                        setFormErrors(prev => ({ ...prev, description: validateServiceField("description", addForm.description) }));
                      }}
                      placeholder="Explain what is included in this service, procedure, tools used, and guarantees (min 15 characters)..."
                    />
                    {formTouched.description && formErrors.description && (
                      <div className="field-error-msg">
                        <FiAlertCircle size={13} />
                        <span>{formErrors.description}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="form-group">
                    <label className="form-label">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={addForm.tags} 
                      onChange={e => setAddForm({ ...addForm, tags: e.target.value })} 
                      placeholder="e.g. bridal, makeup, wedding, beauty" 
                    />
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
                    <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={creating}>
                      {creating ? <span className="spinner spinner-sm" /> : <><FiCheck /> Publish & Approve Service</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Service Details Modal */}
          {selectedService && (
            <div className="modal-overlay" onClick={() => setSelectedService(null)}>
              <div 
                className="modal" 
                style={{ maxWidth: 650, maxHeight: "90vh", overflowY: "auto" }} 
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                      <span className="badge badge-purple">{selectedService.category}</span>
                      <span className={`badge ${selectedService.isApproved ? "badge-success" : "badge-warning"}`}>
                        {selectedService.isApproved ? "✓ Approved" : "⏳ Pending"}
                      </span>
                      {selectedService.isFeatured && <span className="badge badge-warning">⭐ Featured</span>}
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 800 }}>{selectedService.title}</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedService(null)} 
                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Big Picture Display */}
                <div 
                  style={{ 
                    width: "100%", 
                    height: 260, 
                    borderRadius: 14, 
                    overflow: "hidden", 
                    marginBottom: 20, 
                    border: "1px solid var(--border2)",
                    background: "var(--surface2)" 
                  }}
                >
                  <img 
                    src={selectedService.images?.[0] || CATEGORY_IMAGE_MAP[selectedService.category] || "/services/home-cleaning.jpg"} 
                    alt={selectedService.title} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    onError={(e) => {
                      e.currentTarget.src = "/services/home-cleaning.jpg";
                    }}
                  />
                </div>

                {/* Key Details Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 20 }}>
                  <div className="card" style={{ padding: 14, background: "var(--surface2)" }}>
                    <div className="text-muted text-sm">Price</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginTop: 2 }}>
                      ₹{selectedService.price?.toLocaleString()}
                      <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 6 }}>
                        ({selectedService.priceType === "starting_from" ? "Starting at" : "Fixed"})
                      </span>
                    </div>
                  </div>

                  <div className="card" style={{ padding: 14, background: "var(--surface2)" }}>
                    <div className="text-muted text-sm">Duration & City</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginTop: 4 }}>
                      ⏱️ {selectedService.duration} min • 📍 {selectedService.location?.city || "All India"}
                    </div>
                  </div>

                  <div className="card" style={{ padding: 14, background: "var(--surface2)" }}>
                    <div className="text-muted text-sm">Vendor Details</div>
                    <div style={{ fontWeight: 700, marginTop: 4 }}>
                      {selectedService.vendor?.businessName || selectedService.vendor?.name}
                    </div>
                    <div className="text-muted text-sm">{selectedService.vendor?.email}</div>
                  </div>

                  <div className="card" style={{ padding: 14, background: "var(--surface2)" }}>
                    <div className="text-muted text-sm">Performance Stats</div>
                    <div style={{ display: "flex", gap: 12, marginTop: 4, alignItems: "center" }}>
                      <span style={{ color: "#f59e0b", fontWeight: 700 }}>
                        ★ {selectedService.rating?.toFixed(1) || "5.0"}
                      </span>
                      <span className="text-muted text-sm">
                        {selectedService.totalBookings || 0} Bookings
                      </span>
                      <span className="text-muted text-sm">
                        {selectedService.slots?.filter(s => !s.isBooked).length || 0} Slots
                      </span>
                    </div>
                  </div>
                </div>

                {/* Full Description */}
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Service Description
                  </h4>
                  <p style={{ lineHeight: 1.7, color: "var(--text)", background: "var(--surface2)", padding: 16, borderRadius: 10, border: "1px solid var(--border)" }}>
                    {selectedService.description}
                  </p>
                </div>

                {/* Tags */}
                {selectedService.tags?.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text-muted)" }}>Tags:</h4>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {selectedService.tags.map(t => (
                        <span key={t} className="badge badge-purple" style={{ fontSize: 12 }}>
                          <FiTag size={11} /> {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 16, flexWrap: "wrap", gap: 10 }}>
                  <Link 
                    to={`/services/${selectedService._id}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <FiExternalLink /> Open Public Page
                  </Link>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => toggleFeatured(selectedService)}
                    >
                      {selectedService.isFeatured ? "Unfeature" : "⭐ Feature"}
                    </button>

                    {!selectedService.isApproved ? (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => approveService(selectedService._id, true)}
                      >
                        <FiCheck /> Approve Service
                      </button>
                    ) : (
                      <button 
                        className="btn btn-outline btn-sm"
                        style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
                        onClick={() => approveService(selectedService._id, false)}
                      >
                        <FiX /> Revoke Approval
                      </button>
                    )}

                    <button 
                      className="btn btn-outline btn-sm"
                      style={{ color: "var(--danger)", borderColor: "rgba(239,68,68,0.3)" }}
                      onClick={() => handleDeleteService(selectedService._id)}
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
