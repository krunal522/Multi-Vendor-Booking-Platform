const { body, validationResult } = require("express-validator");

// Helper to handle validation results
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().forEach(err => {
      if (!extractedErrors[err.path]) {
        extractedErrors[err.path] = err.msg;
      }
    });
    return res.status(400).json({ 
      message: errors.array()[0].msg, 
      errors: extractedErrors 
    });
  }
  next();
};

// Register Validation Rules
exports.registerValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["customer", "vendor"]).withMessage("Invalid role selected"),
  body("businessName")
    .if(body("role").equals("vendor"))
    .trim()
    .notEmpty().withMessage("Business name is required for vendor registration")
    .isLength({ min: 2 }).withMessage("Business name must be at least 2 characters"),
  body("businessCategory")
    .if(body("role").equals("vendor"))
    .trim()
    .notEmpty().withMessage("Business category is required for vendor registration"),
];

// Login Validation Rules
exports.loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address"),
  body("password")
    .notEmpty().withMessage("Password is required"),
];

// Service Creation Validation Rules
exports.serviceValidation = [
  body("title")
    .trim()
    .notEmpty().withMessage("Service title is required")
    .isLength({ min: 5, max: 120 }).withMessage("Title must be between 5 and 120 characters"),
  body("category")
    .trim()
    .notEmpty().withMessage("Category is required"),
  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 1 }).withMessage("Price must be a positive number greater than 0"),
  body("duration")
    .optional()
    .isInt({ min: 15, max: 600 }).withMessage("Duration must be between 15 and 600 minutes"),
  body("location.city")
    .trim()
    .notEmpty().withMessage("City is required"),
  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 15 }).withMessage("Description must be at least 15 characters long"),
];

// Booking Validation Rules
exports.bookingValidation = [
  body("service")
    .custom((val, { req }) => {
      const id = req.body.serviceId || req.body.service;
      if (!id) throw new Error("Service ID is required");
      if (!/^[0-9a-fA-F]{24}$/.test(id)) throw new Error("Invalid service identifier");
      return true;
    }),
  body("slotDate")
    .custom((val, { req }) => {
      const date = req.body.slotDate || req.body.slot?.date;
      if (!date) throw new Error("Booking date is required");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Date must be in YYYY-MM-DD format");
      return true;
    }),
  body("slotStartTime")
    .custom((val, { req }) => {
      const time = req.body.slotStartTime || req.body.slot?.startTime;
      if (!time) throw new Error("Slot time is required");
      return true;
    }),
  body("address.street")
    .trim()
    .notEmpty().withMessage("Street address is required"),
  body("address.city")
    .trim()
    .notEmpty().withMessage("City is required"),
  body("address.pincode")
    .trim()
    .notEmpty().withMessage("Pincode is required")
    .matches(/^[1-9][0-9]{5}$/).withMessage("Please enter a valid 6-digit Indian PIN code"),
];
