const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shipmentRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'ShipmentRequest', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

messageSchema.index({ shipmentRequest: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
