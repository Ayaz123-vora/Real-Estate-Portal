import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Maximize2, Star, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PropertyCard({ property }) {
  const { user, toggleSaveProperty, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isSaved = Array.isArray(user?.savedProperties) && user.savedProperties.some(
    item => (typeof item === 'string' ? item : item._id || item) === property._id
  );

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await toggleSaveProperty(property._id);
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.price);

  const mainImage = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop';

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col h-full">
      
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-white shadow-md backdrop-blur-md ${
              property.listingType === 'rent'
                ? 'bg-blue-600/90'
                : 'bg-emerald-600/90'
            }`}>
              {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
            </span>

            {property.featured && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-900 shadow-md flex items-center gap-1">
                <Star className="w-3 h-3 fill-slate-900" />
                Featured
              </span>
            )}
          </div>

          {/* Favorite Heart Button */}
          <button
            onClick={handleFavoriteClick}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer shadow-md ${
              isSaved
                ? 'bg-rose-500 text-white scale-110'
                : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500 hover:scale-105'
            }`}
            aria-label="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="px-3.5 py-1.5 rounded-2xl bg-slate-900/85 backdrop-blur-md text-white border border-white/10 shadow-lg">
            <span className="text-lg font-black tracking-tight text-emerald-400">
              {formattedPrice}
            </span>
            {property.listingType === 'rent' && (
              <span className="text-xs text-slate-300 font-medium">/{property.rentPeriod || 'mo'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Property Title */}
          <Link to={`/properties/${property._id}`}>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
              {property.title}
            </h3>
          </Link>

          {/* Location Pin */}
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mt-1.5 mb-4">
            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">
              {property.location?.address}, {property.location?.city}
            </span>
          </div>

          {/* Property Key Specs */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-2xl bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-100 mb-4">
            <div className="flex items-center gap-1.5 justify-center">
              <Bed className="w-4 h-4 text-indigo-500" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center border-x border-slate-200/60">
              <Bath className="w-4 h-4 text-indigo-500" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center">
              <Maximize2 className="w-4 h-4 text-indigo-500" />
              <span>{property.area} sqft</span>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <img
              src={property.postedBy?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop'}
              alt={property.postedBy?.name || 'Agent'}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <span className="text-xs font-semibold text-slate-600 truncate max-w-[100px]">
              {property.postedBy?.name || 'Verified Agent'}
            </span>
          </div>

          <Link
            to={`/properties/${property._id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>Details</span>
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
