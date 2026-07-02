import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import logger from './logger.js';

let io = null;

/**
 * Initialize Socket.IO on the given HTTP server.
 * @param {import('http').Server} httpServer
 */
export const initSocket = (httpServer) => {
  const allowedOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
      methods: ['GET', 'POST'],
      credentials: allowedOrigins.length > 0,
    },
    transports: ['websocket', 'polling'],
  });

  // ── Auth middleware ──────────────────────────────────────────────────────────
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new Error('Authentication error: token missing'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id || decoded.userId || decoded.sub;
      next();
    } catch {
      next(new Error('Authentication error: invalid token'));
    }
  });

  // ── Connection handler ───────────────────────────────────────────────────────
  io.on('connection', (socket) => {
    const userId = socket.userId;
    logger.info(`[Socket] User ${userId} connected — socketId: ${socket.id}`);

    // Each user joins their private room keyed by userId
    socket.join(`user:${userId}`);

    socket.on('disconnect', (reason) => {
      logger.info(`[Socket] User ${userId} disconnected — reason: ${reason}`);
    });
  });

  logger.info('[Socket] Socket.IO server initialized');
  return io;
};

/**
 * Emit a notification event to a specific user's room.
 * @param {number|string} userId
 * @param {object} notification  – the full notification object to push
 */
export const emitNotificationToUser = (userId, notification) => {
  if (!io) {
    logger.warn('[Socket] emitNotificationToUser called before init');
    return;
  }
  io.to(`user:${userId}`).emit('new_notification', notification);
  logger.info(`[Socket] Emitted new_notification to user:${userId}`);
};

export const getIO = () => io;
