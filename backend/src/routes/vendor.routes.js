const express = require("express");
const router = express.Router();
const { getDashboard, getVendorBookings, getEarnings } = require("../controllers/vendor.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.get("/dashboard", protect, authorize("vendor"), getDashboard);
router.get("/bookings", protect, authorize("vendor"), getVendorBookings);
router.get("/earnings", protect, authorize("vendor"), getEarnings);

module.exports = router;
