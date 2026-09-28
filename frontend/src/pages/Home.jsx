import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../utils/api";
import { 
  FiSearch, 
  FiStar, 
  FiChevronRight, 
  FiArrowRight, 
  FiCheck,
  FiShield,
  FiAward,
  FiZap,
  FiHeadphones,
  FiClock,
  FiCopy,
  FiCheckCircle
} from "react-icons/fi";
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

const GUARANTEES = [
  {
    icon: FiShield,
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.25)",
    title: "100% Verified Experts",
    desc: "Every technician undergoes rigorous 7-level background check, police verification, and trade skill testing.",
  },
  {
    icon: FiAward,
    color: "#6366f1",
    bg: "rgba(99, 102, 241, 0.12)",
    border: "rgba(99, 102, 241, 0.25)",
    title: "Transparent Fixed Pricing",
    desc: "Fixed upfront rate card. No unexpected price hikes or hidden doorstep fees — pay only what you confirm.",
  },
  {
    icon: FiZap,
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.25)",
    title: "30-Min Rapid Arrival",
    desc: "Instant live slot dispatch with GPS arrival tracking. On-time doorstep arrival guaranteed every time.",
  },
  {
    icon: FiHeadphones,
    color: "#06b6d4",
    bg: "rgba(6, 182, 212, 0.12)",
    border: "rgba(6, 182, 212, 0.25)",
    title: "30-Day Protection Cover",
    desc: "Hassle-free 30-day warranty on all services. Free re-work or 100% money-back if you're not fully delighted.",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Search & Discover", desc: "Find trusted professionals near you. Filter by category, price, ratings and availability.", icon: "🔍" },
  { step: "02", title: "Book a Slot", desc: "Choose your preferred date and time slot. Instant confirmation with no waiting.", icon: "📅" },
  { step: "03", title: "Pay Securely", desc: "Pay online via Razorpay, UPI, or cash on service. 100% secure transactions.", icon: "💳" },
  { step: "04", title: "Get Service", desc: "Professional arrives on time. Rate your experience after service completion.", icon: "⭐" },
];

const TESTIMONIALS = [
  {
    name: "Pooja Sharma",
    city: "Mumbai",
    service: "Full Home Deep Cleaning",
    rating: 5,
    date: "Verified Booking",
    review: "Absolutely mindblowing experience! The cleaning crew came in uniform, used professional steam machines, and left my 3BHK sparkling clean without any mess.",
    initials: "PS",
    avatarBg: "linear-gradient(135deg, #ec4899, #f43f5e)",
  },
  {
    name: "Rahul Verma",
    city: "Bengaluru",
    service: "AC Jet Servicing & Gas Refill",
    rating: 5,
    date: "Verified Booking",
    review: "My split AC stopped cooling right in the summer peak. The technician arrived within 25 mins, diagnosed the clogged condenser, and washed it clean. Instant ice-cold air!",
    initials: "RV",
    avatarBg: "linear-gradient(135deg, #06b6d4, #3b82f6)",
  },
  {
    name: "Sneha Nair",
    city: "Delhi NCR",
    service: "Luxury Salon & Spa at Home",
    rating: 5,
    date: "Verified Booking",
    review: "Best salon service ever. Everything was ultra-hygienic, sealed mono-doses, and the beautician was polite & skillful. I will never step out into traffic for a salon again.",
    initials: "SN",
    avatarBg: "linear-gradient(135deg, #8b5cf6, #a855f7)",
  },
];

