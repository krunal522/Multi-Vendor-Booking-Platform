const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "15m" });
const signRefreshToken = (id) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d" });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, businessName, businessCategory, businessDescription } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });
    const user = await User.create({ name, email, password, role: role || "customer", businessName, businessCategory, businessDescription });
    const token = signToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    res.status(201).json({ token, refreshToken, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, isApproved: user.isApproved } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password +refreshToken");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });
    if (!user.isActive) return res.status(401).json({ message: "Account has been deactivated" });
    const token = signToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    res.json({ token, refreshToken, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, isApproved: user.isApproved, businessName: user.businessName } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token" });
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken) return res.status(401).json({ message: "Invalid refresh token" });
    const newToken = signToken(user._id);
    const newRefreshToken = signRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    res.json({ token: newToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(401).json({ message: "Refresh token expired, please login again" });
  }
};

exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};

exports.logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, businessName, businessDescription } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, address, businessName, businessDescription }, { new: true, runValidators: true });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
