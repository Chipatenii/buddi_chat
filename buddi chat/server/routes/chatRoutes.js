import express from 'express';
import Joi from 'joi';
import logger from '../utils/logger.js';
import ChatRoom from '../models/ChatRoom.js';
import User from '../models/User.js';
import authenticate from '../middleware/authMiddleware.js';
import { validateRequest, validateParams, validateQuery } from '../middleware/validation.js';

const router = express.Router();

// Joi Schemas
const chatRoomSchema = Joi.object({
  name: Joi.string().min(3).max(50).pattern(/^[a-zA-Z0-9\s\-_']+$/).required(),
  type: Joi.string().valid('direct', 'group', 'channel').required(),
  users: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
  privacy: Joi.string().valid('public', 'private', 'secret')
});

const messageSchema = Joi.object({
  content: Joi.string().max(2000).when('attachment', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required()
  }),
  attachment: Joi.object({
    url: Joi.string().uri(),
    type: Joi.string().valid('image', 'video', 'file', 'audio')
  })
});

// Get user's chat rooms with pagination
router.get('/', 
  authenticate,
  validateQuery(Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(20)
  })),
  async (req, res) => {
    try {
      const { id: userId } = req.user;
      const { page, limit } = req.query;

      const chatRooms = await ChatRoom.find({ users: userId })
        .populate('users', 'username profilePicture')
        .populate('lastMessage')
        .sort('-lastMessage')
        .skip((page - 1) * limit)
        .limit(limit);

      logger.info(`Fetched ${chatRooms.length} chat rooms for user ${userId}`);
      res.json(chatRooms);
    } catch (error) {
      logger.error(`Chat room fetch error: ${error.message}`);
      res.status(500).json({ 
        code: 'SERVER_ERROR',
        message: 'Failed to fetch chat rooms' 
      });
    }
  }
);

// Create new chat room
router.post('/',
  authenticate,
  validateRequest(chatRoomSchema),
  async (req, res) => {
    try {
      const { id: userId } = req.user;
      const { name, type, users, privacy } = req.body;

      // Validate direct chat
      if (type === 'direct' && users.length !== 1) {
        return res.status(400).json({
          code: 'INVALID_DIRECT_CHAT',
          message: 'Direct chat requires exactly one other user'
        });
      }

      // Check if users exist
      const existingUsers = await User.find({ _id: { $in: users } });
      if (existingUsers.length !== users.length) {
        return res.status(404).json({
          code: 'USER_NOT_FOUND',
          message: 'One or more users do not exist'
        });
      }

      const newChatRoom = await ChatRoom.create({
        name,
        type,
        users: [...users, userId], // Include current user
        privacy: privacy || 'private',
        createdBy: userId
      });

      logger.info(`Created new ${type} chat room: ${newChatRoom.id}`);
      res.status(201).json(newChatRoom);
    } catch (error) {
      logger.error(`Chat room creation error: ${error.message}`);
      res.status(500).json({
        code: 'SERVER_ERROR',
        message: 'Failed to create chat room'
      });
    }
  }
);

// Get chat room messages
router.get('/:id/messages',
  authenticate,
  validateParams(Joi.object({ id: Joi.string().hex().length(24).required() })),
  validateQuery(Joi.object({
    before: Joi.date().iso(),
    limit: Joi.number().min(1).max(100).default(50)
  })),
  async (req, res) => {
    try {
      const { id: chatRoomId } = req.params;
      const { before, limit } = req.query;

      const chatRoom = await ChatRoom.findById(chatRoomId)
        .populate('messages.sender', 'username profilePicture')
        .select('messages');

      if (!chatRoom) {
        return res.status(404).json({
          code: 'CHAT_ROOM_NOT_FOUND',
          message: 'Chat room does not exist'
        });
      }

      let messages = chatRoom.messages;
      if (before) {
        messages = messages.filter(m => m.timestamp < new Date(before));
      }

      messages = messages.slice(-limit).reverse();

      logger.info(`Fetched ${messages.length} messages for chat ${chatRoomId}`);
      res.json(messages);
    } catch (error) {
      logger.error(`Message fetch error: ${error.message}`);
      res.status(500).json({
        code: 'SERVER_ERROR',
        message: 'Failed to fetch messages'
      });
    }
  }
);

// Send message to chat room
router.post('/:id/messages',
  authenticate,
  validateParams(Joi.object({ id: Joi.string().hex().length(24).required() })),
  validateRequest(messageSchema),
  async (req, res) => {
    try {
      const { id: chatRoomId } = req.params;
      const { id: userId } = req.user;
      const { content, attachment } = req.body;

      const chatRoom = await ChatRoom.findById(chatRoomId);
      if (!chatRoom) {
        return res.status(404).json({
          code: 'CHAT_ROOM_NOT_FOUND',
          message: 'Chat room does not exist'
        });
      }

      if (!chatRoom.users.includes(userId)) {
        return res.status(403).json({
          code: 'FORBIDDEN',
          message: 'You are not a member of this chat'
        });
      }

      const newMessage = {
        sender: userId,
        content,
        attachment,
        timestamp: new Date()
      };

      await chatRoom.addMessage(newMessage);
      
      logger.info(`New message in chat ${chatRoomId} from user ${userId}`);
      res.status(201).json(newMessage);
    } catch (error) {
      logger.error(`Message send error: ${error.message}`);
      res.status(500).json({
        code: 'SERVER_ERROR',
        message: 'Failed to send message'
      });
    }
  }
);

// Mark messages as read
router.patch('/:id/read',
  authenticate,
  validateParams(Joi.object({ id: Joi.string().hex().length(24).required() })),
  async (req, res) => {
    try {
      const { id: chatRoomId } = req.params;
      const { id: userId } = req.user;

      const chatRoom = await ChatRoom.findById(chatRoomId);
      if (!chatRoom) {
        return res.status(404).json({
          code: 'CHAT_ROOM_NOT_FOUND',
          message: 'Chat room does not exist'
        });
      }

      await chatRoom.markAsRead(userId);
      
      logger.info(`User ${userId} marked chat ${chatRoomId} as read`);
      res.status(204).end();
    } catch (error) {
      logger.error(`Mark read error: ${error.message}`);
      res.status(500).json({
        code: 'SERVER_ERROR',
        message: 'Failed to mark messages as read'
      });
    }
  }
);

export default router;