const express = require("express");
const router = express.Router();
const { register, login, refreshToken, getMe, logout, updateProfile } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const { registerValidation, loginValidation, validate } = require("../middleware/validator.middleware");

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.post("/refresh", refreshToken);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.put("/profile", protect, updateProfile);

module.exports = router;
