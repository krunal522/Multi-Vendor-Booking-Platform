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

      {/* Hero Header */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.05) 100%)",
          borderBottom: "1px solid var(--border)",
          padding: "54px 0 36px",
        }}
      >
        <div className="container" style={{ textAlign: "center", maxWidth: 840 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              background: "rgba(99, 102, 241, 0.15)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              borderRadius: 30,
              fontSize: 13,
              color: "#a5b4fc",
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            <MdSecurity size={16} /> Trust & Transparency Center
          </div>

          <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 12 }}>
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

      {/* Consumer Privacy Policy Tab (Urban Company Standard) */}
      {activeTab === "consumer" && (
        <div className="container" style={{ padding: "48px 16px 80px" }}>
          <div className="privacy-layout">
            {/* Sticky Table of Contents */}
            <div
              style={{
                position: "sticky",
                top: 90,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "20px 16px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--text-muted)",
                  marginBottom: 12,
                }}
              >
                Policy Sections
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {legalSections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      fontSize: 12.5,
                      textDecoration: "none",
                      color: activeSection === sec.id ? "var(--primary)" : "var(--text-muted)",
                      background: activeSection === sec.id ? "rgba(99, 102, 241, 0.1)" : "transparent",
                      fontWeight: activeSection === sec.id ? 700 : 500,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {sec.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Content Body */}
            <div style={{ maxWidth: 800, lineHeight: 1.8 }}>
              {/* Section 1 */}
              <section id="collection" style={{ marginBottom: 44 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: "#fff" }}>
                  1. Information We Collect
                </h2>
                <p className="text-muted" style={{ marginBottom: 14 }}>
                  When you access or book services through ServeBook, we collect information required to fulfill your on-demand service appointments, ensure customer safety, and maintain high delivery standards:
                </p>
                <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
                  <div style={{ padding: "14px 18px", background: "var(--surface2)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <strong style={{ color: "#fff" }}>Account & Identity Data:</strong>
                    <span className="text-muted text-sm" style={{ display: "block", marginTop: 4 }}>
                      Your full name, verified email address, phone number, and encrypted password credentials. For service partners (vendors), we additionally collect government ID, business name, and police KYC verification.
                    </span>
                  </div>
                  <div style={{ padding: "14px 18px", background: "var(--surface2)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <strong style={{ color: "#fff" }}>Service Address & Location Data:</strong>
                    <span className="text-muted text-sm" style={{ display: "block", marginTop: 4 }}>
                      Your house/flat number, street name, landmark, city, and 6-digit postal code where the technician or salon professional will deliver the doorstep service.
                    </span>
                  </div>
                  <div style={{ padding: "14px 18px", background: "var(--surface2)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <strong style={{ color: "#fff" }}>Booking & Appointment History:</strong>
                    <span className="text-muted text-sm" style={{ display: "block", marginTop: 4 }}>
                      Selected date, time slot, service category, notes for the professional, and booking status history.
                    </span>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section id="usage" style={{ marginBottom: 44 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: "#fff" }}>
                  2. How We Use Your Information
                </h2>
                <p className="text-muted" style={{ marginBottom: 14 }}>
                  ServeBook processes your personal data strictly for lawful, performance-of-contract purposes:
                </p>
                <ul style={{ paddingLeft: 20, color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 8 }}>
                  <li>Connecting you with qualified, background-checked service partners matching your requested slot.</li>
                  <li>Sending real-time appointment updates, vendor dispatch alerts, and digital tax receipts via SMS, Email, and WebSockets.</li>
                  <li>Facilitating quality control, customer disputes, verified ratings, and service guarantees.</li>
                  <li>Detecting fraudulent bookings, automated bot abuse, or malicious activity.</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section id="payment" style={{ marginBottom: 44 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: "#fff" }}>
                  3. Payments & Financial Data Protection
                </h2>
                <div style={{ padding: "16px 20px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: 8, marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#34d399", fontWeight: 700, marginBottom: 6 }}>
                    <FiCheckCircle size={18} /> Zero Storage of Financial Credentials
                  </div>
                  <p className="text-muted text-sm" style={{ margin: 0 }}>
                    ServeBook <strong>NEVER</strong> stores your UPI PINs, credit/debit card numbers, CVVs, or net banking passwords on our servers. All transactions are securely processed through RBI-approved, PCI-DSS Level-1 certified payment gateways.
                  </p>
                </div>
                <p className="text-muted">
                  We support instant payments via UPI (PhonePe, Google Pay, Paytm, BHIM), RuPay, Visa, Mastercard, and Cash on Delivery. Invoices and receipts generated through the platform comply with standard Indian GST accounting regulations.
                </p>
              </section>

              {/* Section 4 */}
              <section id="sharing" style={{ marginBottom: 44 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: "#fff" }}>
                  4. Sharing Information with Service Partners
                </h2>
                <p className="text-muted" style={{ marginBottom: 12 }}>
                  To fulfill your service request, we share only necessary contact and location details with the specifically assigned service professional:
                </p>
                <ul style={{ paddingLeft: 20, color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 8 }}>
                  <li>The professional receives your delivery address and contact phone number solely to travel to your premises and perform the service.</li>
                  <li>Service partners are contractually bound by confidentiality and code of conduct agreements prohibiting any unauthorized contact or secondary marketing.</li>
                  <li><strong>We NEVER sell, rent, or trade your personal data to telemarketers or third-party advertisers.</strong></li>
                </ul>
              </section>

              {/* Section 5 */}
              <section id="retention" style={{ marginBottom: 44 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: "#fff" }}>
                  5. Data Retention & Account Erasure
                </h2>
                <p className="text-muted">
                  We retain booking records and tax invoices for the statutory period required by Indian tax laws (6 years). If you wish to delete your account, you can request full erasure of your profile credentials by contacting our support desk. Upon verification, your account credentials will be permanently purged within 30 days.
                </p>
              </section>

              {/* Section 6 */}
              <section id="rights" style={{ marginBottom: 44 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: "#fff" }}>
                  6. Your Rights Under the DPDP Act 2023
                </h2>
                <p className="text-muted" style={{ marginBottom: 12 }}>
                  Under the Digital Personal Data Protection Act of India, you hold fundamental rights as a Data Principal:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ padding: 12, background: "var(--surface2)", borderRadius: 6 }}>
                    <strong style={{ color: "#fff", fontSize: 13 }}>Right to Access:</strong>
                    <div className="text-muted text-xs">Inspect all personal data and active bookings stored in your profile.</div>
                  </div>
                  <div style={{ padding: 12, background: "var(--surface2)", borderRadius: 6 }}>
                    <strong style={{ color: "#fff", fontSize: 13 }}>Right to Correction:</strong>
                    <div className="text-muted text-xs">Update inaccurate phone numbers, names, or addresses at any time.</div>
                  </div>
                  <div style={{ padding: 12, background: "var(--surface2)", borderRadius: 6 }}>
                    <strong style={{ color: "#fff", fontSize: 13 }}>Right to Grievance Redressal:</strong>
                    <div className="text-muted text-xs">Direct escalation to our designated statutory Grievance Officer.</div>
                  </div>
                  <div style={{ padding: 12, background: "var(--surface2)", borderRadius: 6 }}>
                    <strong style={{ color: "#fff", fontSize: 13 }}>Right to Nominate:</strong>
                    <div className="text-muted text-xs">Designate an authorized representative in case of incapacity.</div>
                  </div>
                </div>
              </section>

              {/* Section 7 */}
              <section id="cookies" style={{ marginBottom: 44 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: "#fff" }}>
                  7. Cookies & Session Management
                </h2>
                <p className="text-muted">
                  We use secure, HTTP-only authentication tokens for session verification. We do not use intrusive cross-site tracking cookies. You can manage cookie preferences directly through your browser settings.
                </p>
              </section>

              {/* Section 8 */}
              <section id="refund" style={{ marginBottom: 44 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: "#fff" }}>
                  8. Refund & Cancellation Terms
                </h2>
                <p className="text-muted" style={{ marginBottom: 12 }}>
                  Customers can cancel bookings without penalty up to 2 hours before the scheduled time slot:
                </p>
                <ul style={{ paddingLeft: 20, color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 8 }}>
                  <li>Cancellations before 2 hours are eligible for 100% full refund to original payment source (UPI/Card).</li>
                  <li>Refunds are automatically processed within 3-5 business days.</li>
                  <li>If a service partner fails to arrive or delivers substandard work, our 100% Service Guarantee covers free re-service or immediate full refund.</li>
                </ul>
              </section>

              {/* Section 9 */}
              <section id="grievance" style={{ marginBottom: 44 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: "#fff" }}>
                  9. Grievance Redressal Officer (IT Act 2000 Compliance)
                </h2>
                <p className="text-muted" style={{ marginBottom: 16 }}>
                  In accordance with Information Technology Act, 2000 and Rules made thereunder, the name and contact details of the Grievance Officer are published below:
                </p>

                <div
                  style={{
                    padding: 24,
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 20,
                  }}
                >
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
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 6 }}>
                      <FiMail color="var(--primary)" /> <strong>Email:</strong> grievance@servebook.in
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 6 }}>
                      <FiPhone color="var(--primary)" /> <strong>Phone:</strong> 022-6890-4100
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

      {/* Security Architecture Audit Tab (For Technical Recruiters & Audits) */}
      {activeTab === "security_audit" && (
        <div className="container" style={{ padding: "48px 16px 80px" }}>
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 40px" }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10 }}>
              Full-Stack Technical Security Architecture
            </h2>
            <p className="text-muted text-sm">
              Engineered with defense-in-depth principles across frontend network, backend API routing, database, and encryption layers.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
              marginBottom: 40,
            }}
          >
            {securityFeatures.map((feat, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: 24,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <div style={{ marginBottom: 12 }}>{feat.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{feat.title}</h3>
                <p className="text-muted text-sm" style={{ margin: 0, lineHeight: 1.6 }}>{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Defense in depth layers */}
          <div
            className="card"
            style={{
              padding: 32,
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <FiLayers color="var(--primary)" /> Defense-in-Depth Layer Breakdown
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
              <div style={{ borderLeft: "3px solid var(--primary)", paddingLeft: 14 }}>
                <strong style={{ fontSize: 14, color: "#fff" }}>1. Application & Input Layer</strong>
                <p className="text-muted text-xs" style={{ marginTop: 4 }}>
                  Real-time frontend validation, sanitized inputs, and express-validator middleware preventing malformed payloads.
                </p>
              </div>
              <div style={{ borderLeft: "3px solid #10b981", paddingLeft: 14 }}>
                <strong style={{ fontSize: 14, color: "#fff" }}>2. Session & Token Layer</strong>
                <p className="text-muted text-xs" style={{ marginTop: 4 }}>
                  Dual-token JWT architecture with strict RBAC access guards and cryptographic token validation.
                </p>
              </div>
              <div style={{ borderLeft: "3px solid #f59e0b", paddingLeft: 14 }}>
                <strong style={{ fontSize: 14, color: "#fff" }}>3. Database & Storage Layer</strong>
                <p className="text-muted text-xs" style={{ marginTop: 4 }}>
                  MongoDB Atlas replica cluster with IP access controls, TLS 1.3 in-transit, and AES-256 at-rest encryption.
                </p>
              </div>
              <div style={{ borderLeft: "3px solid #ec4899", paddingLeft: 14 }}>
                <strong style={{ fontSize: 14, color: "#fff" }}>4. Security Headers (Helmet)</strong>
                <p className="text-muted text-xs" style={{ marginTop: 4 }}>
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
