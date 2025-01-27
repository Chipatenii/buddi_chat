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
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS || "*", // Specify allowed origins for CORS
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Rate limiter to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// ========================== File Upload Handling ==========================
app.use("/uploads", express.static("uploads")); // Serve static files from the uploads directory

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
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/buddi_chat", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("DB Connection Error:", err);
    process.exit(1);
  });

// ========================== API Routes ==========================
/**
 * Authentication Routes
 * - Handles login, registration, and token generation
 */
app.use("/api/auth", authRoutes);

/**
 * Protected Routes
 * - Accessible only to authenticated users
 */
app.use("/api/protected", authenticate, protectedRoutes);

/**
 * User Management Routes
 * - Handles user-related operations (e.g., profile updates)
 */
app.use("/api/user", authenticate, userRoutes);

/**
 * Get Logged-in User Information
 * - Requires authentication
 * - Returns details of the currently logged-in user
 */
app.get("/api/loggedInUser", authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from authenticate middleware
    const user = await User.findById(userId).select("-password"); // Exclude the password field
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching logged-in user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ========================== Error Handling Middleware ==========================
/**
 * Global Error Handler
 * - Catches errors thrown in routes or middleware
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/**
 * 404 Middleware
 * - Catches undefined routes
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
});

// ========================== Start Server ==========================
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
