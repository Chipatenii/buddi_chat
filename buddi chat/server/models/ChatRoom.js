const mongoose = require("mongoose");
const validator = require("validator");

const chatRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Chat room name is required"],
      trim: true,
      minlength: [3, "Chat room name must be at least 3 characters"],
      maxlength: [50, "Chat room name cannot exceed 50 characters"],
      match: [/^[a-zA-Z0-9\s\-_']+$/, "Invalid characters in chat room name"],
      index: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["direct", "group", "channel"],
      default: "direct"
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: function(v) {
          return v.length >= 2 || this.type !== "direct";
        },
        message: "Direct chat must have exactly 2 users"
      },
      index: true
    }],
    messages: [{
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Message sender is required"]
      },
      content: {
        type: String,
        required: function() {
          return !this.attachment;
        },
        trim: true,
        minlength: [1, "Message cannot be empty"],
        maxlength: [2000, "Message cannot exceed 2000 characters"]
      },
      attachment: {
        url: {
          type: String,
          validate: {
            validator: v => validator.isURL(v, { protocols: ['http', 'https'] }),
            message: "Invalid attachment URL"
          }
        },
        type: {
          type: String,
          enum: ["image", "video", "file", "audio"]
        }
      },
      readBy: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }],
      deleted: {
        type: Boolean,
        default: false
      },
      timestamp: {
        type: Date,
        default: Date.now,
        index: true
      }
    }],
    lastMessage: {
      type: Date,
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    admins: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    isArchived: {
      type: Boolean,
      default: false
    },
    privacy: {
      type: String,
      enum: ["public", "private", "secret"],
      default: "private"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
chatRoomSchema.index({ users: 1, lastMessage: -1 });
chatRoomSchema.index({ privacy: 1, type: 1 });

// Virtuals
chatRoomSchema.virtual('unreadCount', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'room',
  count: true
});

// Pre-save hooks
chatRoomSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

chatRoomSchema.pre('save', function(next) {
  if (this.messages.length > 0) {
    this.lastMessage = this.messages[this.messages.length - 1].timestamp;
  }
  next();
});

// Static methods
chatRoomSchema.statics.findByUser = function(userId) {
  return this.find({ users: userId })
    .populate('users', 'username profilePicture')
    .sort('-lastMessage');
};

// Instance methods
chatRoomSchema.methods.addMessage = function(message) {
  this.messages.push(message);
  return this.save();
};

chatRoomSchema.methods.markAsRead = function(userId) {
  const lastMessage = this.messages[this.messages.length - 1];
  if (lastMessage) {
    lastMessage.readBy.push({ user: userId });
  }
  return this.save();
};

export default mongoose.model("ChatRoom", chatRoomSchema);