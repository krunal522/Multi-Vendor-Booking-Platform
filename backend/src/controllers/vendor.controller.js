const Booking = require("../models/Booking");
const Service = require("../models/Service");
const User = require("../models/User");

exports.getDashboard = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const [totalBookings, pendingBookings, completedBookings, cancelledBookings, services] = await Promise.all([
      Booking.countDocuments({ vendor: vendorId }),
      Booking.countDocuments({ vendor: vendorId, status: "pending" }),
      Booking.countDocuments({ vendor: vendorId, status: "completed" }),
      Booking.countDocuments({ vendor: vendorId, status: "cancelled" }),
      Service.countDocuments({ vendor: vendorId }),
    ]);

    // Revenue aggregation (last 6 months)
    const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const revenueData = await Booking.aggregate([
      { $match: { vendor: vendorId, status: "completed", createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, revenue: { $sum: "$vendorEarnings" }, count: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const totalRevenue = await Booking.aggregate([
      { $match: { vendor: vendorId, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$vendorEarnings" } } }
    ]);

    const recentBookings = await Booking.find({ vendor: vendorId })
      .populate("customer", "name avatar phone").populate("service", "title category price")
      .sort({ createdAt: -1 }).limit(5);

    res.json({
      stats: { totalBookings, pendingBookings, completedBookings, cancelledBookings, services, totalRevenue: totalRevenue[0]?.total || 0 },
      revenueData,
      recentBookings
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getVendorBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, date } = req.query;
    const filter = { vendor: req.user._id };
    if (status && status !== "all") filter.status = status;
    if (date) filter["slot.date"] = date;
    const bookings = await Booking.find(filter)
      .populate("customer", "name avatar phone email")
      .populate("service", "title category price images")
      .sort({ createdAt: -1 }).skip((page-1)*limit).limit(Number(limit));
    const total = await Booking.countDocuments(filter);
    res.json({ bookings, total });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getEarnings = async (req, res) => {
  try {
    const { period = "monthly" } = req.query;
    const groupBy = period === "daily" ? { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } }
      : { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };

    const earnings = await Booking.aggregate([
      { $match: { vendor: req.user._id, status: "completed" } },
      { $group: { _id: groupBy, revenue: { $sum: "$vendorEarnings" }, bookings: { $sum: 1 }, platformFee: { $sum: "$platformFee" } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    res.json({ earnings });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
