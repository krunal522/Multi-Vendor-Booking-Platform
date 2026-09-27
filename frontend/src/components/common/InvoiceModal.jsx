import React from "react";
import { FiDownload, FiPrinter, FiX, FiCheckCircle } from "react-icons/fi";

export default function InvoiceModal({ booking, onClose }) {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${booking._id ? booking._id.slice(-6).toUpperCase() : "000000"}`;
  const issueDate = booking.createdAt
    ? new Date(booking.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN");

  const formatAddress = (addr) => {
    if (!addr) return "Customer Residence";
    if (typeof addr === "string") return addr;
    const parts = [addr.street, addr.city, addr.pincode].filter(Boolean);
    return parts.length ? parts.join(", ") : "Customer Residence";
  };

  const subtotal = booking.totalAmount || 0;
  const platformFee = Math.round(subtotal * 0.05); // 5% platform fee
  const grandTotal = subtotal;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal invoice-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 650, width: "95%", padding: 0, overflow: "hidden" }}
      >
        {/* Actions bar (hidden in print) */}
        <div
          className="invoice-actions-bar no-print"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            background: "var(--surface2)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="badge badge-success">Official Receipt</span>
            <span className="text-sm text-muted font-mono">{invoiceNumber}</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-outline btn-sm" onClick={handlePrint}>
              <FiPrinter /> Print / Save PDF
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div
          className="invoice-content-box"
          id="printable-invoice"
          style={{ padding: 32, background: "var(--surface)", color: "var(--text)" }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: "2px solid rgba(99, 102, 241, 0.2)",
              paddingBottom: 24,
              marginBottom: 24,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  margin: 0,
                }}
              >
                ServeBook
              </h2>
              <p className="text-muted text-xs" style={{ marginTop: 4 }}>
                Multi-Vendor On-Demand Services Platform
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>TAX INVOICE</div>
              <div className="text-sm text-muted font-mono" style={{ marginTop: 2 }}>
                {invoiceNumber}
              </div>
              <div className="text-xs text-muted">Date: {issueDate}</div>
            </div>
          </div>

          {/* Parties Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              marginBottom: 28,
            }}
          >
            <div>
              <div className="text-xs text-muted uppercase font-bold tracking-wider" style={{ marginBottom: 6 }}>
                Service Provider (Vendor):
              </div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>
                {booking.vendor?.businessName || booking.vendor?.name || "Verified Partner"}
              </div>
              <div className="text-sm text-muted">
                Category: {booking.service?.category || "Professional Service"}
              </div>
              {booking.vendor?.phone && (
                <div className="text-xs text-muted">Phone: {booking.vendor.phone}</div>
              )}
            </div>

            <div style={{ textAlign: "right" }}>
              <div className="text-xs text-muted uppercase font-bold tracking-wider" style={{ marginBottom: 6 }}>
                Billed To (Customer):
              </div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>
                {booking.customer?.name || "Valued Customer"}
              </div>
              <div className="text-sm text-muted">{booking.customer?.email}</div>
              <div className="text-xs text-muted" style={{ marginTop: 4 }}>
                Address: {formatAddress(booking.address)}
              </div>
            </div>
          </div>

          {/* Service Details Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 24,
              fontSize: 14,
            }}
          >
            <thead>
              <tr style={{ background: "rgba(255, 255, 255, 0.04)", borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>Description</th>
                <th style={{ padding: "10px 12px", textAlign: "center" }}>Scheduled Slot</th>
                <th style={{ padding: "10px 12px", textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "14px 12px" }}>
                  <div style={{ fontWeight: 600 }}>{booking.service?.title}</div>
                  <div className="text-xs text-muted">
                    Service Delivery Booking #{booking._id?.slice(-8)}
                  </div>
                </td>
                <td style={{ padding: "14px 12px", textAlign: "center", color: "var(--text-muted)" }}>
                  {booking.slot?.date} <br />
                  <span style={{ fontSize: 12 }}>{booking.slot?.startTime}</span>
                </td>
                <td style={{ padding: "14px 12px", textAlign: "right", fontWeight: 700 }}>
                  ₹{(subtotal - platformFee).toLocaleString()}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "10px 12px", color: "var(--text-muted)" }}>
                  Platform Convenience & Technology Fee
                </td>
                <td style={{ padding: "10px 12px", textAlign: "center", color: "var(--text-muted)" }}>—</td>
                <td style={{ padding: "10px 12px", textAlign: "right" }}>₹{platformFee.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          {/* Total Summary */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", maxWidth: 300 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--success)", fontWeight: 600, marginBottom: 4 }}>
                <FiCheckCircle size={14} /> Payment Verified ({booking.payment?.method?.toUpperCase() || "ONLINE"})
              </div>
              Thank you for trusting ServeBook verified service professionals.
            </div>

            <div style={{ textAlign: "right" }}>
              <div className="text-xs text-muted">Grand Total:</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--primary)" }}>
                ₹{grandTotal.toLocaleString()}
              </div>
              <span className="badge badge-success" style={{ marginTop: 4 }}>
                PAID & DELIVERED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
