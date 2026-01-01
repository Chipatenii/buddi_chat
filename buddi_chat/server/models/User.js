import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      match: [/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"]
    },
    username: {
      type: String,
      required: [true, "Please choose a username"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
      collation: { locale: 'en', strength: 2 } // Case-insensitive index
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address"
      }
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false
    },
    passwordUpdatedAt: Date,
    profilePicture: {
      type: String,
      default: "default-avatar.jpg",
      validate: {
        validator: function (v) {
          // Allow internal paths, buffers (as strings), or valid URLs
          return typeof v === 'string' && (v.length > 0);
        },
        message: "Invalid profile picture format"
      }
    },
    altText: {
      type: String,
      maxlength: [100, "Alt text cannot exceed 100 characters"]
    },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user"
    },
    chatRooms: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom"
    }],
    loginAttempts: {
      type: Number,
      default: 0,
      select: false
    },
    lockedUntil: {
      type: Date,
      select: false
    },
    lastLogin: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    createdBy: {
      type: String,
      enum: ["web", "mobile", "admin"],
      default: "web"
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add compound indexes for common queries
userSchema.index({ email: 1, active: 1 });
userSchema.index({ username: 1, active: 1 });
userSchema.index({ role: 1, active: 1 });
userSchema.index({ lastLogin: -1 });

// Virtuals
userSchema.virtual("avatarURL").get(function () {
  return this.profilePicture
    ? `/uploads/users/${this.profilePicture}`
    : '/images/default-avatar.jpg';
});

// Password encryption middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordUpdatedAt = Date.now() - 1000; // Ensure timestamp before save
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordUpdatedAt) {
    const changedTimestamp = parseInt(this.passwordUpdatedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Query middleware to filter out inactive users
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
