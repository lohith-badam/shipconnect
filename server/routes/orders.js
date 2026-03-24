const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Place order
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product ${item.product} not found` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        seller: product.seller
      });
      totalAmount += product.price * item.quantity;

      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({ buyer: req.user._id, items: orderItems, totalAmount, shippingAddress });
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get orders for seller
router.get('/seller', auth, async (req, res) => {
  try {
    const orders = await Order.find({ 'items.seller': req.user._id }).sort({ createdAt: -1 }).populate('buyer', 'name email city');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update order status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
