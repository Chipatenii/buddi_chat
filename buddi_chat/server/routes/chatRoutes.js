import express from 'express';
import Joi from 'joi';
import { logger } from '../utils/logger.js';
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
router.get('/', authenticate, validateQuery(Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(20)
  })), async (req, res) => {
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
      logger.error(`Chat room fetch error: ${error.stack}`);
      res.status(500).json({ code: 'SERVER_ERROR', message: 'Failed to fetch chat rooms' });
    }
  }
);

// Create new chat room
router.post('/', authenticate, validateRequest(chatRoomSchema), async (req, res) => {
    try {
      const { id: userId } = req.user;
      const { name, type, users, privacy } = req.body;

      if (type === 'direct' && users.length !== 1) {
        logger.warn(`Invalid direct chat attempt by user ${userId}`);
        return res.status(400).json({ code: 'INVALID_DIRECT_CHAT', message: 'Direct chat requires exactly one other user' });
      }

      const existingUsers = await User.find({ _id: { $in: users } });
      if (existingUsers.length !== users.length) {
        logger.warn(`User ${userId} attempted to create chat with non-existent users`);
        return res.status(404).json({ code: 'USER_NOT_FOUND', message: 'One or more users do not exist' });
      }

      const newChatRoom = await ChatRoom.create({
        name,
        type,
        users: [...users, userId],
        privacy: privacy || 'private',
        createdBy: userId
      });

      logger.info(`Created new ${type} chat room: ${newChatRoom.id} by user ${userId}`);
      res.status(201).json(newChatRoom);
    } catch (error) {
      logger.error(`Chat room creation error: ${error.stack}`);
      res.status(500).json({ code: 'SERVER_ERROR', message: 'Failed to create chat room' });
    }
  }
);

// Get chat room messages
router.get('/:id/messages', authenticate, validateParams(Joi.object({ id: Joi.string().hex().length(24).required() })), validateQuery(Joi.object({
    before: Joi.date().iso(),
    limit: Joi.number().min(1).max(100).default(50)
  })), async (req, res) => {
    try {
      const { id: chatRoomId } = req.params;
      const chatRoom = await ChatRoom.findById(chatRoomId).populate('messages.sender', 'username profilePicture').select('messages');

      if (!chatRoom) {
        logger.warn(`Chat room ${chatRoomId} not found`);
        return res.status(404).json({ code: 'CHAT_ROOM_NOT_FOUND', message: 'Chat room does not exist' });
      }

      logger.info(`Fetched messages for chat room ${chatRoomId}`);
      res.json(chatRoom.messages);
    } catch (error) {
      logger.error(`Message fetch error: ${error.stack}`);
      res.status(500).json({ code: 'SERVER_ERROR', message: 'Failed to fetch messages' });
    }
  }
);

export default router;