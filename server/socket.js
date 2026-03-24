const socketIO = require('socket.io');

function initSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // Join user-specific room
    socket.on('joinRoom', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room user_${userId}`);
    });

    // Join shipment chat room
    socket.on('joinShipmentChat', (shipmentId) => {
      socket.join(`shipment_${shipmentId}`);
      console.log(`Joined shipment chat: ${shipmentId}`);
    });

    // Leave shipment chat room
    socket.on('leaveShipmentChat', (shipmentId) => {
      socket.leave(`shipment_${shipmentId}`);
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });

  return io;
}

module.exports = initSocket;
