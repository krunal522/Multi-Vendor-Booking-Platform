const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customer:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  vendor:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  service:    { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true, index: true },
  slot: {
    date:      { type: String, required: true },
    startTime: { type: String, required: true },
    endTime:   { type: String, required: true },
  },
  status: {
    type: String,
    enum: ["pending","confirmed","in_progress","completed","cancelled","rejected"],
    default: "pending",
    index: true,
  },
  totalAmount:    { type: Number, required: true },
  platformFee:    { type: Number, default: 0 }, // 10% platform fee
  vendorEarnings: { type: Number, default: 0 },
  payment: {
    method:    { type: String, enum: ["online","cash"], default: "online" },
    status:    { type: String, enum: ["pending","paid","refunded","failed"], default: "pending" },
    razorpayOrderId:  String,
    razorpayPaymentId: String,
    paidAt:    Date,
  },
  address: {
    street: String, city: String, state: String, pincode: String
  },
  customerNotes:  String,
  vendorNotes:    String,
  cancelReason:   String,
  isReviewed:     { type: Boolean, default: false },
  statusHistory: [{
    status:    String,
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    note:      String,
  }],
}, { timestamps: true });

// Aggregation index
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ vendor: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);
