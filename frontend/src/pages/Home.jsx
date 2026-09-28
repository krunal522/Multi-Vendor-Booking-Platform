import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../utils/api";
import { FiSearch, FiStar, FiChevronRight, FiArrowRight, FiCheck } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { 
  FaScissors, 
  FaBroom, 
  FaWrench, 
  FaBolt, 
  FaSnowflake, 
  FaBug, 
  FaPaintRoller, 
  FaHammer 
} from "react-icons/fa6";
import { getServiceImage } from "../utils/serviceImages";

const CATEGORIES = [
  { 
    name: "Salon", 
    Icon: FaScissors, 
    color: "#f43f5e", 
    gradient: "linear-gradient(135deg, rgba(244,63,94,0.24) 0%, rgba(236,72,153,0.08) 100%)",
    border: "rgba(244,63,94,0.32)",
    glow: "rgba(244,63,94,0.38)",
  },
  { 
    name: "Home Cleaning", 
    Icon: FaBroom, 
    color: "#06b6d4", 
    gradient: "linear-gradient(135deg, rgba(6,182,212,0.24) 0%, rgba(14,165,233,0.08) 100%)",
    border: "rgba(6,182,212,0.32)",
    glow: "rgba(6,182,212,0.38)",
  },
  { 
    name: "Plumbing", 
    Icon: FaWrench, 
    color: "#f59e0b", 
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.24) 0%, rgba(217,119,6,0.08) 100%)",
    border: "rgba(245,158,11,0.32)",
    glow: "rgba(245,158,11,0.38)",
  },
  { 
    name: "Electrical", 
    Icon: FaBolt, 
    color: "#818cf8", 
    gradient: "linear-gradient(135deg, rgba(99,102,241,0.24) 0%, rgba(139,92,246,0.08) 100%)",
    border: "rgba(99,102,241,0.32)",
    glow: "rgba(99,102,241,0.38)",
  },
  { 
    name: "AC Repair", 
    Icon: FaSnowflake, 
    color: "#38bdf8", 
    gradient: "linear-gradient(135deg, rgba(56,189,248,0.24) 0%, rgba(6,182,212,0.08) 100%)",
    border: "rgba(56,189,248,0.32)",
    glow: "rgba(56,189,248,0.38)",
  },
  { 
    name: "Pest Control", 
    Icon: FaBug, 
    color: "#10b981", 
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.24) 0%, rgba(5,150,105,0.08) 100%)",
    border: "rgba(16,185,129,0.32)",
    glow: "rgba(16,185,129,0.38)",
  },
  { 
    name: "Painting", 
    Icon: FaPaintRoller, 
    color: "#c084fc", 
    gradient: "linear-gradient(135deg, rgba(168,85,247,0.24) 0%, rgba(139,92,246,0.08) 100%)",
    border: "rgba(168,85,247,0.32)",
    glow: "rgba(168,85,247,0.38)",
  },
  { 
    name: "Carpentry", 
    Icon: FaHammer, 
    color: "#fb923c", 
    gradient: "linear-gradient(135deg, rgba(251,146,60,0.24) 0%, rgba(234,88,12,0.08) 100%)",
    border: "rgba(251,146,60,0.32)",
    glow: "rgba(251,146,60,0.38)",
  },
];

