const express = require("express");
const router = express.Router();
const { createReview, getServiceReviews } = require("../controllers/review.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.post("/", protect, authorize("customer"), createReview);
router.get("/service/:serviceId", getServiceReviews);

module.exports = router;
