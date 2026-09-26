const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title:   { type: String, required: true },
  message: { type: String, required: true },
  type:    { type: String, enum: ["booking","payment","review","system","vendor"], default: "system" },
  data:    mongoose.Schema.Types.Mixed, // Extra data (bookingId, etc.)
  isRead:  { type: Boolean, default: false, index: true },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
