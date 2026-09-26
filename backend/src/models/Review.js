const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  booking:  { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true, unique: true },
  service:  { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true, index: true },
  vendor:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  title:    String,
  comment:  { type: String, required: true, maxlength: 500 },
  images:   [String],
  isVerified: { type: Boolean, default: true }, // Only booked users can review
  vendorReply: String,
  helpfulCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
