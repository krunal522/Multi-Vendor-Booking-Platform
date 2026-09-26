const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const User = require("../models/User");

exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, title, comment } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.customer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    if (booking.status !== "completed") return res.status(400).json({ message: "Can only review completed bookings" });
    if (booking.isReviewed) return res.status(400).json({ message: "Already reviewed" });

    const review = await Review.create({ booking: bookingId, service: booking.service, vendor: booking.vendor, customer: req.user._id, rating, title, comment });
    booking.isReviewed = true;
    await booking.save();

    // Update service & vendor rating
    const serviceReviews = await Review.aggregate([{ $match: { service: booking.service } }, { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } }]);
    await Service.findByIdAndUpdate(booking.service, { rating: serviceReviews[0]?.avg || rating, totalReviews: serviceReviews[0]?.count || 1 });
    const vendorReviews = await Review.aggregate([{ $match: { vendor: booking.vendor } }, { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } }]);
    await User.findByIdAndUpdate(booking.vendor, { rating: vendorReviews[0]?.avg || rating, totalReviews: vendorReviews[0]?.count || 1 });

    res.status(201).json({ review, message: "Review posted successfully!" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getServiceReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate("customer", "name avatar").sort({ createdAt: -1 }).limit(20);
    res.json({ reviews });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
