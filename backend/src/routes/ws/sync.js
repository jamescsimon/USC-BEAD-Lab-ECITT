const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;
const activeSessions = {};

function initializeWebSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Middleware to verify token
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.username} connected: ${socket.id}`);

    // Join session room
    socket.on('join_session', (sessionId) => {
      socket.join(`session_${sessionId}`);
      activeSessions[sessionId] = (activeSessions[sessionId] || 0) + 1;
      console.log(`User joined session ${sessionId}`);
      io.to(`session_${sessionId}`).emit('user_joined', {
        sessionId,
        timestamp: Date.now(),
      });
    });

    // Broadcast event
    socket.on('event_logged', (data) => {
      const { sessionId, event } = data;
      io.to(`session_${sessionId}`).emit('event_received', {
        event,
        timestamp: Date.now(),
      });
      console.log(`Event logged in session ${sessionId}:`, event);
    });

    // Sync marker
    socket.on('sync_marker', (data) => {
      const { sessionId, marker } = data;
      io.to(`session_${sessionId}`).emit('sync_received', {
        marker,
        timestamp: Date.now(),
      });
      console.log(`Sync marker received in session ${sessionId}:`, marker);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.username} disconnected: ${socket.id}`);
    });

    // Leave session
    socket.on('leave_session', (sessionId) => {
      socket.leave(`session_${sessionId}`);
      activeSessions[sessionId] = Math.max(0, (activeSessions[sessionId] || 1) - 1);
      io.to(`session_${sessionId}`).emit('user_left', {
        sessionId,
        timestamp: Date.now(),
      });
    });
  });

  return io;
}

function getActiveSessions() {
  return activeSessions;
}

module.exports = { initializeWebSocket, getActiveSessions };
