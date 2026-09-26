const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  senderPhone: { type: String, default: '' },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
