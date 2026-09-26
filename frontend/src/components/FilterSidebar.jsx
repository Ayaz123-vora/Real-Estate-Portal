import React from 'react';
import { useProperties } from '../context/PropertyContext';
import { Search, Filter, RotateCcw, DollarSign, Home, Bed, Bath, Check } from 'lucide-react';

const availableAmenities = [
  'Swimming Pool', 'Gym', 'Garden', 'Balcony',
  'Parking', 'Air Conditioning', 'Security', 'WiFi', 'Fireplace'
];

export default function FilterSidebar({ onApply }) {
  const { filters, updateFilter, resetFilters, fetchProperties } = useProperties();

  const handleAmenityToggle = (amenity) => {
    const current = filters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    updateFilter('amenities', updated);
  };

  const handleApplyClick = () => {
    fetchProperties();
    if (onApply) onApply();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold text-lg">
          <Filter className="w-5 h-5 text-indigo-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Keywords Search Input */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Search Location / Title
        </label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="e.g. New York, Villa, Beach..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Listing Type Tabs (All, Sale, Rent) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Listing Purpose
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 rounded-2xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'sale', label: 'For Sale' },
            { id: 'rent', label: 'For Rent' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => updateFilter('listingType', tab.id)}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filters.listingType === tab.id
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type Dropdown */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Property Type
        </label>
        <select
          value={filters.propertyType}
          onChange={(e) => updateFilter('propertyType', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
        >
          <option value="all">All Property Types</option>
          <option value="apartment">Apartment / Condo</option>
          <option value="house">Single Family House</option>
          <option value="villa">Luxury Villa</option>
          <option value="commercial">Commercial Space</option>
          <option value="land">Plot / Land</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Price Range ($)
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Bedrooms Selector Pills */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Bedrooms
        </label>
        <div className="flex flex-wrap gap-1.5">
          {['all', '1', '2', '3', '4', '5'].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => updateFilter('bedrooms', num)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filters.bedrooms === num
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {num === 'all' ? 'Any' : `${num}+ Beds`}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities Checkboxes */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Features & Amenities
        </label>
        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
          {availableAmenities.map(amenity => {
            const isChecked = filters.amenities?.includes(amenity);
            return (
              <label
                key={amenity}
                className="flex items-center gap-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer select-none"
              >
                <div
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                    isChecked
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Sorting */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Sort Listings By
        </label>
        <select
          value={filters.sort}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
        >
          <option value="newest">Newest Listed</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="views">Most Viewed</option>
        </select>
      </div>

      {/* Apply Button */}
      <button
        type="button"
        onClick={handleApplyClick}
        className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 transition-all cursor-pointer active:scale-95"
      >
        Apply Search Filters
      </button>

    </div>
  );
}
