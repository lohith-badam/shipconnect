const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  status: { type: String, enum: ['pending', 'confirmed', 'ready_to_ship', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
