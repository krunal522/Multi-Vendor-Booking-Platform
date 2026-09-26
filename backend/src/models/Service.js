const mongoose = require("mongoose");
const slugify = require("slugify");

const slotSchema = new mongoose.Schema({
  date:      { type: String, required: true }, // YYYY-MM-DD
  startTime: { type: String, required: true }, // HH:MM
  endTime:   { type: String, required: true },
  isBooked:  { type: Boolean, default: false },
  maxBookings: { type: Number, default: 1 },
  currentBookings: { type: Number, default: 0 },
});

const serviceSchema = new mongoose.Schema({
  vendor:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title:        { type: String, required: true, trim: true },
  slug:         { type: String, unique: true },
  description:  { type: String, required: true },
  category:     { type: String, required: true, index: true,
                  enum: ["Salon","Home Cleaning","Plumbing","Electrical","AC Repair","Pest Control","Painting","Carpentry","Appliance Repair","Beauty & Spa"] },
  subcategory:  String,
  price:        { type: Number, required: true, min: 0 },
  priceType:    { type: String, enum: ["fixed","hourly","starting_from"], default: "fixed" },
  duration:     { type: Number, required: true }, // minutes
  images:       [String],
  tags:         [String],
  location: {
    city:    { type: String, required: true, index: true },
    state:   String,
    pincode: String,
    address: String,
  },
  slots:        [slotSchema],
  rating:       { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalBookings:{ type: Number, default: 0 },
  isActive:     { type: Boolean, default: true },
  isApproved:   { type: Boolean, default: false },
  isFeatured:   { type: Boolean, default: false },
}, { timestamps: true });

// Auto slug
serviceSchema.pre("save", function(next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true }) + "-" + Date.now();
  }
  next();
});

// Full-text search index
serviceSchema.index({ title: "text", description: "text", tags: "text" });
// Compound index for filtering
serviceSchema.index({ category: 1, "location.city": 1, price: 1, rating: -1 });

module.exports = mongoose.model("Service", serviceSchema);
