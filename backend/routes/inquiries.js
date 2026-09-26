const express = require('express');
const Inquiry = require('../models/inquiry');
const Property = require('../models/property');
const { auth } = require('../middleware/auth');

const router = express.Router();

// POST /api/inquiries - Submit an Inquiry
router.post('/', async (req, res) => {
  try {
    const { propertyId, senderName, senderEmail, senderPhone, message, senderId } = req.body;

    if (!propertyId || !senderName || !senderEmail || !message) {
      return res.status(400).json({ message: 'Property, name, email, and message are required.' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    const inquiry = new Inquiry({
      property: propertyId,
      sender: senderId || req.userId || null,
      recipient: property.postedBy,
      senderName,
      senderEmail,
      senderPhone: senderPhone || '',
      message,
      status: 'unread'
    });

    await inquiry.save();
    res.status(201).json({ message: 'Inquiry submitted successfully! The property agent will contact you soon.', inquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/inquiries/received - Get inquiries received for my properties
router.get('/received', auth, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ recipient: req.userId })
      .populate('property', 'title price location images')
      .populate('sender', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/inquiries/sent - Get inquiries sent by current user
router.get('/sent', auth, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ sender: req.userId })
      .populate('property', 'title price location images')
      .populate('recipient', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/inquiries/:id/status - Update Inquiry Status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    if (inquiry.recipient.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this inquiry' });
    }

    inquiry.status = status;
    await inquiry.save();
    res.json({ message: 'Inquiry status updated', inquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/inquiries/:id - Delete Inquiry
router.delete('/:id', auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

    if (inquiry.recipient.toString() !== req.userId.toString() && inquiry.sender?.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this inquiry' });
    }

    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
