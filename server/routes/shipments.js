const express = require('express');
const ShipmentRequest = require('../models/ShipmentRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { auth, roleAuth } = require('../middleware/auth');
const router = express.Router();

// Create shipment request (seller)
router.post('/', auth, roleAuth('seller'), async (req, res) => {
  try {
    const { order, destinationCity, weight, productDescription } = req.body;
    const shipment = new ShipmentRequest({
      order,
      seller: req.user._id,
      sourceCity: req.user.city,
      destinationCity,
      weight,
      productDescription,
    });
    await shipment.save();
    await shipment.populate('seller', 'name shopName city');

    // Notify all transporters in the source city
    const transporters = await User.find({ role: 'transporter', city: new RegExp(`^${req.user.city}$`, 'i') });
    const notifications = transporters.map(t => ({
      user: t._id,
      type: 'new_shipment',
      message: `New shipment available: ${req.user.city} → ${destinationCity} by ${req.user.shopName || req.user.name}`,
      relatedShipment: shipment._id,
    }));
    await Notification.insertMany(notifications);

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      transporters.forEach(t => {
        io.to(`user_${t._id}`).emit('notification', {
          type: 'new_shipment',
          message: `New shipment: ${req.user.city} → ${destinationCity}`,
          shipmentId: shipment._id,
        });
        io.to(`user_${t._id}`).emit('newShipment', shipment);
      });
    }

    res.status(201).json(shipment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get shipments by city (for transporters)
router.get('/city/:city', auth, async (req, res) => {
  try {
    const shipments = await ShipmentRequest.find({
      sourceCity: new RegExp(`^${req.params.city}$`, 'i'),
      status: 'pending'
    }).populate('seller', 'name shopName city phone').sort({ createdAt: -1 });
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all pending shipments
router.get('/pending', auth, async (req, res) => {
  try {
    const shipments = await ShipmentRequest.find({ status: 'pending' })
      .populate('seller', 'name shopName city phone')
      .sort({ createdAt: -1 });
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Transporter accepts a shipment
router.put('/:id/match', auth, roleAuth('transporter'), async (req, res) => {
  try {
    const shipment = await ShipmentRequest.findById(req.params.id);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    if (shipment.status !== 'pending') return res.status(400).json({ message: 'Shipment already matched' });

    shipment.matchedTransporter = req.user._id;
    shipment.status = 'matched';
    await shipment.save();
    await shipment.populate('seller', 'name shopName city phone');
    await shipment.populate('matchedTransporter', 'name city phone vehicleType');

    // Notify seller
    const notification = new Notification({
      user: shipment.seller._id,
      type: 'shipment_match',
      message: `Your shipment to ${shipment.destinationCity} has been accepted by ${req.user.name}!`,
      relatedShipment: shipment._id,
    });
    await notification.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${shipment.seller._id}`).emit('notification', {
        type: 'shipment_match',
        message: `Shipment matched! ${req.user.name} will transport to ${shipment.destinationCity}`,
        shipmentId: shipment._id,
      });
      io.to(`user_${shipment.seller._id}`).emit('shipmentMatch', shipment);
    }

    res.json(shipment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get my shipments (seller or transporter)
router.get('/my', auth, async (req, res) => {
  try {
    let shipments;
    if (req.user.role === 'seller') {
      shipments = await ShipmentRequest.find({ seller: req.user._id })
        .populate('matchedTransporter', 'name city phone vehicleType')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'transporter') {
      shipments = await ShipmentRequest.find({ matchedTransporter: req.user._id })
        .populate('seller', 'name shopName city phone')
        .sort({ createdAt: -1 });
    }
    res.json(shipments || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update shipment status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const shipment = await ShipmentRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('seller', 'name shopName city').populate('matchedTransporter', 'name city phone');
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
