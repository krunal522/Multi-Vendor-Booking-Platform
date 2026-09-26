// Global Error Handler Middleware
module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log for development
  if (process.env.NODE_ENV !== "production") {
    console.error("Backend Error:", err);
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with id: ${err.value}`;
    return res.status(404).json({ message });
  }

  // Mongoose duplicate key (e.g. unique email or slug)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const message = `An account or record with this ${field} already exists. Please use a different ${field}.`;
    return res.status(400).json({ message, field });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(val => val.message).join(", ");
    return res.status(400).json({ message });
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid authentication token. Please log in again." });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }

  res.status(error.statusCode || 500).json({
    message: error.message || "Server Error. Please try again later."
  });
};
