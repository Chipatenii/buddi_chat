const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protectedRoutes");
const userRoutes = require("./routes/userRoutes");
const authenticate = require("./middleware/authMiddleware"); // Middleware for authentication
const User = require("./models/User"); // User model for database operations

dotenv.config();
const app = express();

// ========================== Middleware ==========================
app.use(helmet()); // Enhances security by setting various HTTP headers
app.use(express.json()); // Parses incoming JSON requests

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",") 
  : ["http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allows cookies (important for authentication)
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Backup: Manually Set CORS Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Rate Limiting to prevent API abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per IP
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// ========================== File Upload Handling ==========================
app.use("/uploads", express.static("uploads")); // Serve uploaded files

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname.replace(/\s+/g, "-").toLowerCase()}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/gif"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpeg, .png, and .gif formats are allowed!"), false);
    }
  },
});

// ========================== MongoDB Connection ==========================
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/buddi_chat";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  });

// ========================== API Routes ==========================
app.use("/api/auth", authRoutes);
app.use("/api/protected", authenticate, protectedRoutes);
app.use("/api/loggedInUser", authenticate, userRoutes);

/**
 * Get Logged-in User Information
 */
app.get("/api/loggedInUser", authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id; // Extracted from authenticate middleware
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

// ========================== Error Handling Middleware ==========================
/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error("⚠️ Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Resource not found" });
});

// ========================== Start Server ==========================
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ========================== Graceful Shutdown ==========================
process.on("unhandledRejection", (err) => {
  console.error("🔥 Unhandled Promise Rejection:", err);
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("👋 Shutting down server gracefully...");
  server.close(() => {
    console.log("🛑 Server closed.");
    process.exit(0);
  });
});