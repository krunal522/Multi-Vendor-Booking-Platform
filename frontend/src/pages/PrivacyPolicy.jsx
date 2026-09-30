import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import {
  FiShield,
  FiLock,
  FiKey,
  FiDatabase,
  FiCheckCircle,
  FiUserCheck,
  FiCreditCard,
  FiServer,
  FiFileText,
  FiMail,
  FiPhone,
  FiMapPin,
  FiAlertCircle,
  FiLayers,
  FiCalendar,
  FiAward,
} from "react-icons/fi";
import { MdVerified, MdSecurity, MdGavel } from "react-icons/md";

export default function PrivacyPolicy() {
  const [activeTab, setActiveTab] = useState("consumer"); // "consumer" or "security_audit"
  const [activeSection, setActiveSection] = useState("collection");

  const legalSections = [
    { id: "collection", title: "1. Information We Collect" },
    { id: "usage", title: "2. How We Use Information" },
    { id: "payment", title: "3. Payments & Financial Data" },
    { id: "sharing", title: "4. Sharing with Service Partners" },
    { id: "retention", title: "5. Data Retention & Deletion" },
    { id: "rights", title: "6. User Rights & DPDP Compliance" },
    { id: "cookies", title: "7. Cookies & Analytics" },
    { id: "refund", title: "8. Refund & Cancellation Terms" },
    { id: "grievance", title: "9. Grievance Officer (IT Act 2000)" },
  ];

  const securityFeatures = [
    {
      icon: <FiLock size={22} color="var(--primary)" />,
      bg: "rgba(99, 102, 241, 0.12)",
      title: "End-to-End Cryptographic Security",
      desc: "All passwords are salted and hashed using bcrypt (10 rounds). Plaintext passwords are never logged, stored, or exposed."
    },
    {
      icon: <FiKey size={22} color="#10b981" />,
      bg: "rgba(16, 185, 129, 0.12)",
      title: "Dual-Token JWT & Rotation",
      desc: "Short-lived JWT Access Tokens (15 mins) paired with cryptographic Refresh Tokens (7 days) prevent session hijacking."
    },
    {
      icon: <FiShield size={22} color="#6366f1" />,
      bg: "rgba(99, 102, 241, 0.12)",
      title: "Role-Based Access Control (RBAC)",
      desc: "Strict 3-tier authorization (Customer, Vendor, Admin) enforced both client-side and via server middleware."
    },
    {
      icon: <FiDatabase size={22} color="#f59e0b" />,
      bg: "rgba(245, 158, 11, 0.12)",
      title: "NoSQL & Schema Sanitization",
      desc: "Mongoose strict schemas with express-validator neutralize query injection and malicious payload tampering."
    },
    {
      icon: <FiServer size={22} color="#38bdf8" />,
      bg: "rgba(56, 189, 248, 0.12)",
      title: "Hardened HTTP Headers (Helmet)",
      desc: "Helmet security headers protect against Clickjacking, Cross-Site Scripting (XSS), MIME sniffing, and open redirects."
    },
    {
      icon: <FiCreditCard size={22} color="#ec4899" />,
      bg: "rgba(236, 72, 153, 0.12)",
      title: "Server-Authoritative Pricing",
      desc: "Service amounts and platform fees are calculated strictly on the backend to prevent client-side fee manipulation."
    },
  ];

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Hero Header */}
      <div className="policy-hero-banner">
        <div className="container" style={{ textAlign: "center", maxWidth: 840 }}>
          <div className="policy-badge-pill">
            <MdSecurity size={16} /> Trust & Transparency Center
          </div>

          <h1 className="privacy-hero-title">
            ServeBook Privacy Policy & Trust Standards
          </h1>
          <p className="text-muted" style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
            We believe your home and personal data deserve uncompromising protection. This policy outlines how ServeBook Technologies Pvt. Ltd. collects, safeguards, and handles your information.
          </p>

          <div className="policy-meta-badges">
            <span className="policy-meta-chip">
              <FiCalendar size={13} color="var(--primary)" />
              <span>Effective: Sep 27, 2026</span>
            </span>
            <span className="policy-meta-chip">
              <FiCheckCircle size={13} color="#38bdf8" />
              <span>CIN: U72900MH2024PTC398124</span>
            </span>
            <span className="policy-meta-chip policy-meta-chip-success">
              <MdVerified color="#10b981" />
              <span>DPDP Act 2023 Compliant</span>
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="policy-mode-tabs">
            <button
              type="button"
              className={`policy-mode-tab ${activeTab === "consumer" ? "active" : ""}`}
              onClick={() => setActiveTab("consumer")}
            >
              📋 Privacy Policy
            </button>
            <button
              type="button"
              className={`policy-mode-tab ${activeTab === "security_audit" ? "active" : ""}`}
              onClick={() => setActiveTab("security_audit")}
            >
              🛡️ Security Architecture
            </button>
          </div>
        </div>
      </div>

      {/* Consumer Privacy Policy Tab */}
      {activeTab === "consumer" && (
        <div className="container privacy-container">
          {/* Symmetrical Hero Header matching Security Tab */}
          <div className="policy-tab-header">
            <h2 className="policy-tab-title">
              Consumer Privacy & Data Protection Policy
            </h2>
            <p className="policy-tab-desc">
              Engineered with transparent data standards, zero financial credential storage, and strict compliance with India's DPDP Act 2023.
            </p>
          </div>

          <div className="privacy-layout">
            {/* Table of Contents: Sticky on Desktop, Horizontal Pills on Mobile */}
            <div className="privacy-sidebar card">
              <div className="privacy-sidebar-title">
                Policy Sections
              </div>
              <div className="privacy-sidebar-nav">
                {legalSections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    className={`privacy-sidebar-link ${activeSection === sec.id ? "active" : ""}`}
                  >
                    {sec.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Content Body */}
            <div className="privacy-content">
              {/* Section 1 */}
              <section id="collection" className="privacy-section">
                <h2 className="privacy-section-title">
                  <FiDatabase size={19} color="var(--primary)" style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} />
                  1. Information We Collect
                </h2>
                <p className="text-muted" style={{ marginBottom: 16 }}>
                  When you access or book services through ServeBook, we collect information required to fulfill your on-demand service appointments, ensure customer safety, and maintain high delivery standards:
                </p>
                <div className="policy-card-grid">
                  <div className="policy-card">
                    <div className="policy-card-icon" style={{ background: "rgba(99, 102, 241, 0.12)" }}>
                      <FiUserCheck size={22} color="var(--primary)" />
                    </div>
                    <h3 className="policy-card-title">Account & Identity Data</h3>
                    <p className="policy-card-desc">
                      Your full name, verified email address, phone number, and encrypted credentials. For service partners, we additionally collect government ID and police KYC verification.
                    </p>
                  </div>

                  <div className="policy-card">
                    <div className="policy-card-icon" style={{ background: "rgba(16, 185, 129, 0.12)" }}>
                      <FiMapPin size={22} color="#10b981" />
                    </div>
                    <h3 className="policy-card-title">Service Address & Location</h3>
                    <p className="policy-card-desc">
                      House/flat number, street name, landmark, city, and 6-digit postal code where the technician or salon professional will arrive to deliver the service.
                    </p>
                  </div>

                  <div className="policy-card">
                    <div className="policy-card-icon" style={{ background: "rgba(245, 158, 11, 0.12)" }}>
                      <FiCalendar size={22} color="#f59e0b" />
                    </div>
                    <h3 className="policy-card-title">Booking & History Logs</h3>
                    <p className="policy-card-desc">
                      Selected date, time slot, service category, notes for the professional, real-time dispatch updates, and verified booking completion status.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section id="usage" className="privacy-section">
                <h2 className="privacy-section-title">
                  <FiCheckCircle size={19} color="#10b981" style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} />
                  2. How We Use Your Information
                </h2>
                <p className="text-muted" style={{ marginBottom: 16 }}>
                  ServeBook processes your personal data strictly for lawful, performance-of-contract purposes:
                </p>
                <div className="policy-card-grid">
                  <div className="policy-card">
                    <div className="policy-card-icon" style={{ background: "rgba(16, 185, 129, 0.12)" }}>
                      <FiCheckCircle size={22} color="#10b981" />
                    </div>
                    <h3 className="policy-card-title">Service Partner Matching</h3>
                    <p className="policy-card-desc">
                      Connecting you with certified, background-checked professionals matching your exact requested time slot and locality.
                    </p>
                  </div>

                  <div className="policy-card">
                    <div className="policy-card-icon" style={{ background: "rgba(56, 189, 248, 0.12)" }}>
                      <FiFileText size={22} color="#38bdf8" />
                    </div>
                    <h3 className="policy-card-title">Alerts & Digital Tax Invoices</h3>
                    <p className="policy-card-desc">
                      Sending dispatch alerts, OTP verifications, status updates, and GST-compliant tax invoices via SMS and Email.
                    </p>
                  </div>

                  <div className="policy-card">
                    <div className="policy-card-icon" style={{ background: "rgba(99, 102, 241, 0.12)" }}>
                      <FiShield size={22} color="var(--primary)" />
                    </div>
                    <h3 className="policy-card-title">Quality Assurance & Disputes</h3>
                    <p className="policy-card-desc">
                      Enforcing our 100% Service Guarantee, resolving customer disputes, and maintaining verified 5-star quality ratings.
                    </p>
                  </div>

                  <div className="policy-card">
                    <div className="policy-card-icon" style={{ background: "rgba(236, 72, 153, 0.12)" }}>
                      <FiLock size={22} color="#ec4899" />
                    </div>
                    <h3 className="policy-card-title">Fraud & Abuse Prevention</h3>
                    <p className="policy-card-desc">
                      Proactively identifying bot attacks, fake bookings, credential stuffing, and malicious tampering to protect all users.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="payment" className="privacy-section">
                <h2 className="privacy-section-title">
                  <FiCreditCard size={19} color="#ec4899" style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} />
                  3. Payments & Financial Data Protection
                </h2>
                <div className="zero-storage-banner">
                  <div className="zero-storage-title">
                    <FiCheckCircle size={18} color="#10b981" /> Zero Storage of Financial Credentials
                  </div>
                  <p className="text-muted text-sm" style={{ margin: 0, lineHeight: 1.6 }}>
                    ServeBook <strong>NEVER</strong> stores your UPI PINs, credit/debit card numbers, CVVs, or net banking passwords on our servers. All transactions are securely processed through RBI-approved, PCI-DSS Level-1 certified payment gateways.
                  </p>
                </div>
                <p className="text-muted" style={{ lineHeight: 1.7 }}>
                  We support instant payments via UPI (PhonePe, Google Pay, Paytm, BHIM), RuPay, Visa, Mastercard, and Cash on Delivery. Invoices and receipts generated through the platform comply with standard Indian GST accounting regulations.
                </p>
              </section>

              {/* Section 4 */}
              <section id="sharing" className="privacy-section">
                <h2 className="privacy-section-title">
                  <FiUserCheck size={19} color="#38bdf8" style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} />
                  4. Sharing Information with Service Partners
                </h2>
                <p className="text-muted" style={{ marginBottom: 16 }}>
                  To fulfill your service request, we share only necessary contact and location details with the specifically assigned service professional:
                </p>
                <div className="policy-card-grid">
                  <div className="policy-card">
                    <div className="policy-card-icon" style={{ background: "rgba(56, 189, 248, 0.12)" }}>
                      <FiMapPin size={22} color="#38bdf8" />
                    </div>
                    <h3 className="policy-card-title">Delivery Contact Only</h3>
                    <p className="policy-card-desc">
                      The professional receives your address and phone number solely to travel to your doorstep and perform the requested service.
                    </p>
                  </div>
                  <div className="policy-card">
                    <div className="policy-card-icon" style={{ background: "rgba(99, 102, 241, 0.12)" }}>
                      <FiShield size={22} color="var(--primary)" />
                    </div>
                    <h3 className="policy-card-title">Contractual Confidentiality</h3>
                    <p className="policy-card-desc">
                      Service partners are bound by strict non-disclosure agreements prohibiting any unauthorized contact or secondary marketing.
                    </p>
                  </div>
                  <div className="policy-card">
                    <div className="policy-card-icon" style={{ background: "rgba(239, 68, 68, 0.12)" }}>
                      <FiLock size={22} color="#ef4444" />
                    </div>
                    <h3 className="policy-card-title">Zero Third-Party Data Sale</h3>
                    <p className="policy-card-desc">
                      ServeBook NEVER sells, rents, or trades your personal data or phone number to telemarketers or third-party advertisers.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section id="retention" className="privacy-section">
                <h2 className="privacy-section-title">
                  <FiLock size={19} color="#f59e0b" style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} />
                  5. Data Retention & Account Erasure
                </h2>
                <div className="policy-card-grid">
                  <div className="policy-card">
                    <div className="policy-card-icon" style={{ background: "rgba(245, 158, 11, 0.12)" }}>
                      <FiDatabase size={22} color="#f59e0b" />
                    </div>
                    <h3 className="policy-card-title">Statutory Retention (6 Years)</h3>
                    <p className="policy-card-desc">
                      We retain booking records and tax invoices for the statutory period required by Indian tax laws and MCA audit regulations.
                    </p>
                  </div>
                  <div className="policy-card">
                    <div className="policy-card-icon" style={{ background: "rgba(16, 185, 129, 0.12)" }}>
                      <FiCheckCircle size={22} color="#10b981" />
                    </div>
                    <h3 className="policy-card-title">Permanent Erasure (30 Days)</h3>
                    <p className="policy-card-desc">
                      You can request full erasure of your profile credentials at any time. Upon identity verification, data is purged within 30 days.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section id="rights" className="privacy-section">
                <h2 className="privacy-section-title">
                  <MdVerified size={20} color="#10b981" style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} />
                  6. Your Rights Under the DPDP Act 2023
                </h2>
                <p className="text-muted" style={{ marginBottom: 16 }}>
                  Under the Digital Personal Data Protection Act of India, you hold fundamental rights as a Data Principal:
                </p>
                <div className="policy-card-grid">
                  <div className="policy-card">
                    <h3 className="policy-card-title" style={{ color: "var(--primary)" }}>Right to Access</h3>
                    <p className="policy-card-desc">
                      Inspect all personal data, verified documents, and booking history currently associated with your account.
                    </p>
                  </div>
                  <div className="policy-card">
                    <h3 className="policy-card-title" style={{ color: "#10b981" }}>Right to Correction</h3>
                    <p className="policy-card-desc">
                      Update, correct, or complete inaccurate phone numbers, profile names, or saved delivery addresses anytime.
                    </p>
                  </div>
                  <div className="policy-card">
                    <h3 className="policy-card-title" style={{ color: "#f59e0b" }}>Right to Grievance Redressal</h3>
                    <p className="policy-card-desc">
                      Direct escalation path to our statutory Grievance Officer with guaranteed 24-48 working hour turnaround.
                    </p>
                  </div>
                  <div className="policy-card">
                    <h3 className="policy-card-title" style={{ color: "#ec4899" }}>Right to Nominate</h3>
                    <p className="policy-card-desc">
                      Designate an authorized representative to exercise data principal rights in the event of death or incapacity.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 7 */}
              <section id="cookies" className="privacy-section">
                <h2 className="privacy-section-title">
                  <FiServer size={19} color="#a855f7" style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} />
                  7. Cookies & Session Management
                </h2>
                <div className="policy-card" style={{ maxWidth: "100%" }}>
                  <div className="policy-card-icon" style={{ background: "rgba(168, 85, 247, 0.12)" }}>
                    <FiServer size={22} color="#a855f7" />
                  </div>
                  <h3 className="policy-card-title">Secure Token Authentication</h3>
                  <p className="policy-card-desc">
                    We use secure, HTTP-only authentication tokens for session verification. We do not use intrusive cross-site tracking cookies or third-party ad profiling cookies. You can manage cookie preferences directly through your browser settings.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section id="refund" className="privacy-section">
                <h2 className="privacy-section-title">
                  <FiShield size={19} color="#6366f1" style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} />
                  8. Refund & Cancellation Terms
                </h2>
                <p className="text-muted" style={{ marginBottom: 16 }}>
                  Customers can cancel bookings without penalty up to 2 hours before the scheduled time slot:
                </p>
                <div className="policy-card-grid">
                  <div className="policy-card">
                    <div className="policy-card-icon" style={{ background: "rgba(16, 185, 129, 0.12)" }}>
                      <FiCheckCircle size={22} color="#10b981" />
                    </div>
                    <h3 className="policy-card-title">100% Full Refund</h3>
                    <p className="policy-card-desc">
                      Cancellations made 2+ hours before the slot are eligible for a 100% full refund to the original payment source (UPI/Card).
                    </p>
                  </div>
                  <div className="policy-card">
                    <div className="policy-card-icon" style={{ background: "rgba(56, 189, 248, 0.12)" }}>
                      <FiCalendar size={22} color="#38bdf8" />
                    </div>
                    <h3 className="policy-card-title">3-5 Day Settlement</h3>
                    <p className="policy-card-desc">
                      Refunds are automatically processed and credited back to your bank account or payment app within 3 to 5 business days.
                    </p>
                  </div>
                  <div className="policy-card">
                    <div className="policy-card-icon" style={{ background: "rgba(99, 102, 241, 0.12)" }}>
                      <FiShield size={22} color="var(--primary)" />
                    </div>
                    <h3 className="policy-card-title">100% Quality Guarantee</h3>
                    <p className="policy-card-desc">
                      If a service partner fails to arrive or delivers substandard work, our guarantee covers free re-service or immediate full refund.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 9 */}
              <section id="grievance" className="privacy-section">
                <h2 className="privacy-section-title">
                  <MdGavel size={20} color="#ef4444" style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} />
                  9. Grievance Redressal Officer (IT Act 2000)
                </h2>
                <p className="text-muted" style={{ marginBottom: 16 }}>
                  In accordance with Information Technology Act, 2000 and Rules made thereunder, the name and contact details of the Grievance Officer are published below:
                </p>

                <div className="grievance-box">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>Mr. Rohit Verma</div>
                    <div className="text-muted text-sm">Grievance Redressal & Data Protection Officer</div>
                    <div className="text-muted text-sm" style={{ marginTop: 8 }}>
                      ServeBook Technologies Private Limited
                    </div>
                    <div className="text-muted text-xs" style={{ marginTop: 2 }}>
                      BKC Avenue, Bandra East, Mumbai, Maharashtra 400051
                    </div>
                  </div>

                  <div>
                    <div className="grievance-contact-item">
                      <FiMail color="var(--primary)" /> <span><strong>Email:</strong> grievance@servebook.in</span>
                    </div>
                    <div className="grievance-contact-item">
                      <FiPhone color="var(--primary)" /> <span><strong>Phone:</strong> 022-6890-4100</span>
                    </div>
                    <div className="text-muted text-xs" style={{ marginTop: 8 }}>
                      Resolution Turnaround: 24 to 48 working hours.
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Security Architecture Audit Tab */}
      {activeTab === "security_audit" && (
        <div className="container privacy-container">
          {/* Symmetrical Hero Header matching Privacy Tab */}
          <div className="policy-tab-header">
            <h2 className="policy-tab-title">
              Full-Stack Technical Security Architecture
            </h2>
            <p className="policy-tab-desc">
              Engineered with defense-in-depth principles across frontend network, backend API routing, database, and encryption layers.
            </p>
          </div>

          <div className="policy-card-grid">
            {securityFeatures.map((feat, i) => (
              <div key={i} className="policy-card">
                <div className="policy-card-icon" style={{ background: feat.bg || "rgba(99, 102, 241, 0.12)" }}>
                  {feat.icon}
                </div>
                <h3 className="policy-card-title">{feat.title}</h3>
                <p className="policy-card-desc">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Defense in depth layers */}
          <div className="security-layers-card">
            <h3 className="security-layers-title">
              <FiLayers color="var(--primary)" size={20} /> Defense-in-Depth Layer Breakdown
            </h3>
            <div className="security-layers-grid">
              <div className="security-layer-item" style={{ borderLeftColor: "var(--primary)" }}>
                <strong className="security-layer-name">1. Application & Input Layer</strong>
                <p className="security-layer-text">
                  Real-time frontend validation, sanitized inputs, and express-validator middleware preventing malformed payloads.
                </p>
              </div>
              <div className="security-layer-item" style={{ borderLeftColor: "#10b981" }}>
                <strong className="security-layer-name">2. Session & Token Layer</strong>
                <p className="security-layer-text">
                  Dual-token JWT architecture with strict RBAC access guards and cryptographic token validation.
                </p>
              </div>
              <div className="security-layer-item" style={{ borderLeftColor: "#f59e0b" }}>
                <strong className="security-layer-name">3. Database & Storage Layer</strong>
                <p className="security-layer-text">
                  MongoDB Atlas replica cluster with IP access controls, TLS 1.3 in-transit, and AES-256 at-rest encryption.
                </p>
              </div>
              <div className="security-layer-item" style={{ borderLeftColor: "#ec4899" }}>
                <strong className="security-layer-name">4. Security Headers (Helmet)</strong>
                <p className="security-layer-text">
                  Clickjacking defense, Content-Security-Policy, XSS filters, and Strict-Transport-Security enforced.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
