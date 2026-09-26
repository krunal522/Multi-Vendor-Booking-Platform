const Service = require("../models/Service");
const User = require("../models/User");

const generateSlots = () => {
  const slots = [];
  for (let d = 1; d <= 14; d++) {
    const date = new Date(); date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split("T")[0];
    ["09:00","11:00","13:00","15:00","17:00"].forEach(time => {
      const [h] = time.split(":").map(Number);
      slots.push({ date: dateStr, startTime: time, endTime: `${String(h + 1).padStart(2,"0")}:00`, isBooked: false });
    });
  }
  return slots;
};

exports.getServices = async (req, res) => {
  try {
    const { category, city, minPrice, maxPrice, rating, sort, search, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true, isApproved: true };
    if (category) filter.category = category;
    if (city) filter["location.city"] = new RegExp(city, "i");
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    if (rating) filter.rating = { $gte: Number(rating) };
    if (search) filter.$text = { $search: search };

    const sortMap = { price_asc: { price: 1 }, price_desc: { price: -1 }, rating: { rating: -1 }, newest: { createdAt: -1 }, popular: { totalBookings: -1 } };
    const sortOpt = sortMap[sort] || { isFeatured: -1, rating: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [services, total] = await Promise.all([
      Service.find(filter).populate("vendor", "name avatar rating businessName").sort(sortOpt).skip(skip).limit(Number(limit)),
      Service.countDocuments(filter),
    ]);
    res.json({ services, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] })
      .populate("vendor", "name avatar rating totalReviews businessName businessDescription phone");
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ service });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createService = async (req, res) => {
  try {
    let vendorId = req.user._id;
    const isAdmin = req.user.role === "admin";

    if (isAdmin) {
      if (req.body.vendor) {
        vendorId = req.body.vendor;
      } else {
        const anyVendor = await User.findOne({ role: "vendor" });
        if (anyVendor) vendorId = anyVendor._id;
      }
    }

    const serviceData = {
      ...req.body,
      vendor: vendorId,
      isApproved: isAdmin ? true : false,
    };

    if (!serviceData.slots || serviceData.slots.length === 0) {
      serviceData.slots = generateSlots();
    }

    const service = await Service.create(serviceData);
    res.status(201).json({ 
      service, 
      message: isAdmin ? "Service created and approved successfully!" : "Service created! Pending admin approval." 
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateService = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, vendor: req.user._id };
    const service = await Service.findOne(filter);
    if (!service) return res.status(404).json({ message: "Service not found" });
    Object.assign(service, req.body);
    await service.save();
    res.json({ service, message: "Service updated successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteService = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, vendor: req.user._id };
    const deleted = await Service.findOneAndDelete(filter);
    if (!deleted) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addSlots = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, vendor: req.user._id };
    const service = await Service.findOne(filter);
    if (!service) return res.status(404).json({ message: "Service not found" });
    service.slots.push(...req.body.slots);
    await service.save();
    res.json({ service, message: "Slots added successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getCategories = async (req, res) => {
  try {
    const cats = await Service.aggregate([
      { $match: { isActive: true, isApproved: true } },
      { $group: { _id: "$category", count: { $sum: 1 }, avgRating: { $avg: "$rating" } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ categories: cats });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getFeatured = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true, isApproved: true, isFeatured: true })
      .populate("vendor", "name avatar businessName").limit(8).sort({ rating: -1 });
    res.json({ services });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
