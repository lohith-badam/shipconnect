const express = require('express');
const Product = require('../models/Product');
const { auth, roleAuth } = require('../middleware/auth');
const router = express.Router();

// Get all products (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, city, search, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (city) query.city = new RegExp(city, 'i');
    if (search) query.name = new RegExp(search, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('seller', 'name shopName city')
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ products, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name shopName city phone');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create product (seller only)
router.post('/', auth, roleAuth('seller'), async (req, res) => {
  try {
    const product = new Product({ ...req.body, seller: req.user._id, city: req.user.city });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update product (seller only)
router.put('/:id', auth, roleAuth('seller'), async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user._id },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete product (seller only)
router.delete('/:id', auth, roleAuth('seller'), async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get seller's products
router.get('/seller/my', auth, roleAuth('seller'), async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
