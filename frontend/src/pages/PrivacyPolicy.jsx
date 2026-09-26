import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { 
  FiShield, FiLock, FiKey, FiDatabase, FiCheckCircle, 
  FiUserCheck, FiCreditCard, FiServer, FiEyeOff, FiFileText 
} from "react-icons/fi";
import { MdVerified, MdSecurity } from "react-icons/md";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("overview");

  const securityFeatures = [
    {
      icon: <FiLock size={22} color="var(--primary)" />,
      title: "End-to-End Cryptographic Security",
      desc: "All passwords are salted and hashed using bcrypt (10 rounds). Plaintext passwords are never logged, stored, or exposed."
    },
    {
      icon: <FiKey size={22} color="#10b981" />,
      title: "Dual-Token JWT & Rotation",
      desc: "Short-lived JWT Access Tokens (15 mins) paired with cryptographic Refresh Tokens (7 days) prevent session hijacking."
    },
    {
      icon: <FiShield size={22} color="#6366f1" />,
      title: "Role-Based Access Control (RBAC)",
      desc: "Strict 3-tier authorization (Customer, Vendor, Admin) enforced both client-side and via server middleware."
    },
    {
      icon: <FiDatabase size={22} color="#f59e0b" />,
      title: "NoSQL & Schema Sanitization",
      desc: "Mongoose strict schemas with express-validator neutralize query injection and malicious payload tampering."
    },
    {
      icon: <FiServer size={22} color="#38bdf8" />,
      title: "Hardened HTTP Headers (Helmet)",
      desc: "Helmet security headers protect against Clickjacking, Cross-Site Scripting (XSS), MIME sniffing, and open redirects."
    },
    {
      icon: <FiCreditCard size={22} color="#ec4899" />,
      title: "Server-Authoritative Pricing",
      desc: "Service amounts and platform fees are calculated strictly on the backend to prevent client-side fee manipulation."
    },
  ];

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Hero Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.05) 100%)",
        borderBottom: "1px solid var(--border)",
        padding: "60px 0 40px"
      }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 800 }}>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 8, 
            background: "rgba(99, 102, 241, 0.15)", 
            color: "var(--primary)", 
            padding: "6px 14px", 
            borderRadius: 20, 
            fontSize: 13, 
            fontWeight: 700, 
            marginBottom: 16 
          }}>
            <MdSecurity size={16} /> ENTERPRISE-GRADE PRIVACY & ARCHITECTURE
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Privacy Policy & Platform Security
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 16, lineHeight: 1.8 }}>
            At <strong>ServeBook</strong>, protecting your personal data, transaction confidentiality, and customer privacy 
            is built directly into our core system design. Here is how your data is protected.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 24, fontSize: 13, color: "var(--text-muted)" }}>
            <span>📅 Last Updated: September 2026</span>
            <span>•</span>
            <span>🛡️ ISO/IEC 27001 Aligned Controls</span>
            <span>•</span>
            <span>🔒 DPDP Act Compliant</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "48px 0 80px" }}>
        {/* Navigation Tabs */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 40
        }}>
          {[
            { id: "overview", label: "Security Architecture", icon: <FiShield /> },
            { id: "privacy", label: "Data Privacy & Sharing", icon: <FiEyeOff /> },
            { id: "auth", label: "Authentication & RBAC", icon: <FiKey /> },
            { id: "payments", label: "Payments & Financials", icon: <FiCreditCard /> },
            { id: "rights", label: "Your Rights & Control", icon: <FiUserCheck /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`btn btn-sm ${activeSection === tab.id ? "btn-primary" : "btn-outline"}`}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px" }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Section 1: Security Architecture */}
        {activeSection === "overview" && (
          <div>
            <div style={{ textAlign: "center", maxWidth: 650, margin: "0 auto 36px" }}>
              <h2 style={{ fontSize: 26, fontWeight: 800 }}>Full-Stack Security Architecture</h2>
              <p className="text-muted" style={{ marginTop: 8 }}>
                Engineered with defense-in-depth principles across frontend, network, backend API, and database layers.
              </p>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
              gap: 20, 
              marginBottom: 40 
            }}>
              {securityFeatures.map((f, i) => (
                <div key={i} className="card" style={{ padding: 24, display: "flex", gap: 16 }}>
                  <div style={{ 
                    width: 44, 
                    height: 44, 
                    borderRadius: 10, 
                    background: "var(--surface2)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    flexShrink: 0 
                  }}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
                    <p className="text-muted" style={{ fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Architecture Details Box */}
            <div className="card" style={{ padding: 32, background: "var(--surface)" }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <FiServer color="var(--primary)" /> Defense-in-Depth Layer Breakdown
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
                <div style={{ borderLeft: "3px solid var(--primary)", paddingLeft: 14 }}>
                  <div className="font-semibold" style={{ fontSize: 14 }}>1. Application & Input Layer</div>
                  <p className="text-muted text-xs" style={{ marginTop: 4 }}>
                    Real-time frontend validation and strict backend <code>express-validator</code> schemas prevent malformed or malicious inputs before touching business logic.
                  </p>
                </div>
                <div style={{ borderLeft: "3px solid #10b981", paddingLeft: 14 }}>
                  <div className="font-semibold" style={{ fontSize: 14 }}>2. Session & Token Layer</div>
                  <p className="text-muted text-xs" style={{ marginTop: 4 }}>
                    JWT claims contain minimal data (User ID, Role). Tokens are signed with strong 256-bit secrets and verified on every protected API call.
                  </p>
                </div>
                <div style={{ borderLeft: "3px solid #f59e0b", paddingLeft: 14 }}>
                  <div className="font-semibold" style={{ fontSize: 14 }}>3. Database & Storage Layer</div>
                  <p className="text-muted text-xs" style={{ marginTop: 4 }}>
                    MongoDB compound indexes enforce unique constraints, atomic slot reservations, and isolated document tenancies per vendor.
                  </p>
                </div>
                <div style={{ borderLeft: "3px solid #ec4899", paddingLeft: 14 }}>
                  <div className="font-semibold" style={{ fontSize: 14 }}>4. Rate-Limiting & Anti-DDoS</div>
                  <p className="text-muted text-xs" style={{ marginTop: 4 }}>
                    IP-based throttling via <code>express-rate-limit</code> curbs automated brute force, credential stuffing, and bot scanning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Data Privacy & Sharing */}
        {activeSection === "privacy" && (
          <div className="card" style={{ padding: 36, maxWidth: 850, margin: "0 auto" }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>How We Collect & Protect Your Data</h2>
            <p className="text-muted" style={{ lineHeight: 1.7, marginBottom: 24 }}>
              ServeBook operates on a strict **need-to-know data isolation policy**. We do not sell, rent, or trade your personal 
              information to data brokers or third-party advertisers.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "var(--surface2)", padding: 20, borderRadius: 12, border: "1px solid var(--border)" }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <FiCheckCircle color="#10b981" /> 1. Doorstep Address Isolation
                </h4>
                <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>
                  Your service street address and phone number are <strong>only shared with the specific verified vendor</strong> who accepted your booking. 
                  Other vendors and external parties have zero access to your address details.
                </p>
              </div>

              <div style={{ background: "var(--surface2)", padding: 20, borderRadius: 12, border: "1px solid var(--border)" }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <FiCheckCircle color="#10b981" /> 2. Vendor Business Verification
                </h4>
                <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>
                  Vendor listings require admin review and validation before going public. Identity and contact details are vetted to 
                  ensure customer trust and on-site safety.
                </p>
              </div>

              <div style={{ background: "var(--surface2)", padding: 20, borderRadius: 12, border: "1px solid var(--border)" }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <FiCheckCircle color="#10b981" /> 3. Data Retention & Anonymization
                </h4>
                <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>
                  Account details remain active as long as your profile is open. Upon account deletion request, personal identifying 
                  information is permanently removed while historical transactional logs are cryptographically anonymized.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Authentication & RBAC */}
        {activeSection === "auth" && (
          <div className="card" style={{ padding: 36, maxWidth: 850, margin: "0 auto" }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Authentication & Role-Based Access Control</h2>
            <p className="text-muted" style={{ lineHeight: 1.7, marginBottom: 24 }}>
              ServeBook enforces a 3-tier Role-Based Access Control (RBAC) model. Unauthorized users are blocked at both router 
              and database controller layers.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
              <div style={{ padding: 20, borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface2)" }}>
                <span className="badge badge-info" style={{ marginBottom: 10 }}>Role: Customer</span>
                <p className="text-muted text-xs" style={{ lineHeight: 1.6 }}>
                  Can view verified services, book time slots, manage own bookings, write reviews, and edit personal profile.
                </p>
              </div>
              <div style={{ padding: 20, borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface2)" }}>
                <span className="badge badge-purple" style={{ marginBottom: 10 }}>Role: Vendor</span>
                <p className="text-muted text-xs" style={{ lineHeight: 1.6 }}>
                  Can publish service offerings, generate slot schedules, accept/complete customer bookings, and track service revenues.
                </p>
              </div>
              <div style={{ padding: 20, borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface2)" }}>
                <span className="badge badge-success" style={{ marginBottom: 10 }}>Role: Administrator</span>
                <p className="text-muted text-xs" style={{ lineHeight: 1.6 }}>
                  Has oversight across platform catalog, verifies new service listings, manages user statuses, and reviews platform analytics.
                </p>
              </div>
            </div>

            <div style={{ padding: 18, background: "rgba(99, 102, 241, 0.08)", borderRadius: 10, border: "1px solid rgba(99, 102, 241, 0.2)" }}>
              <div className="font-semibold text-sm" style={{ color: "var(--primary)" }}>🔒 Password Strength & Sanitization</div>
              <p className="text-muted text-xs" style={{ marginTop: 4, lineHeight: 1.6 }}>
                Registration enforces strict password complexity checks on client and server. Passwords with low entropy are flagged in real time via our dynamic strength meter.
              </p>
            </div>
          </div>
        )}

        {/* Section 4: Payments */}
        {activeSection === "payments" && (
          <div className="card" style={{ padding: 36, maxWidth: 850, margin: "0 auto" }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Payment Integrity & Financial Security</h2>
            <p className="text-muted" style={{ lineHeight: 1.7, marginBottom: 24 }}>
              ServeBook incorporates state-machine booking workflows and tamper-proof price reconciliation.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ padding: 10, borderRadius: 8, background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                  <FiCheckCircle size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700 }}>Zero Card Data Stored on Platform</h4>
                  <p className="text-muted text-sm" style={{ marginTop: 4, lineHeight: 1.6 }}>
                    Debit cards, credit cards, UPI PINs, and banking credentials are never processed or retained on ServeBook servers, adhering strictly to PCI-DSS standards.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ padding: 10, borderRadius: 8, background: "rgba(99, 102, 241, 0.15)", color: "var(--primary)" }}>
                  <FiCheckCircle size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700 }}>Atomic Slot Locking</h4>
                  <p className="text-muted text-sm" style={{ marginTop: 4, lineHeight: 1.6 }}>
                    Double bookings are impossible. Our booking engine locks the specific calendar slot atomically during checkout to prevent concurrent conflict conditions.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ padding: 10, borderRadius: 8, background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
                  <FiCheckCircle size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700 }}>100% Service Guarantee & Refunds</h4>
                  <p className="text-muted text-sm" style={{ marginTop: 4, lineHeight: 1.6 }}>
                    In the rare event of service cancellation by a vendor, bookings are marked cancelled and customer refunds are processed according to our Fair Cancellation Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 5: Your Rights */}
        {activeSection === "rights" && (
          <div className="card" style={{ padding: 36, maxWidth: 850, margin: "0 auto" }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Your Privacy Rights & Controls</h2>
            <p className="text-muted" style={{ lineHeight: 1.7, marginBottom: 24 }}>
              You maintain complete authority over your personal identity and booking history.
            </p>

            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { title: "Right to Access", desc: "View all your past bookings, reviews, and profile data in your Customer Dashboard at any time." },
                { title: "Right to Rectification", desc: "Update your delivery address, phone number, and account credentials directly from profile settings." },
                { title: "Right to Erasure (Forget Me)", desc: "Request complete permanent deletion of your profile and data by emailing privacy@servebook.in." },
                { title: "Opt-Out of Promotional Alerts", desc: "Easily manage email and SMS alert preferences with one-click toggles." },
              ].map((item, idx) => (
                <li key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <MdVerified color="var(--primary)" size={20} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <strong style={{ fontSize: 15 }}>{item.title}:</strong>
                    <span className="text-muted text-sm" style={{ marginLeft: 6 }}>{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 32, borderTop: "1px solid var(--border)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <span className="text-muted text-sm">Have security questions or need compliance assistance?</span>
              <a href="mailto:privacy@servebook.in" className="btn btn-outline btn-sm">
                📧 Contact Data Protection Officer
              </a>
            </div>
          </div>
        )}

        {/* Bottom Trust Badge */}
        <div style={{ 
          marginTop: 60, 
          padding: 24, 
          borderRadius: 14, 
          border: "1px solid var(--border)", 
          background: "var(--surface)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          flexWrap: "wrap", 
          gap: 16 
        }}>
          <div>
            <div className="font-semibold" style={{ fontSize: 16 }}>Ready to book verified doorstep services?</div>
            <p className="text-muted text-xs" style={{ marginTop: 2 }}>
              All vendors undergo strict verification before onboarding.
            </p>
          </div>
          <Link to="/services" className="btn btn-primary">
            Explore Verified Services
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
