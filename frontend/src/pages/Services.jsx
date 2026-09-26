import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../utils/api";
import { FiSearch, FiStar, FiFilter, FiX, FiSliders, FiClock } from "react-icons/fi";
import { getServiceImage } from "../utils/serviceImages";

const CATEGORIES = ["Salon", "Home Cleaning", "Plumbing", "Electrical", "AC Repair", "Pest Control", "Painting", "Carpentry", "Appliance Repair", "Beauty & Spa"];
const SORT_OPTIONS = [
  { value: "", label: "Best Match" },
  { value: "rating", label: "Top Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
];

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    city: searchParams.get("city") || "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    sort: "",
    page: 1,
  });

  useEffect(() => {
    fetchServices();
  }, [filters]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      const { data } = await api.get(`/services?${params.toString()}`);
      setServices(data.services || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ search: "", category: "", city: "", minPrice: "", maxPrice: "", rating: "", sort: "", page: 1 });
  };

  const activeFiltersCount = [filters.category, filters.city, filters.minPrice, filters.maxPrice, filters.rating].filter(Boolean).length;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="services-page">
        {/* Page Header */}
        <div className="page-hero">
          <div className="container">
            <h1 className="page-title">Find Services</h1>
            <p className="text-muted">Discover {total}+ verified services near you</p>
          </div>
        </div>

        <div className="container services-layout">
          {/* Sidebar Filters */}
          <aside className={`filters-sidebar ${showFilters ? "filters-open" : ""}`}>
            <div className="filters-header">
              <span className="font-semibold">Filters {activeFiltersCount > 0 && <span className="badge badge-purple">{activeFiltersCount}</span>}</span>
              {activeFiltersCount > 0 && (
                <button className="text-sm" style={{ color: "var(--danger)", background: "none", border: "none", cursor: "pointer" }} onClick={clearFilters}>
                  Clear all
                </button>
              )}
              <button className="filters-close" onClick={() => setShowFilters(false)}><FiX /></button>
            </div>

            <div className="filter-group">
              <label className="filter-label">Category</label>
              {CATEGORIES.map((cat) => (
                <button key={cat} className={`filter-chip ${filters.category === cat ? "filter-chip-active" : ""}`}
                  onClick={() => updateFilter("category", filters.category === cat ? "" : cat)}>
                  {cat}
                </button>
              ))}
            </div>

            <div className="filter-group">
              <label className="filter-label">City</label>
              <input type="text" className="form-input" placeholder="e.g. Mumbai" value={filters.city}
                onChange={(e) => updateFilter("city", e.target.value)} />
            </div>

            <div className="filter-group">
              <label className="filter-label">Price Range (₹)</label>
              <div className="price-range">
                <input type="number" className="form-input" placeholder="Min" value={filters.minPrice}
                  onChange={(e) => updateFilter("minPrice", e.target.value)} />
                <span>—</span>
                <input type="number" className="form-input" placeholder="Max" value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)} />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Minimum Rating</label>
              {[4, 3, 2].map((r) => (
                <button key={r} className={`filter-chip ${filters.rating === String(r) ? "filter-chip-active" : ""}`}
                  onClick={() => updateFilter("rating", filters.rating === String(r) ? "" : String(r))}>
                  {"⭐".repeat(r)} & above
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="services-main">
            {/* Search & Sort Bar */}
            <div className="services-topbar">
              <div className="services-search-wrap">
                <FiSearch className="input-icon" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 42 }}
                  placeholder="Search services..."
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                />
              </div>
              <div className="services-sort-wrap" style={{ position: "relative", minWidth: 190, maxWidth: 220 }}>
                <select 
                  className="form-select" 
                  value={filters.sort} 
                  onChange={(e) => updateFilter("sort", e.target.value)}
                  style={{ height: 44, fontSize: 14 }}
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setShowFilters(true)} style={{ height: 44, padding: "0 18px" }}>
                <FiSliders /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
            </div>

            {/* Active filter chips */}
            {activeFiltersCount > 0 && (
              <div className="active-filters">
                {filters.category && <span className="filter-tag">{filters.category} <button onClick={() => updateFilter("category", "")}>×</button></span>}
                {filters.city && <span className="filter-tag">📍 {filters.city} <button onClick={() => updateFilter("city", "")}>×</button></span>}
                {filters.rating && <span className="filter-tag">⭐ {filters.rating}+ <button onClick={() => updateFilter("rating", "")}>×</button></span>}
              </div>
            )}

            {/* Results count */}
            <div className="results-count text-muted text-sm">
              {loading ? "Loading..." : `${total} service${total !== 1 ? "s" : ""} found`}
            </div>

            {/* Services Grid */}
            {loading ? (
              <div className="loading-page"><div className="spinner" /></div>
            ) : services.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No services found</h3>
                <p className="text-muted">Try adjusting your filters or search terms</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <div className="services-grid">
                {services.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="pagination">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={`page-btn ${filters.page === p ? "page-btn-active" : ""}`}
                    onClick={() => setFilters((prev) => ({ ...prev, page: p }))}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ServiceCard({ service }) {
  const imageUrl = getServiceImage(service);
  return (
    <Link to={`/services/${service._id}`} className="service-card">
      <div className="service-card-img">
        <img 
          src={imageUrl} 
          alt={service.title} 
          onError={(e) => {
            e.currentTarget.src = "/services/home-cleaning.jpg";
          }}
        />
        {service.isFeatured && <span className="featured-badge">⭐ Featured</span>}
      </div>
      <div className="service-card-body">
        <div className="service-card-cat">{service.category}</div>
        <h3 className="service-card-title">{service.title}</h3>
        <div className="service-card-vendor">
          <div className="avatar-xs">{service.vendor?.name?.[0]}</div>
          {service.vendor?.businessName || service.vendor?.name}
        </div>
        <div className="service-card-footer">
          <div className="service-card-price">
            <span className="price-type">{service.priceType === "starting_from" ? "From " : ""}</span>
            ₹{service.price?.toLocaleString()}
          </div>
          <div className="service-card-rating">
            <FiStar fill="#f59e0b" color="#f59e0b" size={13} />
            <span>{service.rating?.toFixed(1) || "New"}</span>
            <span className="text-muted text-sm">({service.totalReviews})</span>
          </div>
        </div>
        <div className="service-card-meta">
          <span className="text-muted text-sm"><FiClock size={12} /> {service.duration} min</span>
          <span className="text-muted text-sm">📍 {service.location?.city}</span>
        </div>
      </div>
    </Link>
  );
}
