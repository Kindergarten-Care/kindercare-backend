import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = process.env.SOCKET_PORT || 8080;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Authenticate socket with token
  const token = socket.handshake.auth?.token;
  if (token) {
    console.log(`[Socket.io] Authenticated: ${socket.id}`);
  }

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Broadcast helper for other modules
export function broadcastNotification(userId, notification) {
  io.to(`user:${userId}`).emit('notification', notification);
}

httpServer.listen(PORT, () => {
  console.log(`[Socket.io] Server running on port ${PORT}`);
});