const POPULAR_CITIES = [
  "Mumbai",
  "Delhi NCR",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Ahmedabad"
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCopied, setCouponCopied] = useState(false);
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

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("city", selectedCity);
    navigate(`/services?${params.toString()}`);
  };

  const handleCopyCoupon = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("SERVE200");
    }
    setCouponCopied(true);
    setTimeout(() => setCouponCopied(false), 2400);
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
          {/* Live Activity Ticker Badge */}
          <div className="hero-live-pill">
            <span className="live-pulse-dot" />
            <span className="live-pill-text"><strong>2,480+</strong> bookings completed today</span>
            <span className="live-pill-divider">•</span>
            <span className="live-pill-rating">⭐ 4.9/5 TrustScore</span>
          </div>

          <div className="hero-badge">
            <MdVerified color="#6366f1" size={17} /> &nbsp;India's Most Trusted Multi-Vendor Service Platform
          </div>

          <h1 className="hero-title">
            Book Home Services
            <span className="hero-title-gradient"> In Minutes</span>
          </h1>
          <p className="hero-subtitle">
            Discover 2,000+ verified professionals for salon, cleaning, plumbing, electrical, and 50+ home services. 
            Instant booking, upfront pricing, 30-day quality guarantee.
          </p>

          {/* Search Bar */}
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-field">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for services (e.g. AC repair, salon, deep clean...)"
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

          {/* Popular Cities Pills */}
          <div className="hero-cities-row">
            <span className="hero-cities-label">Popular Cities:</span>
            <div className="hero-cities-list">
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`hero-city-tag ${city === c ? "active" : ""}`}
                  onClick={() => handleCitySelect(c)}
                >
                  📍 {c}
                </button>
              ))}
            </div>
          </div>

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
              <p className="section-subtitle">Explore curated services across all home & personal care categories</p>
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

      {/* Super Saver Promo Voucher Banner */}
      <section className="promo-section">
        <div className="container">
          <div className="promo-banner-card">
            <div className="promo-banner-glow" />
            <div className="promo-badge-tag">⚡ SPECIAL WELCOME OFFER</div>
            <div className="promo-content">
              <div className="promo-text-group">
                <h3 className="promo-title">Get Flat ₹200 OFF on Your First Booking</h3>
                <p className="promo-desc">
                  Applicable across all home cleaning, salon, pest control & repair services. Safe, verified doorstep delivery.
                </p>
              </div>
              <div className="promo-action-group">
                <button 
                  type="button" 
                  className={`coupon-box ${couponCopied ? "copied" : ""}`}
                  onClick={handleCopyCoupon}
                  title="Click to copy promo code"
                >
                  <span className="coupon-code">SERVE200</span>
                  <span className="coupon-action-badge">
                    {couponCopied ? (
                      <>
                        <FiCheckCircle size={13} /> Copied!
                      </>
                    ) : (
                      <>
                        <FiCopy size={13} /> Copy Code
                      </>
                    )}
                  </span>
                </button>
                <Link to="/services" className="btn btn-primary promo-btn">
                  Explore Services <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Services</h2>
              <p className="section-subtitle">Top-rated services handpicked for quality & satisfaction</p>
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

      {/* Enterprise Guarantees: Why ServeBook */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 44 }}>
            <div className="section-badge-pill">🛡️ THE SERVEBOOK PROMISE</div>
            <h2 className="section-title">Why 50,000+ Customers Trust Us</h2>
            <p className="section-subtitle">Unmatched safety, pricing transparency, and doorstep excellence</p>
          </div>
          <div className="guarantees-grid">
            {GUARANTEES.map((g) => {
              const IconComp = g.icon;
              return (
                <div 
                  key={g.title} 
                  className="guarantee-card"
                  style={{ "--g-color": g.color, "--g-bg": g.bg, "--g-border": g.border }}
                >
                  <div className="guarantee-icon-wrap" style={{ background: g.bg, borderColor: g.border }}>
                    <IconComp style={{ color: g.color }} size={24} />
                  </div>
                  <h3 className="guarantee-title">{g.title}</h3>
                  <p className="guarantee-desc text-muted">{g.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="section section-dark">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <h2 className="section-title">How ServeBook Works</h2>
            <p className="section-subtitle">Book any service in 4 simple frictionless steps</p>
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

      {/* Verified Customer Reviews */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 44 }}>
            <div className="section-badge-pill">⭐ VERIFIED REVIEWS</div>
            <h2 className="section-title">Loved by Real Homeowners</h2>
            <p className="section-subtitle">Real experiences shared by customers across India</p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-stars">
                    {[...Array(t.rating)].map((_, i) => (
                      <FiStar key={i} fill="#f59e0b" color="#f59e0b" size={15} />
                    ))}
                  </div>
                  <span className="testimonial-tag">{t.service}</span>
                </div>
                <p className="testimonial-text">“{t.review}”</p>
                <div className="testimonial-footer">
                  <div className="testimonial-avatar" style={{ background: t.avatarBg }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="testimonial-name">
                      {t.name} <MdVerified color="#38bdf8" size={14} title="Verified Customer" />
                    </div>
                    <div className="testimonial-meta">
                      📍 {t.city} • <span className="text-success">{t.date}</span>
                    </div>
                  </div>
                </div>
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
              <div className="section-badge-pill" style={{ display: "inline-flex", marginBottom: 12 }}>
                💼 PARTNER WITH SERVEBOOK
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
                Are you a service professional?
              </h2>
              <p className="text-muted" style={{ fontSize: 16, marginBottom: 24, maxWidth: 500 }}>
                Join 2,000+ verified service providers on ServeBook. Grow your client base, manage bookings, and increase your earnings.
              </p>
              <div className="vendor-benefits">
                {["Zero commission on your first 50 bookings", "Real-time instant booking notifications", "Guaranteed weekly automated bank payouts", "Dedicated merchant success manager"].map(b => (
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
                  Explore Market
                </Link>
              </div>
            </div>
            <div className="vendor-cta-visual">
              <div className="vendor-stat-card">
                <div className="vendor-stat">₹45,000+</div>
                <div className="text-muted text-sm">Avg Monthly Earning</div>
              </div>
              <div className="vendor-stat-card">
                <div className="vendor-stat">340+</div>
                <div className="text-muted text-sm">Bookings Delivered / Mo</div>
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
        <div className="service-card-duration-badge">
          <FiClock size={11} /> {service.duration || 60}m
        </div>
      </div>
      <div className="service-card-body">
        <div className="service-card-top-row">
          <div className="service-card-cat">{service.category}</div>
          <div className="service-card-rating-pill">
            <FiStar fill="#f59e0b" color="#f59e0b" size={12} />
            <span>{service.rating ? service.rating.toFixed(1) : "4.8"}</span>
            <span className="text-muted text-xs">({service.totalReviews || 12})</span>
          </div>
        </div>
        <h3 className="service-card-title">{service.title}</h3>
        <div className="service-card-vendor">
          <div className="avatar-xs">{service.vendor?.name?.[0] || "P"}</div>
          <span className="service-vendor-name">{service.vendor?.businessName || service.vendor?.name || "Verified Pro"}</span>
          <MdVerified color="#38bdf8" size={14} title="Verified Professional" />
        </div>
        <div className="service-card-footer">
          <div className="service-card-price">
            <span className="price-type">{service.priceType === "starting_from" ? "From " : ""}</span>
            ₹{service.price?.toLocaleString()}
          </div>
          <span className="service-card-action-link">
            Book <FiChevronRight />
          </span>
        </div>
      </div>
    </Link>
  );
}

