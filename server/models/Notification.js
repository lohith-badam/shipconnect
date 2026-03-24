const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['shipment_match', 'new_shipment', 'new_message', 'order_update', 'transport_offer'], required: true },
  message: { type: String, required: true },
  relatedShipment: { type: mongoose.Schema.Types.ObjectId, ref: 'ShipmentRequest' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

notificationSchema.index({ user: 1, read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
