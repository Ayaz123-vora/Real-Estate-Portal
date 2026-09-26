import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const PropertyContext = createContext();

export const useProperties = () => useContext(PropertyContext);

const initialFilters = {
  search: '',
  listingType: 'all', // 'all', 'sale', 'rent'
  propertyType: 'all', // 'all', 'apartment', 'house', 'villa', 'commercial', 'land'
  city: '',
  minPrice: '',
  maxPrice: '',
  bedrooms: 'all',
  bathrooms: 'all',
  minArea: '',
  maxArea: '',
  amenities: [],
  sort: 'newest'
};

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(false);

  // Fetch properties based on active filters
  const fetchProperties = useCallback(async (customFilters = null) => {
    setLoading(true);
    try {
      const queryFilters = customFilters || filters;
      const params = new URLSearchParams();

      if (queryFilters.search) params.append('search', queryFilters.search);
      if (queryFilters.listingType && queryFilters.listingType !== 'all') params.append('listingType', queryFilters.listingType);
      if (queryFilters.propertyType && queryFilters.propertyType !== 'all') params.append('propertyType', queryFilters.propertyType);
      if (queryFilters.city) params.append('city', queryFilters.city);
      if (queryFilters.minPrice) params.append('minPrice', queryFilters.minPrice);
      if (queryFilters.maxPrice) params.append('maxPrice', queryFilters.maxPrice);
      if (queryFilters.bedrooms && queryFilters.bedrooms !== 'all') params.append('bedrooms', queryFilters.bedrooms);
      if (queryFilters.bathrooms && queryFilters.bathrooms !== 'all') params.append('bathrooms', queryFilters.bathrooms);
      if (queryFilters.minArea) params.append('minArea', queryFilters.minArea);
      if (queryFilters.maxArea) params.append('maxArea', queryFilters.maxArea);
      if (queryFilters.sort) params.append('sort', queryFilters.sort);
      
      if (queryFilters.amenities && queryFilters.amenities.length > 0) {
        params.append('amenities', queryFilters.amenities.join(','));
      }

      const res = await axios.get(`/api/properties?${params.toString()}`);
      setProperties(res.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch featured properties for homepage
  const fetchFeatured = useCallback(async () => {
    setFeaturedLoading(true);
    try {
      const res = await axios.get('/api/properties/featured');
      setFeaturedProperties(res.data);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      setFeaturedProperties([]);
    } finally {
      setFeaturedLoading(false);
    }
  }, []);

  // Update specific filter key
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Reset all filters to default
  const resetFilters = () => {
    setFilters(initialFilters);
    fetchProperties(initialFilters);
  };

  return (
    <PropertyContext.Provider value={{
      properties,
      featuredProperties,
      filters,
      loading,
      featuredLoading,
      setFilters,
      updateFilter,
      resetFilters,
      fetchProperties,
      fetchFeatured
    }}>
      {children}
    </PropertyContext.Provider>
  );
};
