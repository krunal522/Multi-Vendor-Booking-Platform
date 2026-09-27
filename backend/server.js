const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
require("dotenv").config();

const app = express();
const httpServer = createServer(app);

// CORS Configuration for local & production deployments
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const clientUrl = process.env.CLIENT_URL;
    if (
      !clientUrl ||
      origin === clientUrl ||
      origin.endsWith(".vercel.app") ||
      origin.endsWith(".onrender.com") ||
      origin.includes("localhost") ||
      process.env.NODE_ENV !== "production"
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};

// Socket.io setup
const io = new Server(httpServer, {
  cors: corsOptions,
  transports: ["websocket", "polling"]
});

// Make io available to routes
app.set("io", io);

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth",          require("./src/routes/auth.routes"));
app.use("/api/services",      require("./src/routes/service.routes"));
app.use("/api/bookings",      require("./src/routes/booking.routes"));
app.use("/api/reviews",       require("./src/routes/review.routes"));
app.use("/api/vendor",        require("./src/routes/vendor.routes"));
app.use("/api/admin",         require("./src/routes/admin.routes"));
app.use("/api/notifications", require("./src/routes/notification.routes"));
app.use("/api/upload",        require("./src/routes/upload.routes"));

// Root endpoint
app.get("/", (req, res) => res.json({
  name: "ServeBook Multi-Vendor Booking Platform API",
  status: "online",
  version: "1.0.0",
  docs: "API is live and accepting requests"
}));

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date() }));

// Global Error Handler Middleware
app.use(require("./src/middleware/error.middleware"));

// Socket.io Events
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join_room", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/booking-platform")
  .then(async () => {
    console.log("? MongoDB connected");
    // Auto-seed demo data
    const User = require("./src/models/User");
    const count = await User.countDocuments();
    if (count === 0) {
      console.log("?? Seeding demo data...");
      require("./src/config/seed")();
    }
  })
  .catch(err => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`⚡ Socket.io ready`);
});
