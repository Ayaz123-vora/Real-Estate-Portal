const express = require('express');
const Property = require('../models/property');
const User = require('../models/user');
const Inquiry = require('../models/inquiry');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/pending - Get pending property approvals
router.get('/pending', auth, adminOnly, async (req, res) => {
  try {
    const properties = await Property.find({ status: 'pending' })
      .populate('postedBy', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/properties - Get all properties
router.get('/properties', auth, adminOnly, async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('postedBy', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/admin/properties/:id/status - Approve or reject property
router.put('/properties/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('postedBy', 'name email');

    if (!property) return res.status(404).json({ message: 'Property not found' });

    res.json({ message: `Property status updated to ${status}`, property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/stats - Platform Statistics Overview
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const approvedProperties = await Property.countDocuments({ status: 'approved' });
    const pendingProperties = await Property.countDocuments({ status: 'pending' });
    const totalUsers = await User.countDocuments();
    const totalInquiries = await Inquiry.countDocuments();
    const forSaleCount = await Property.countDocuments({ listingType: 'sale' });
    const forRentCount = await Property.countDocuments({ listingType: 'rent' });

    res.json({
      totalProperties,
      approvedProperties,
      pendingProperties,
      totalUsers,
      totalInquiries,
      forSaleCount,
      forRentCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;