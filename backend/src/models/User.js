const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, index: true },
  password:     { type: String, required: true, select: false },
  role:         { type: String, enum: ["customer","vendor","admin"], default: "customer" },
  avatar:       { type: String, default: "" },
  phone:        { type: String, default: "" },
  address: {
    street: String, city: String, state: String, pincode: String
  },
  isVerified:   { type: Boolean, default: false },
  isActive:     { type: Boolean, default: true },
  refreshToken: { type: String, select: false },
  // Vendor specific
  businessName: String,
  businessDescription: String,
  businessCategory: String,
  rating:       { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalEarnings:{ type: Number, default: 0 },
  isApproved:   { type: Boolean, default: false }, // Admin approves vendors
}, { timestamps: true });

// Hash password before save
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// MongoDB index for text search
userSchema.index({ name: "text", email: "text", businessName: "text" });

module.exports = mongoose.model("User", userSchema);
