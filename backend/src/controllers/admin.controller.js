const User = require("../models/User");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalVendors, totalServices, totalBookings, pendingVendors, pendingServices] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "vendor" }),
      Service.countDocuments(),
      Booking.countDocuments(),
      User.countDocuments({ role: "vendor", isApproved: false }),
      Service.countDocuments({ isApproved: false }),
    ]);

    const revenueAgg = await Booking.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" }, platformRevenue: { $sum: "$platformFee" } } }
    ]);

    const monthlyBookings = await Booking.aggregate([
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 }, revenue: { $sum: "$platformFee" } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } }, { $limit: 12 }
    ]);

    const topVendors = await Booking.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$vendor", totalBookings: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } },
      { $sort: { totalBookings: -1 } }, { $limit: 5 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "vendor" } },
      { $unwind: "$vendor" },
      { $project: { "vendor.name": 1, "vendor.businessName": 1, "vendor.avatar": 1, totalBookings: 1, revenue: 1 } }
    ]);

    res.json({
      stats: { totalUsers, totalVendors, totalServices, totalBookings, pendingVendors, pendingServices,
        totalRevenue: revenueAgg[0]?.totalRevenue || 0, platformRevenue: revenueAgg[0]?.platformRevenue || 0 },
      monthlyBookings, topVendors
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.approveVendor = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: req.body.approve }, { new: true });
    res.json({ user, message: `Vendor ${req.body.approve ? "approved" : "rejected"}` });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.approveService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, { isApproved: req.body.approve }, { new: true });
    res.json({ service, message: `Service ${req.body.approve ? "approved" : "rejected"}` });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$text = { $search: search };
    const users = await User.find(filter).sort({ createdAt: -1 }).skip((page-1)*limit).limit(Number(limit));
    const total = await User.countDocuments(filter);
    res.json({ users, total });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllServices = async (req, res) => {
  try {
    const { approved, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (approved !== undefined) filter.isApproved = approved === "true";
    const services = await Service.find(filter).populate("vendor","name businessName").sort({ createdAt: -1 }).skip((page-1)*limit).limit(Number(limit));
    const total = await Service.countDocuments(filter);
    res.json({ services, total });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.json({ user, message: `User ${user.isActive ? "activated" : "deactivated"}` });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