const STATS = [
  { value: "50K+", label: "Happy Customers" },
  { value: "2K+", label: "Verified Vendors" },
  { value: "100+", label: "Cities Covered" },
  { value: "4.8★", label: "Average Rating" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Search & Discover", desc: "Find trusted professionals near you. Filter by category, price, ratings and availability.", icon: "🔍" },
  { step: "02", title: "Book a Slot", desc: "Choose your preferred date and time slot. Instant confirmation with no waiting.", icon: "📅" },
  { step: "03", title: "Pay Securely", desc: "Pay online via Razorpay or choose cash on service. 100% secure transactions.", icon: "💳" },
  { step: "04", title: "Get Service", desc: "Professional arrives on time. Rate your experience after service completion.", icon: "⭐" },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const { data } = await api.get("/services/featured");
      setFeaturedServices(data.services || []);
    } catch {
      setFeaturedServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (city) params.set("city", city);
    navigate(`/services?${params.toString()}`);
  };

  const handleCategoryClick = (cat) => {
    navigate(`/services?category=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-orb hero-orb-1" />
        <div className="hero-bg-orb hero-orb-2" />
        <div className="hero-bg-orb hero-orb-3" />
        <div className="container hero-content">
          <div className="hero-badge">
            <MdVerified color="#6366f1" /> &nbsp;India's Most Trusted Service Platform
          </div>
          <h1 className="hero-title">
            Book Home Services
            <span className="hero-title-gradient"> In Minutes</span>
          </h1>
          <p className="hero-subtitle">
            Discover verified professionals for salon, cleaning, plumbing, electrical and 50+ more services. 
            Instant booking, secure payments, guaranteed satisfaction.
          </p>

          {/* Search Bar */}
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-field">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for services (e.g. AC repair, salon...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="hero-search-divider" />
            <div className="hero-search-field">
              <span className="search-icon">📍</span>
              <input
                type="text"
                placeholder="Your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="search-input hero-city-input"
              />
            </div>
            <button type="submit" className="btn btn-primary hero-search-btn">
              Search <FiArrowRight />
            </button>
          </form>

          {/* Quick Search Tags */}
          <div className="hero-tags">
            {["Salon", "AC Repair", "Home Cleaning", "Plumbing", "Electrical"].map((tag) => (
              <button key={tag} className="hero-tag" onClick={() => handleCategoryClick(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {STATS.map((s) => (
              <div key={s.label} className="stat-item">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Browse by Category</h2>
              <p className="section-subtitle">Explore services across all home & personal care categories</p>
            </div>
            <Link to="/services" className="btn btn-outline btn-sm">
              View All <FiChevronRight />
            </Link>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => {
              const IconComponent = cat.Icon;
              return (
                <button
                  key={cat.name}
                  className="category-card"
                  style={{
                    "--cat-color": cat.color,
                    "--cat-glow": cat.glow,
                  }}
                  onClick={() => handleCategoryClick(cat.name)}
                >
                  <div
                    className="category-icon-wrapper"
                    style={{
                      background: cat.gradient,
                      borderColor: cat.border,
                    }}
                  >
                    <IconComponent className="category-vector-icon" style={{ color: cat.color }} />
                  </div>
                  <span className="category-name">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Services</h2>
              <p className="section-subtitle">Top-rated services handpicked for you</p>
            </div>
            <Link to="/services" className="btn btn-outline btn-sm">
              See All <FiChevronRight />
            </Link>
          </div>
          {loading ? (
            <div className="loading-page"><div className="spinner" /></div>
          ) : (
            <div className="services-grid">
              {featuredServices.slice(0, 6).map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it Works */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <h2 className="section-title">How ServeBook Works</h2>
            <p className="section-subtitle">Book any service in 4 simple steps</p>
          </div>
          <div className="how-grid">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="how-card">
                {i < HOW_IT_WORKS.length - 1 && <div className="how-connector" />}
                <div className="how-step-num">{step.step}</div>
                <div className="how-icon">{step.icon}</div>
                <h3 className="how-title">{step.title}</h3>
                <p className="how-desc text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="vendor-cta">
        <div className="container">
          <div className="vendor-cta-content">
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
                Are you a service professional?
              </h2>
              <p className="text-muted" style={{ fontSize: 16, marginBottom: 24, maxWidth: 500 }}>
                Join 2000+ vendors on ServeBook. Grow your business, manage bookings, and earn more with our platform.
              </p>
              <div className="vendor-benefits">
                {["Zero commission on first 50 bookings", "Real-time booking notifications", "Weekly payouts", "Dedicated support"].map(b => (
                  <div key={b} className="vendor-benefit">
                    <FiCheck color="#10b981" /> {b}
                  </div>
                ))}
              </div>
              <div className="vendor-cta-buttons">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Register as Vendor <FiArrowRight />
                </Link>
                <Link to="/services" className="btn btn-outline btn-lg">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="vendor-cta-visual">
              <div className="vendor-stat-card">
                <div className="vendor-stat">₹45,000</div>
                <div className="text-muted text-sm">Avg Monthly Earning</div>
              </div>
              <div className="vendor-stat-card">
                <div className="vendor-stat">340+</div>
                <div className="text-muted text-sm">Bookings / Month</div>
              </div>
              <div className="vendor-stat-card">
                <div className="vendor-stat">4.8★</div>
                <div className="text-muted text-sm">Avg Vendor Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ServiceCard({ service }) {
  const stars = Math.round(service.rating || 0);
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
            <span className="price-type">{service.priceType === "starting_from" ? "From" : ""}</span>
            ₹{service.price?.toLocaleString()}
          </div>
          <div className="service-card-rating">
            <FiStar fill="#f59e0b" color="#f59e0b" size={13} />
            <span>{service.rating?.toFixed(1) || "New"}</span>
            <span className="text-muted text-sm">({service.totalReviews})</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
