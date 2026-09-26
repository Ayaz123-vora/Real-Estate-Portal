const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  listingType: { type: String, enum: ['sale', 'rent'], default: 'sale' },
  rentPeriod: { type: String, enum: ['monthly', 'yearly', 'n/a'], default: 'n/a' },
  propertyType: { type: String, enum: ['apartment', 'house', 'villa', 'commercial', 'land'], required: true },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  area: { type: Number, required: true }, // in sq ft
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' }
  },
  amenities: [{ type: String }],
  images: [{ type: String }],
  featured: { type: Boolean, default: false },
  viewsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

propertySchema.index({ 'location.city': 1, propertyType: 1, listingType: 1, price: 1 });

module.exports = mongoose.model('Property', propertySchema);