const mongoose = require('mongoose');

const transportOfferSchema = new mongoose.Schema({
  transporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sourceCity: { type: String, required: true, trim: true },
  destinationCity: { type: String, required: true, trim: true },
  vehicleType: { type: String, required: true },
  availableDate: { type: Date, required: true },
  capacity: { type: String },
  pricePerKg: { type: Number },
  status: { type: String, enum: ['available', 'booked', 'completed'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});

transportOfferSchema.index({ sourceCity: 1, destinationCity: 1, status: 1 });

module.exports = mongoose.model('TransportOffer', transportOfferSchema);
