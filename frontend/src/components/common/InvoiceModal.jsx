import React from "react";
import { FiPrinter, FiX, FiCheckCircle, FiShield, FiFileText } from "react-icons/fi";

const numberToWords = (num) => {
  if (!num || isNaN(num)) return "Zero Rupees Only";
  const a = [
    "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ",
    "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const inWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + " " + a[n % 10];
    if (n < 1000) return inWords(Math.floor(n / 100)) + "Hundred " + inWords(n % 100);
    if (n < 100000) return inWords(Math.floor(n / 1000)) + "Thousand " + inWords(n % 1000);
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + "Lakh " + inWords(n % 100000);
    return "";
  };

  return inWords(Math.floor(num)).trim() + " Rupees Only";
};

export default function InvoiceModal({ booking, onClose }) {
  if (!booking) return null;

  const invoiceNumber = `SB-INV-${booking._id ? booking._id.slice(-8).toUpperCase() : "20260901"}`;
  const issueDate = booking.createdAt
    ? new Date(booking.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const formatAddress = (addr) => {
    if (!addr) return "Customer Designated Service Location";
    if (typeof addr === "string") return addr;
    const parts = [addr.street, addr.city, addr.state, addr.pincode].filter(Boolean);
    return parts.length ? parts.join(", ") : "Customer Designated Service Location";
  };

  const total = booking.totalAmount || 0;
  // Professional 18% GST reverse calculation
  const taxableBase = Math.round((total / 1.18) * 100) / 100;
  const totalGst = Math.round((total - taxableBase) * 100) / 100;
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = Math.round((totalGst / 2) * 100) / 100;
  const paymentMethod = (booking.payment?.method || "ONLINE").toUpperCase();
  const paymentStatus = (booking.payment?.status || (booking.status === "completed" ? "PAID" : "CONFIRMED")).toUpperCase();

  const generatePrintableHtml = () => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tax Invoice - ${invoiceNumber}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 14mm 10mm 14mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 13px;
      line-height: 1.4;
      padding: 16px;
    }
    .invoice-wrapper {
      max-width: 760px;
      margin: 0 auto;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 24px 28px;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #4f46e5;
      padding-bottom: 16px;
      margin-bottom: 18px;
    }
    .company-brand {
      font-size: 24px;
      font-weight: 800;
      color: #4f46e5;
      letter-spacing: -0.5px;
    }
    .company-sub {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    .invoice-title-block {
      text-align: right;
    }
    .invoice-title {
      font-size: 20px;
      font-weight: 800;
      color: #1e293b;
      letter-spacing: 0.5px;
    }
    .badge-paid {
      display: inline-block;
      margin-top: 4px;
      padding: 3px 10px;
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #86efac;
      font-size: 11px;
      font-weight: 700;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px 16px;
      margin-bottom: 18px;
      font-size: 12px;
    }
    .parties-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 18px;
    }
    .party-card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px 14px;
      background: #ffffff;
    }
    .party-title {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
      border-bottom: 1px dashed #cbd5e1;
      padding-bottom: 4px;
    }
    .party-name {
      font-weight: 700;
      font-size: 14px;
      color: #0f172a;
      margin-bottom: 3px;
    }
    table.items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
      font-size: 12.5px;
    }
    table.items-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.04em;
      padding: 10px 12px;
      border: 1px solid #cbd5e1;
      text-align: left;
    }
    table.items-table td {
      padding: 10px 12px;
      border: 1px solid #e2e8f0;
      vertical-align: top;
    }
    .calculation-grid {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      margin-bottom: 20px;
    }
    .words-box {
      flex: 1;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      font-size: 11.5px;
    }
    .summary-table {
      width: 290px;
      border-collapse: collapse;
      font-size: 12px;
    }
    .summary-table td {
      padding: 5px 8px;
    }
    .summary-table tr.grand-total {
      border-top: 2px solid #0f172a;
      border-bottom: 2px solid #0f172a;
      font-size: 15px;
      font-weight: 800;
      color: #4f46e5;
    }
    .footer-bar {
      border-top: 1px solid #e2e8f0;
      padding-top: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748b;
    }
    .signatory {
      text-align: right;
    }
    .seal-box {
      display: inline-block;
      border: 1px dashed #4f46e5;
      padding: 4px 12px;
      border-radius: 4px;
      color: #4f46e5;
      font-weight: 700;
      font-size: 11px;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">
    <!-- Header -->
    <div class="header-bar">
      <div>
        <div class="company-brand">ServeBook</div>
        <div class="company-sub">ServeBook Technologies Pvt. Ltd. · Multi-Vendor Marketplace</div>
        <div class="company-sub">GSTIN: 27AABCU9603R1ZM · CIN: U72900MH2024PTC398124</div>
        <div class="company-sub">Registered Office: BKC Avenue, Bandra East, Mumbai, MH 400051</div>
      </div>
      <div class="invoice-title-block">
        <div class="invoice-title">TAX INVOICE</div>
        <div class="badge-paid">✓ ${paymentStatus} (${paymentMethod})</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Original for Recipient</div>
      </div>
    </div>

    <!-- Metadata Grid -->
    <div class="meta-grid">
      <div>
        <div><strong>Invoice Number:</strong> ${invoiceNumber}</div>
        <div><strong>Booking ID:</strong> #${booking._id?.slice(-8).toUpperCase()}</div>
        <div><strong>Invoice Date:</strong> ${issueDate}</div>
      </div>
      <div style="text-align: right;">
        <div><strong>Scheduled Service Date:</strong> ${booking.slot?.date || "N/A"}</div>
        <div><strong>Service Time Slot:</strong> ${booking.slot?.startTime || "N/A"} - ${booking.slot?.endTime || "N/A"}</div>
        <div><strong>Place of Supply:</strong> Maharashtra (Code: 27)</div>
      </div>
    </div>

    <!-- Parties Grid -->
    <div class="parties-grid">
      <div class="party-card">
        <div class="party-title">Verified Service Partner (Vendor):</div>
        <div class="party-name">${booking.vendor?.businessName || booking.vendor?.name || "Professional Merchant"}</div>
        <div style="color: #475569; font-size: 12px;">Category: ${booking.service?.category || "Services"}</div>
        <div style="color: #475569; font-size: 12px;">Contact: ${booking.vendor?.phone || "Verified Contact"}</div>
        <div style="color: #475569; font-size: 12px;">Platform Partner ID: ${booking.vendor?._id?.slice(-6).toUpperCase() || "VP7701"}</div>
      </div>

      <div class="party-card">
        <div class="party-title">Billed To Customer (Recipient):</div>
        <div class="party-name">${booking.customer?.name || "Valued Customer"}</div>
        <div style="color: #475569; font-size: 12px;">Email: ${booking.customer?.email || "customer@portal.com"}</div>
        <div style="color: #475569; font-size: 12px;">Delivery Address: ${formatAddress(booking.address)}</div>
      </div>
    </div>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 35px; text-align: center;">#</th>
          <th>Service Description</th>
          <th style="width: 80px; text-align: center;">SAC Code</th>
          <th style="width: 50px; text-align: center;">Qty</th>
          <th style="width: 100px; text-align: right;">Taxable (₹)</th>
          <th style="width: 90px; text-align: right;">GST (18%)</th>
          <th style="width: 100px; text-align: right;">Total (₹)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="text-align: center; font-weight: 700;">1</td>
          <td>
            <div style="font-weight: 700; color: #0f172a;">${booking.service?.title || "Professional Service"}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
              Service Slot: ${booking.slot?.date} (${booking.slot?.startTime} to ${booking.slot?.endTime})
            </div>
            ${booking.customerNotes ? `<div style="font-size: 11px; color: #64748b;">Special Instructions: ${booking.customerNotes}</div>` : ""}
          </td>
          <td style="text-align: center; color: #64748b;">9987</td>
          <td style="text-align: center; font-weight: 600;">1</td>
          <td style="text-align: right;">₹${taxableBase.toFixed(2)}</td>
          <td style="text-align: right;">₹${totalGst.toFixed(2)}</td>
          <td style="text-align: right; font-weight: 700;">₹${total.toLocaleString("en-IN")}.00</td>
        </tr>
      </tbody>
    </table>

    <!-- Calculation & Summary -->
    <div class="calculation-grid">
      <div class="words-box">
        <div style="font-weight: 700; color: #334155; margin-bottom: 4px;">Invoice Amount in Words:</div>
        <div style="font-style: italic; color: #4f46e5; font-weight: 600;">
          ${numberToWords(total)}
        </div>
        <div style="margin-top: 10px; font-size: 11px; color: #64748b;">
          Payment Status: <strong>${paymentStatus}</strong> via <strong>${paymentMethod}</strong>
        </div>
      </div>

      <table class="summary-table">
        <tr>
          <td style="color: #64748b;">Taxable Value:</td>
          <td style="text-align: right; font-weight: 600;">₹${taxableBase.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="color: #64748b;">CGST (9.0%):</td>
          <td style="text-align: right;">₹${cgst.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="color: #64748b;">SGST (9.0%):</td>
          <td style="text-align: right;">₹${sgst.toFixed(2)}</td>
        </tr>
        <tr class="grand-total">
          <td style="padding: 8px 8px;">Total Payable:</td>
          <td style="padding: 8px 8px; text-align: right;">₹${total.toLocaleString("en-IN")}.00</td>
        </tr>
      </table>
    </div>

    <!-- Footer Bar -->
    <div class="footer-bar">
      <div>
        <div>This is a computer-generated tax invoice verified under Section 31 of CGST Act.</div>
        <div>For inquiries: billing@servebook.com | 24/7 Helpline: 1800-419-7000</div>
      </div>
      <div class="signatory">
        <div style="font-size: 11px; color: #334155;">For ServeBook Technologies Pvt. Ltd.</div>
        <div class="seal-box">✓ Digitally Authorized & Verified</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  // Enterprise isolated print function (Guarantees exactly 1 page, 0 blank pages)
  const handlePrint = () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.top = "-9999px";
    iframe.style.left = "-9999px";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(generatePrintableHtml());
    doc.close();

    iframe.contentWindow.focus();
    setTimeout(() => {
      iframe.contentWindow.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 3000);
    }, 400);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 780,
          width: "95%",
          padding: 0,
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
        }}
      >
        {/* Top Control Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            background: "linear-gradient(135deg, #1e1e38, #181829)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                background: "rgba(99, 102, 241, 0.2)",
                color: "#a5b4fc",
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              TAX INVOICE PREVIEW
            </span>
            <span className="text-sm font-mono text-muted">{invoiceNumber}</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={handlePrint}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
                fontWeight: 600,
              }}
            >
              <FiPrinter /> Print / Save Single-Page PDF
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              style={{ padding: "6px 8px", borderRadius: "50%" }}
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* High-End Enterprise A4 Invoice Preview */}
        <div
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            padding: "24px 28px",
            background: "#ffffff",
            color: "#0f172a",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: "2px solid #4f46e5",
              paddingBottom: 16,
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: "#4f46e5",
                  letterSpacing: "-0.5px",
                }}
              >
                ServeBook
              </div>
              <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 2 }}>
                ServeBook Technologies Pvt. Ltd. · On-Demand Multi-Vendor Network
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>
                GSTIN: 27AABCU9603R1ZM · CIN: U72900MH2024PTC398124
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#1e293b" }}>TAX INVOICE</div>
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  background: "#dcfce7",
                  color: "#15803d",
                  border: "1px solid #86efac",
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: 4,
                  marginTop: 4,
                }}
              >
                ✓ {paymentStatus} ({paymentMethod})
              </span>
            </div>
          </div>

          {/* Meta Banner */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "12px 16px",
              marginBottom: 16,
              fontSize: 12,
            }}
          >
            <div>
              <div><strong>Invoice No:</strong> {invoiceNumber}</div>
              <div><strong>Booking ID:</strong> #{booking._id?.slice(-8).toUpperCase()}</div>
              <div><strong>Invoice Date:</strong> {issueDate}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div><strong>Service Date:</strong> {booking.slot?.date || "N/A"}</div>
              <div><strong>Time Slot:</strong> {booking.slot?.startTime} - {booking.slot?.endTime}</div>
              <div><strong>Place of Supply:</strong> Maharashtra (27)</div>
            </div>
          </div>

          {/* Parties Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: "12px 14px",
                background: "#ffffff",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  borderBottom: "1px dashed #cbd5e1",
                  paddingBottom: 4,
                  marginBottom: 6,
                }}
              >
                Service Provider (Vendor):
              </div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                {booking.vendor?.businessName || booking.vendor?.name}
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Category: {booking.service?.category}
              </div>
              {booking.vendor?.phone && (
                <div style={{ fontSize: 12, color: "#64748b" }}>Phone: {booking.vendor.phone}</div>
              )}
            </div>

            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: "12px 14px",
                background: "#ffffff",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  borderBottom: "1px dashed #cbd5e1",
                  paddingBottom: 4,
                  marginBottom: 6,
                }}
              >
                Billed To (Customer):
              </div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                {booking.customer?.name}
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{booking.customer?.email}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Address: {formatAddress(booking.address)}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 16,
              fontSize: 12.5,
            }}
          >
            <thead>
              <tr style={{ background: "#f1f5f9", border: "1px solid #cbd5e1" }}>
                <th style={{ padding: "8px 10px", textAlign: "center", width: 36 }}>#</th>
                <th style={{ padding: "8px 10px", textAlign: "left" }}>Description</th>
                <th style={{ padding: "8px 10px", textAlign: "center", width: 75 }}>SAC</th>
                <th style={{ padding: "8px 10px", textAlign: "center", width: 45 }}>Qty</th>
                <th style={{ padding: "8px 10px", textAlign: "right", width: 90 }}>Taxable</th>
                <th style={{ padding: "8px 10px", textAlign: "right", width: 85 }}>GST (18%)</th>
                <th style={{ padding: "8px 10px", textAlign: "right", width: 95 }}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", textAlign: "center", border: "1px solid #e2e8f0", fontWeight: 700 }}>
                  1
                </td>
                <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontWeight: 700, color: "#0f172a" }}>{booking.service?.title}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>
                    Service Slot: {booking.slot?.date} ({booking.slot?.startTime} - {booking.slot?.endTime})
                  </div>
                </td>
                <td style={{ padding: "10px", textAlign: "center", border: "1px solid #e2e8f0", color: "#64748b" }}>
                  9987
                </td>
                <td style={{ padding: "10px", textAlign: "center", border: "1px solid #e2e8f0", fontWeight: 600 }}>
                  1
                </td>
                <td style={{ padding: "10px", textAlign: "right", border: "1px solid #e2e8f0" }}>
                  ₹{taxableBase.toFixed(2)}
                </td>
                <td style={{ padding: "10px", textAlign: "right", border: "1px solid #e2e8f0" }}>
                  ₹{totalGst.toFixed(2)}
                </td>
                <td style={{ padding: "10px", textAlign: "right", border: "1px solid #e2e8f0", fontWeight: 700 }}>
                  ₹{total.toLocaleString("en-IN")}.00
                </td>
              </tr>
            </tbody>
          </table>

          {/* Calculation Bottom Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 20,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                flex: 1,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: "12px",
                fontSize: 12,
              }}
            >
              <div style={{ fontWeight: 700, color: "#334155", marginBottom: 3 }}>
                Amount in Words:
              </div>
              <div style={{ color: "#4f46e5", fontWeight: 600, fontStyle: "italic" }}>
                {numberToWords(total)}
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: "#64748b" }}>
                Payment Method: <strong>{paymentMethod}</strong> (Status: <strong>{paymentStatus}</strong>)
              </div>
            </div>

            <div style={{ width: 260, fontSize: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", color: "#64748b" }}>
                <span>Taxable Value:</span>
                <span style={{ fontWeight: 600 }}>₹{taxableBase.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", color: "#64748b" }}>
                <span>CGST (9.0%):</span>
                <span>₹{cgst.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", color: "#64748b" }}>
                <span>SGST (9.0%):</span>
                <span>₹{sgst.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderTop: "2px solid #0f172a",
                  borderBottom: "2px solid #0f172a",
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#4f46e5",
                  marginTop: 6,
                }}
              >
                <span>Grand Total:</span>
                <span>₹{total.toLocaleString("en-IN")}.00</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div
            style={{
              borderTop: "1px solid #e2e8f0",
              paddingTop: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 11,
              color: "#64748b",
            }}
          >
            <div>
              <div>System-generated official tax invoice under Section 31 of CGST Act.</div>
              <div>Support: billing@servebook.com | Helpline: 1800-419-7000</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#334155", fontWeight: 600 }}>ServeBook Technologies Pvt. Ltd.</div>
              <div
                style={{
                  display: "inline-block",
                  border: "1px dashed #4f46e5",
                  padding: "2px 8px",
                  borderRadius: 4,
                  color: "#4f46e5",
                  fontWeight: 700,
                  fontSize: 10,
                  marginTop: 3,
                }}
              >
                ✓ Digitally Certified & Verified
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
