const express = require('express');
const Message = require('../models/Message');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { receiver, shipmentRequest, content } = req.body;
    const message = new Message({ sender: req.user._id, receiver, shipmentRequest, content });
    await message.save();
    await message.populate('sender', 'name role');

    // Emit via socket
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${receiver}`).emit('newMessage', message);
      io.to(`shipment_${shipmentRequest}`).emit('newMessage', message);
    }

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get messages for a shipment
router.get('/:shipmentId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ shipmentRequest: req.params.shipmentId })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
