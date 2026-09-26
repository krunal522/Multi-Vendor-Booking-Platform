import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ marginBottom: 16 }}>
              <Logo size="lg" showTagline={true} />
            </div>
            <p className="text-muted" style={{ fontSize: 14, lineHeight: 1.7 }}>
              India's #1 multi-vendor home services platform. Connecting customers with trusted professionals.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link">𝕏</a>
              <a href="#" className="social-link">in</a>
              <a href="#" className="social-link">f</a>
              <a href="#" className="social-link">▶</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            {["Salon & Beauty", "Home Cleaning", "Plumbing", "Electrical", "AC Repair", "Pest Control"].map(s => (
              <Link key={s} to="/services" className="footer-link">{s}</Link>
            ))}
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            {["About Us", "How it Works", "Careers", "Blog", "Press"].map(s => (
              <a key={s} href="#" className="footer-link">{s}</a>
            ))}
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
            <Link to="/services" className="footer-link">Help Center</Link>
            <a href="mailto:support@servebook.in" className="footer-link">Contact Us</a>
            <Link to="/privacy-policy" className="footer-link">Terms & Safety</Link>
            <Link to="/privacy-policy" className="footer-link">Refund Policy</Link>
            <div style={{ marginTop: 16 }}>
              <div className="text-sm text-muted">📧 support@servebook.in</div>
              <div className="text-sm text-muted" style={{ marginTop: 4 }}>📞 1800-123-4567</div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="text-muted text-sm">© 2026 ServeBook. All rights reserved.</span>
          <span className="text-muted text-sm">Made with ❤️ in India</span>
        </div>
      </div>
    </footer>
  );
}
