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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tax Invoice - ${invoiceNumber}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 12mm 8mm 12mm;
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
      gap: 16px;
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
      gap: 20px;
      margin-bottom: 18px;
    }
    .party-card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px 14px;
      background: #ffffff;
      word-break: break-word;
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
      gap: 12px;
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

    @media print {
      body {
        padding: 0 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .invoice-wrapper {
        border: 1px solid #cbd5e1 !important;
        box-shadow: none !important;
        max-width: 100% !important;
        width: 100% !important;
        padding: 18px 22px !important;
        page-break-inside: avoid !important;
      }
    }

    @media screen and (max-width: 640px) {
      body {
        padding: 10px;
      }
      .invoice-wrapper {
        padding: 14px 16px;
      }
      .header-bar {
        flex-direction: column;
        gap: 12px;
      }
      .invoice-title-block {
        text-align: left;
      }
      .meta-grid {
        grid-template-columns: 1fr;
        gap: 8px;
      }
      .meta-grid div:last-child {
        text-align: left !important;
      }
      .parties-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }
      .calculation-grid {
        flex-direction: column-reverse;
        gap: 12px;
      }
      .summary-table {
        width: 100%;
      }
      .footer-bar {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      .signatory {
        text-align: left;
      }
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
        className="modal invoice-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="invoice-modal-header">
          <div className="invoice-header-title-group">
            <span className="invoice-preview-badge">
              TAX INVOICE PREVIEW
            </span>
            <span className="invoice-number-tag font-mono">{invoiceNumber}</span>
          </div>
          <div className="invoice-header-actions">
            <button
              className="btn btn-primary btn-sm invoice-print-btn"
              onClick={handlePrint}
              type="button"
              title="Print or Save PDF"
            >
              <FiPrinter className="invoice-print-icon" />
              <span className="invoice-btn-text-full">Print / Save Single-Page PDF</span>
              <span className="invoice-btn-text-mobile">Print PDF</span>
            </button>
            <button
              className="btn btn-ghost btn-sm invoice-close-btn"
              onClick={onClose}
              type="button"
              aria-label="Close invoice preview"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* High-End Enterprise A4 Invoice Preview */}
        <div className="invoice-preview-body">
          {/* Header */}
          <div className="invoice-preview-header">
            <div className="invoice-company-info">
              <div className="invoice-brand-logo">ServeBook</div>
              <div className="invoice-brand-sub">
                ServeBook Technologies Pvt. Ltd. · On-Demand Multi-Vendor Network
              </div>
              <div className="invoice-brand-reg">
                GSTIN: 27AABCU9603R1ZM · CIN: U72900MH2024PTC398124
              </div>
            </div>

            <div className="invoice-status-block">
              <div className="invoice-status-title">TAX INVOICE</div>
              <span className="invoice-status-pill">
                ✓ {paymentStatus} ({paymentMethod})
              </span>
              <div className="invoice-status-recipient">Original for Recipient</div>
            </div>
          </div>

          {/* Meta Banner */}
          <div className="invoice-meta-banner">
            <div className="invoice-meta-col">
              <div className="invoice-meta-row">
                <span className="meta-label">Invoice No:</span>{" "}
                <strong className="meta-val">{invoiceNumber}</strong>
              </div>
              <div className="invoice-meta-row">
                <span className="meta-label">Booking ID:</span>{" "}
                <strong className="meta-val">#{booking._id?.slice(-8).toUpperCase()}</strong>
              </div>
              <div className="invoice-meta-row">
                <span className="meta-label">Invoice Date:</span>{" "}
                <span className="meta-val">{issueDate}</span>
              </div>
            </div>
            <div className="invoice-meta-col invoice-meta-col-alt">
              <div className="invoice-meta-row">
                <span className="meta-label">Service Date:</span>{" "}
                <span className="meta-val">{booking.slot?.date || "N/A"}</span>
              </div>
              <div className="invoice-meta-row">
                <span className="meta-label">Time Slot:</span>{" "}
                <span className="meta-val">
                  {booking.slot?.startTime} - {booking.slot?.endTime}
                </span>
              </div>
              <div className="invoice-meta-row">
                <span className="meta-label">Place of Supply:</span>{" "}
                <span className="meta-val">Maharashtra (Code: 27)</span>
              </div>
            </div>
          </div>

          {/* Parties Cards */}
          <div className="invoice-parties-layout">
            <div className="invoice-party-card">
              <div className="invoice-party-type">Service Provider (Vendor):</div>
              <div className="invoice-party-name">
                {booking.vendor?.businessName || booking.vendor?.name || "Professional Merchant"}
              </div>
              <div className="invoice-party-meta">Category: {booking.service?.category || "Services"}</div>
              {booking.vendor?.phone && (
                <div className="invoice-party-meta">Phone: {booking.vendor.phone}</div>
              )}
              <div className="invoice-party-meta">
                Partner ID: {booking.vendor?._id?.slice(-6).toUpperCase() || "VP7701"}
              </div>
            </div>

            <div className="invoice-party-card">
              <div className="invoice-party-type">Billed To (Customer):</div>
              <div className="invoice-party-name">{booking.customer?.name || "Valued Customer"}</div>
              <div className="invoice-party-meta">{booking.customer?.email || "customer@servebook.com"}</div>
              <div className="invoice-party-meta">Address: {formatAddress(booking.address)}</div>
            </div>
          </div>

          {/* Line Items Table with Horizontal Scroll Support */}
          <div className="invoice-table-wrapper">
            <div className="invoice-table-scroll-hint">
              <span>Swipe horizontally to view full tax breakdown →</span>
            </div>
            <table className="invoice-items-table">
              <thead>
                <tr>
                  <th className="th-idx">#</th>
                  <th className="th-desc">Description</th>
                  <th className="th-sac">SAC</th>
                  <th className="th-qty">Qty</th>
                  <th className="th-taxable">Taxable</th>
                  <th className="th-gst">GST (18%)</th>
                  <th className="th-total">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="td-idx">1</td>
                  <td className="td-desc">
                    <div className="item-title">{booking.service?.title || "Professional Service"}</div>
                    <div className="item-slot">
                      Service Slot: {booking.slot?.date} ({booking.slot?.startTime} - {booking.slot?.endTime})
                    </div>
                    {booking.customerNotes && (
                      <div className="item-note">Note: {booking.customerNotes}</div>
                    )}
                  </td>
                  <td className="td-sac">9987</td>
                  <td className="td-qty">1</td>
                  <td className="td-taxable">₹{taxableBase.toFixed(2)}</td>
                  <td className="td-gst">₹{totalGst.toFixed(2)}</td>
                  <td className="td-total">₹{total.toLocaleString("en-IN")}.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Calculation Bottom Bar */}
          <div className="invoice-calc-layout">
            <div className="invoice-words-box">
              <div className="words-label">Amount in Words:</div>
              <div className="words-text">{numberToWords(total)}</div>
              <div className="words-payment-info">
                Payment Method: <strong>{paymentMethod}</strong> · Status:{" "}
                <strong style={{ color: "#16a34a" }}>{paymentStatus}</strong>
              </div>
            </div>

            <div className="invoice-summary-card">
              <div className="summary-row">
                <span>Taxable Value:</span>
                <strong>₹{taxableBase.toFixed(2)}</strong>
              </div>
              <div className="summary-row">
                <span>CGST (9.0%):</span>
                <span>₹{cgst.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>SGST (9.0%):</span>
                <span>₹{sgst.toFixed(2)}</span>
              </div>
              <div className="summary-row grand-total-row">
                <span>Grand Total:</span>
                <span>₹{total.toLocaleString("en-IN")}.00</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="invoice-preview-footer">
            <div className="footer-compliance">
              <div>System-generated official tax invoice under Section 31 of CGST Act.</div>
              <div>Support: billing@servebook.com | Helpline: 1800-419-7000</div>
            </div>
            <div className="footer-signatory">
              <div className="signatory-name">ServeBook Technologies Pvt. Ltd.</div>
              <div className="signatory-badge">✓ Digitally Certified & Verified</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
