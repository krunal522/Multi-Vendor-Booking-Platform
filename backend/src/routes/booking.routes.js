const express = require("express");
const router = express.Router();
const { createBooking, getMyBookings, getBookingById, updateBookingStatus, cancelBooking } = require("../controllers/booking.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const { bookingValidation, validate } = require("../middleware/validator.middleware");

router.post("/", protect, authorize("customer", "admin"), bookingValidation, validate, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id/status", protect, updateBookingStatus);
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;
