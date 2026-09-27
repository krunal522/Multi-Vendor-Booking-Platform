const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Notification = require("../models/Notification");

const sendNotification = async (io, userId, notification) => {
  const notif = await Notification.create({ user: userId, ...notification });
  io?.to(userId.toString()).emit("notification", notif);
};

exports.createBooking = async (req, res) => {
  try {
    const { 
      serviceId, service: bodyService, 
      slotDate, slotStartTime, slotEndTime, 
      slot: bodySlot, 
      address, customerNotes, paymentMethod, paymentSubMethod
    } = req.body;

    const sId = serviceId || bodyService;
    const sDate = slotDate || bodySlot?.date;
    const sStartTime = slotStartTime || bodySlot?.startTime;
    const sEndTime = slotEndTime || bodySlot?.endTime || (sStartTime ? `${parseInt(sStartTime.split(":")[0]) + 1}:00` : "12:00");

    const service = await Service.findById(sId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    // Check slot availability
    let slot = service.slots?.find(s => s.date === sDate && s.startTime === sStartTime);
    if (slot) {
      if (slot.isBooked) {
        return res.status(400).json({ message: "This slot is already booked. Please choose another time slot." });
      }
      slot.isBooked = true;
      slot.currentBookings = (slot.currentBookings || 0) + 1;
    } else {
      service.slots.push({
        date: sDate,
        startTime: sStartTime,
        endTime: sEndTime,
        isBooked: true,
        currentBookings: 1
      });
    }
    await service.save();

    const platformFee = Math.round(service.price * 0.1);
    const booking = await Booking.create({
      customer: req.user._id, 
      vendor: service.vendor, 
      service: service._id,
      slot: { date: sDate, startTime: sStartTime, endTime: sEndTime },
      totalAmount: service.price, 
      platformFee,
      vendorEarnings: service.price - platformFee,
      address, 
      customerNotes,
      payment: { method: paymentMethod === "cash" ? "cash" : "online", subMethod: paymentSubMethod || "" },
      statusHistory: [{ status: "pending", changedBy: req.user._id }]
    });

    const populated = await booking.populate([
      { path: "service", select: "title category price images" },
      { path: "vendor",  select: "name email phone" },
    ]);

    const io = req.app.get("io");
    await sendNotification(io, service.vendor, {
      title: "New Booking Received! 📋",
      message: `${req.user.name} booked ${service.title} for ${sDate || slotDate}`,
      type: "booking", data: { bookingId: booking._id }
    });

    if (io) {
      io.to(service.vendor.toString()).emit("booking_created", populated);
      io.emit("new_booking_created", populated);
    }

    res.status(201).json({ booking: populated, message: "Booking created successfully!" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { customer: req.user._id };
    if (status) filter.status = status;
    const bookings = await Booking.find(filter)
      .populate("service", "title category price images duration")
      .populate("vendor", "name avatar phone")
      .sort({ createdAt: -1 }).skip((page-1)*limit).limit(Number(limit));
    const total = await Booking.countDocuments(filter);
    res.json({ bookings, total });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("service").populate("customer", "name email phone avatar").populate("vendor", "name email phone avatar businessName");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ booking });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const allowed = {
      vendor: ["confirmed","in_progress","completed","rejected"],
      customer: ["cancelled"], admin: ["confirmed","cancelled","completed"]
    };
    if (!allowed[req.user.role]?.includes(status))
      return res.status(403).json({ message: "Not allowed to set this status" });

    booking.status = status;
    booking.statusHistory.push({ status, changedBy: req.user._id, note });
    if (status === "completed") booking.payment.status = "paid";
    if (status === "cancelled") { booking.cancelReason = note; booking.payment.status = "refunded"; }
    await booking.save();

    const io = req.app.get("io");
    const notifyUser = req.user.role === "vendor" ? booking.customer : booking.vendor;

    const displayStatus = {
      pending: "Pending",
      confirmed: "Confirmed",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
      rejected: "Rejected"
    }[status] || status.replace(/_/g, " ");

    await sendNotification(io, notifyUser, {
      title: `Booking ${displayStatus}`,
      message: `Your booking status updated to ${displayStatus}`,
      type: "booking", data: { bookingId: booking._id }
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("service", "title category price images duration")
      .populate("vendor", "name avatar phone businessName")
      .populate("customer", "name avatar phone email");

    if (io) {
      const payload = {
        bookingId: booking._id,
        status: booking.status,
        booking: populatedBooking || booking
      };
      if (booking.customer) io.to(booking.customer.toString()).emit("booking_updated", payload);
      if (booking.vendor) io.to(booking.vendor.toString()).emit("booking_updated", payload);
      io.emit("booking_status_changed", payload);
    }

    res.json({ booking: populatedBooking || booking, message: `Booking ${status}` });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.cancelBooking = async (req, res) => {
  req.body.status = "cancelled";
  return exports.updateBookingStatus(req, res);
};
