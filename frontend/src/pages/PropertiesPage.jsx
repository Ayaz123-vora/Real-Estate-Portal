import React, { useEffect, useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';
import { Filter, SlidersHorizontal, Building, RefreshCw, X } from 'lucide-react';

export default function PropertiesPage() {
  const { properties, filters, loading, fetchProperties, resetFilters, updateFilter } = useProperties();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const activeFiltersCount = [
    filters.search,
    filters.listingType !== 'all' ? filters.listingType : null,
    filters.propertyType !== 'all' ? filters.propertyType : null,
    filters.city,
    filters.minPrice,
    filters.maxPrice,
    filters.bedrooms !== 'all' ? filters.bedrooms : null,
    ...(filters.amenities || [])
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Property Listings
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Browse verified real estate for sale and rent across major cities
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
        </button>
      </div>

      {/* ACTIVE FILTER BADGES ROW */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Active Filters:
          </span>

          {filters.search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
              Query: "{filters.search}"
              <X className="w-3.5 h-3.5 cursor-pointer hover:text-indigo-900" onClick={() => updateFilter('search', '')} />
            </span>
          )}

          {filters.listingType !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
              Type: For {filters.listingType}
              <X className="w-3.5 h-3.5 cursor-pointer hover:text-emerald-900" onClick={() => updateFilter('listingType', 'all')} />
            </span>
          )}

          {filters.propertyType !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-100">
              Category: {filters.propertyType}
              <X className="w-3.5 h-3.5 cursor-pointer hover:text-purple-900" onClick={() => updateFilter('propertyType', 'all')} />
            </span>
          )}

          {filters.city && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
              City: {filters.city}
              <X className="w-3.5 h-3.5 cursor-pointer hover:text-blue-900" onClick={() => updateFilter('city', '')} />
            </span>
          )}

          {filters.bedrooms !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-100">
              Beds: {filters.bedrooms}+
              <X className="w-3.5 h-3.5 cursor-pointer hover:text-amber-900" onClick={() => updateFilter('bedrooms', 'all')} />
            </span>
          )}

          <button
            onClick={resetFilters}
            className="text-xs font-bold text-rose-600 hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* MAIN CONTENT SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterSidebar />
        </div>

        {/* MOBILE FILTER MODAL DRAWER */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
            <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-extrabold text-lg text-slate-900">Search Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <FilterSidebar onApply={() => setMobileFilterOpen(false)} />
            </div>
          </div>
        )}

        {/* PROPERTY LISTINGS GRID AREA */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Results Count & Sort Dropdown */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs sm:text-sm font-bold text-slate-700">
              Showing <span className="text-indigo-600 font-extrabold">{properties.length}</span> properties match
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 hidden sm:inline uppercase">Sort:</span>
              <select
                value={filters.sort}
                onChange={(e) => {
                  updateFilter('sort', e.target.value);
                  fetchProperties({ ...filters, sort: e.target.value });
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="views">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-slate-200 rounded-3xl"></div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 space-y-4">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto">
                <Building className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Properties Found</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                We couldn't find any real estate listings matching your criteria. Try loosening your price range or clearing filters.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
