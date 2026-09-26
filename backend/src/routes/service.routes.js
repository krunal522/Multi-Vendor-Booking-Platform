const express = require("express");
const router = express.Router();
const { getServices, getServiceById, createService, updateService, deleteService, addSlots, getCategories, getFeatured } = require("../controllers/service.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const { serviceValidation, validate } = require("../middleware/validator.middleware");

router.get("/", getServices);
router.get("/categories", getCategories);
router.get("/featured", getFeatured);
router.get("/:id", getServiceById);
router.post("/", protect, authorize("vendor", "admin"), serviceValidation, validate, createService);
router.put("/:id", protect, authorize("vendor", "admin"), updateService);
router.delete("/:id", protect, authorize("vendor", "admin"), deleteService);
router.post("/:id/slots", protect, authorize("vendor", "admin"), addSlots);

module.exports = router;
