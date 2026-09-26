import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Upload, Check, AlertCircle, Building, DollarSign, MapPin } from 'lucide-react';

const availableAmenities = [
  'Swimming Pool', 'Gym', 'Garden', 'Balcony',
  'Parking', 'Air Conditioning', 'Security', 'WiFi', 'Fireplace'
];

export default function PostPropertyPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    listingType: 'sale', // 'sale', 'rent'
    rentPeriod: 'monthly',
    propertyType: 'apartment', // 'apartment', 'house', 'villa', 'commercial', 'land'
    bedrooms: '2',
    bathrooms: '2',
    area: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    amenities: [],
    imageUrlInput: ''
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop'
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-xl">
        <Building className="w-12 h-12 text-indigo-600 mx-auto" />
        <h2 className="text-2xl font-extrabold text-slate-900">Sign In Required</h2>
        <p className="text-slate-500 text-sm">You must be logged in to post property listings.</p>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-md"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleAddImageUrl = () => {
    if (formData.imageUrlInput && formData.imageUrlInput.trim() !== '') {
      setImageUrls(prev => [...prev, formData.imageUrlInput.trim()]);
      setFormData(prev => ({ ...prev, imageUrlInput: '' }));
    }
  };

  const handleRemoveImage = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('listingType', formData.listingType);
      data.append('rentPeriod', formData.rentPeriod);
      data.append('propertyType', formData.propertyType);
      data.append('bedrooms', formData.bedrooms);
      data.append('bathrooms', formData.bathrooms);
      data.append('area', formData.area);
      data.append('address', formData.address);
      data.append('city', formData.city);
      data.append('state', formData.state);
      data.append('zipCode', formData.zipCode);
      data.append('amenities', JSON.stringify(formData.amenities));
      data.append('imageUrls', JSON.stringify(imageUrls));

      if (selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          data.append('images', selectedFiles[i]);
        }
      }

      const res = await axios.post('/api/properties', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate(`/properties/${res.data.property._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post property listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10 space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Property Listing</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Post Your Property</h1>
          <p className="text-slate-500 text-sm mt-1">Fill out property details, location, and photos to reach buyers and tenants</p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: BASIC INFORMATION */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">1. Basic Information</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Listing Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Modern Sunset Heights Villa with Infinity Pool"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Listing Purpose *</label>
                <select
                  value={formData.listingType}
                  onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Property Type *</label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
                >
                  <option value="apartment">Apartment / Condo</option>
                  <option value="house">Single Family House</option>
                  <option value="villa">Luxury Villa</option>
                  <option value="commercial">Commercial Space</option>
                  <option value="land">Plot / Land</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Price ($) * {formData.listingType === 'rent' ? '/ Month' : ''}
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 450000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Bedrooms</label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Bathrooms</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Area (sqft) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 2200"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Description *</label>
              <textarea
                rows={4}
                required
                placeholder="Provide a comprehensive description of the property, highlights, neighbourhood, and specs..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

          </div>

          {/* SECTION 2: LOCATION */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">2. Property Location</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Street Address *</label>
              <input
                type="text"
                required
                placeholder="e.g. 742 Sunset Boulevard, Suite 400"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Los Angeles"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">State</label>
                <input
                  type="text"
                  placeholder="e.g. CA"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Zip Code</label>
                <input
                  type="text"
                  placeholder="e.g. 90069"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: AMENITIES */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">3. Features & Amenities</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableAmenities.map(amenity => {
                const checked = formData.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      checked
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{amenity}</span>
                    {checked && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: PHOTOS */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">4. Property Photos</h3>
            
            {/* File Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Upload Local Image Files</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            {/* URL Image Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Or Add Image URLs</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrlInput}
                  onChange={(e) => setFormData({ ...formData, imageUrlInput: e.target.value })}
                  className="flex-grow px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Add URL
                </button>
              </div>
            </div>

            {/* Image Previews */}
            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {imageUrls.map((url, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Publishing Listing...' : 'Publish Property Listing'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
