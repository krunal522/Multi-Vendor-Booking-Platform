import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { 
  FiShield, FiAward, FiLock, FiPhoneCall, 
  FiCheckCircle, FiHeart, FiSmartphone, FiArrowRight 
} from "react-icons/fi";
import { 
  FaInstagram, FaXTwitter, FaLinkedinIn, FaYoutube 
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="footer">
      {/* Trust & Guarantee Banner (Urban Company Standard) */}
      <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)", padding: "28px 0" }}>
        <div className="container">
          <div className="footer-trust-grid">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: "rgba(99, 102, 241, 0.12)", color: "#818cf8",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <FiAward size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>100% Quality Assured</div>
                <div className="text-muted" style={{ fontSize: 12 }}>Standardized doorstep service</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: "rgba(16, 185, 129, 0.12)", color: "#34d399",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <FiShield size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>Verified Professionals</div>
                <div className="text-muted" style={{ fontSize: 12 }}>KYC & police background checked</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: "rgba(245, 158, 11, 0.12)", color: "#fbbf24",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <FiLock size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>Secure Transactions</div>
                <div className="text-muted" style={{ fontSize: 12 }}>UPI, Cards & NetBanking safe</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: "rgba(236, 72, 153, 0.12)", color: "#f472b6",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <FiPhoneCall size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>Dedicated Support</div>
                <div className="text-muted" style={{ fontSize: 12 }}>24x7 Customer resolution desk</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Directory */}
      <div className="container footer-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <div style={{ marginBottom: 16 }}>
              <Logo size="lg" showTagline={true} />
            </div>
            <p className="text-muted" style={{ fontSize: 13.5, lineHeight: 1.7, marginBottom: 20 }}>
              ServeBook is India's premier multi-vendor on-demand marketplace connecting households with certified professionals across grooming, home maintenance, and appliance repairs.
            </p>
            
            <div style={{ marginBottom: 16 }}>
              <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: 8 }}>
                Accepted Payment Networks
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <span className="badge badge-info" style={{ fontSize: 11, padding: "4px 8px" }}>UPI / PhonePe</span>
                <span className="badge badge-info" style={{ fontSize: 11, padding: "4px 8px" }}>Paytm / GPay</span>
                <span className="badge badge-info" style={{ fontSize: 11, padding: "4px 8px" }}>RuPay & Visa</span>
                <span className="badge badge-info" style={{ fontSize: 11, padding: "4px 8px" }}>NetBanking</span>
              </div>
            </div>

            <div className="footer-socials">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link social-link-twitter"
                title="Follow ServeBook on X (Twitter)"
                aria-label="ServeBook on X (Twitter)"
              >
                <FaXTwitter size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link social-link-linkedin"
                title="Connect with ServeBook on LinkedIn"
                aria-label="ServeBook on LinkedIn"
              >
                <FaLinkedinIn size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link social-link-instagram"
                title="Follow ServeBook on Instagram"
                aria-label="ServeBook on Instagram"
              >
                <FaInstagram size={17} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link social-link-youtube"
                title="Subscribe to ServeBook on YouTube"
                aria-label="ServeBook on YouTube"
              >
                <FaYoutube size={17} />
              </a>
            </div>
          </div>

          {/* Column 1: Services */}
          <div className="footer-col">
            <h4>Doorstep Services</h4>
            <Link to="/services?category=Salon" className="footer-link">Women's Salon & Spa</Link>
            <Link to="/services?category=Salon" className="footer-link">Men's Hair & Grooming</Link>
            <Link to="/services?category=Home+Cleaning" className="footer-link">Full House Deep Cleaning</Link>
            <Link to="/services?category=AC+Repair" className="footer-link">AC Foam Jet & Gas Refill</Link>
            <Link to="/services?category=Plumbing" className="footer-link">Plumbing & Leak Repairs</Link>
            <Link to="/services?category=Electrical" className="footer-link">Electrical Wiring & MCB Fix</Link>
            <Link to="/services" className="footer-link" style={{ color: "var(--primary)", fontWeight: 600, marginTop: 4 }}>
              Browse All Services →
            </Link>
          </div>

          {/* Column 2: For Partners & Business */}
          <div className="footer-col">
            <h4>For Partners</h4>
            <Link to="/register?role=vendor" className="footer-link">Register as Professional</Link>
            <Link to="/login" className="footer-link">Vendor Partner Portal</Link>
            <a href="#partner-standards" className="footer-link">Partner Code of Conduct</a>
            <a href="#payouts" className="footer-link">Instant Weekly Payouts</a>
            <a href="#insurance" className="footer-link">Accidental Safety Cover</a>
            <div style={{ marginTop: 16, padding: "12px", background: "rgba(255, 255, 255, 0.03)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Are you a skilled technician?</div>
              <p className="text-muted" style={{ fontSize: 11, margin: "4px 0 8px" }}>Earn up to ₹50,000/month with zero joining fee.</p>
              <Link to="/register?role=vendor" className="btn btn-outline btn-sm" style={{ width: "100%", fontSize: 11, padding: "4px 8px" }}>
                Join as Partner
              </Link>
            </div>
          </div>

          {/* Column 3: Trust, Legal & Support */}
          <div className="footer-col">
            <h4>Trust & Legal</h4>
            <Link to="/privacy-policy" className="footer-link" style={{ color: "#a5b4fc", fontWeight: 600 }}>
              Privacy & Data Policy
            </Link>
            <Link to="/privacy-policy#terms" className="footer-link">Terms of Service</Link>
            <Link to="/privacy-policy#refund" className="footer-link">Cancellation & Refunds</Link>
            <Link to="/privacy-policy#security" className="footer-link">Platform Security Standards</Link>
            <Link to="/privacy-policy#grievance" className="footer-link">Grievance Redressal (IT Act)</Link>
            
            <div style={{ marginTop: 16 }}>
              <div className="text-xs text-muted uppercase font-bold" style={{ marginBottom: 4 }}>Contact Desk:</div>
              <div className="text-sm" style={{ color: "#e2e8f0" }}>📧 support@servebook.in</div>
              <div className="text-sm" style={{ color: "#e2e8f0", marginTop: 2 }}>📞 1800-419-7000 (Toll Free)</div>
              <div className="text-xs text-muted" style={{ marginTop: 4 }}>Mon-Sun: 7:00 AM - 10:00 PM</div>
            </div>
          </div>
        </div>

        {/* Corporate Legal Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright-block">
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              © 2026 ServeBook Technologies Private Limited. All rights reserved.
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, lineHeight: 1.5 }}>
              CIN: U72900MH2024PTC398124 · Registered with Ministry of Corporate Affairs, Government of India.
            </div>
          </div>

          <div className="footer-legal-bar">
            <div className="footer-legal-group">
              <Link to="/privacy-policy" className="footer-legal-link">Privacy Policy</Link>
              <span className="footer-legal-dot">•</span>
              <Link to="/privacy-policy#terms" className="footer-legal-link">Terms</Link>
            </div>
            <div className="footer-made-in-india">
              Made with <FiHeart color="#ef4444" size={12} style={{ display: "inline", verticalAlign: "middle", margin: "0 2px" }} /> in India
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
