import { Server } from 'socket.io';
import logger from './logger.js';

let io = null;

/**
 * Initialize Socket.io server on top of HTTP server
 * @param {import('http').Server} server - Native Node HTTP server
 * @returns {Server} Socket.io Server instance
 */
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    },
  });

  io.on('connection', (socket) => {
    logger.info(`🔌 Real-time client connected: ${socket.id}`);

    // Join a class room
    socket.on('joinClass', (classId) => {
      socket.join(`class_${classId}`);
      logger.info(`🔌 Socket ${socket.id} joined class_${classId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`🔌 Real-time client disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Get Socket.io Server instance
 * @returns {Server} Socket.io Server instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized yet!');
  }
  return io;
};
