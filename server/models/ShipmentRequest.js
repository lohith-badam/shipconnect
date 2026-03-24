const mongoose = require('mongoose');

const shipmentRequestSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sourceCity: { type: String, required: true, trim: true },
  destinationCity: { type: String, required: true, trim: true },
  weight: { type: String, trim: true },
  productDescription: { type: String, required: true },
  status: { type: String, enum: ['pending', 'matched', 'in_transit', 'delivered'], default: 'pending' },
  matchedTransporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now }
});

shipmentRequestSchema.index({ sourceCity: 1, status: 1 });

module.exports = mongoose.model('ShipmentRequest', shipmentRequestSchema);
