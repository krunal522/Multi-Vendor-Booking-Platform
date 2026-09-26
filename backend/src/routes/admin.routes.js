const express = require("express");
const router = express.Router();
const { getDashboard, approveVendor, approveService, getUsers, getAllServices, toggleUserStatus } = require("../controllers/admin.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.use(protect, authorize("admin"));
router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.get("/services", getAllServices);
router.put("/vendors/:id/approve", approveVendor);
router.put("/services/:id/approve", approveService);
router.put("/users/:id/toggle", toggleUserStatus);

module.exports = router;
