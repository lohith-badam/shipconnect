const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  image: { type: String, default: '' },
  stock: { type: Number, default: 0, min: 0 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  city: { type: String, required: true, trim: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

productSchema.index({ category: 1, city: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
