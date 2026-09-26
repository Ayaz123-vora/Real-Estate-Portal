import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import InquiryModal from '../components/InquiryModal';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Heart,
  Share2,
  Calendar,
  CheckCircle2,
  Eye,
  Mail,
  Phone,
  MessageSquare,
  ArrowLeft,
  Building,
  ShieldCheck,
  Star
} from 'lucide-react';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleSaveProperty, isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  const isSaved = Array.isArray(user?.savedProperties) && user.savedProperties.some(
    item => (typeof item === 'string' ? item : item._id || item) === id
  );

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/properties/${id}`);
        setProperty(res.data.property);
        setSimilarProperties(res.data.similarProperties || []);
        if (res.data.property.images && res.data.property.images.length > 0) {
          setActiveImage(res.data.property.images[0]);
        }
      } catch (error) {
        console.error('Failed to load property details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-8 bg-slate-200 rounded-xl w-1/3"></div>
        <div className="h-[450px] bg-slate-200 rounded-3xl"></div>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 h-64 bg-slate-200 rounded-3xl"></div>
          <div className="h-64 bg-slate-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Property Listing Not Found</h2>
        <p className="text-slate-500">The property you are looking for may have been removed or deleted.</p>
        <Link to="/properties" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold">
          Back to All Properties
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.price);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Listings</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              if (!isAuthenticated) return navigate('/login');
              await toggleSaveProperty(property._id);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isSaved
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
            <span>{isSaved ? 'Saved in Favorites' : 'Save Property'}</span>
          </button>
        </div>
      </div>

      {/* HEADER TITLE & PRICE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-white ${
              property.listingType === 'rent' ? 'bg-blue-600' : 'bg-emerald-600'
            }`}>
              {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
              {property.propertyType}
            </span>
            {property.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-900 flex items-center gap-1">
                <Star className="w-3 h-3 fill-slate-900" />
                Featured
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {property.title}
          </h1>

          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{property.location?.address}, {property.location?.city}, {property.location?.state} {property.location?.zipCode}</span>
          </div>
        </div>

        <div className="text-left md:text-right space-y-1">
          <span className="text-3xl sm:text-4xl font-black text-indigo-600 tracking-tight">
            {formattedPrice}
          </span>
          {property.listingType === 'rent' && (
            <span className="text-sm font-semibold text-slate-500">/{property.rentPeriod || 'mo'}</span>
          )}
          <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold md:justify-end">
            <Eye className="w-3.5 h-3.5" />
            <span>{property.viewsCount || 1} Views</span>
          </div>
        </div>
      </div>

      {/* IMAGE GALLERY VIEW */}
      <div className="space-y-4">
        {/* Main Display Image */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200">
          <img
            src={activeImage || property.images?.[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-300"
          />
        </div>

        {/* Thumbnail Selector Row */}
        {property.images && property.images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {property.images.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(imgUrl)}
                className={`relative w-24 h-16 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImage === imgUrl ? 'border-indigo-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TWO COLUMN DETAILS & AGENT CONTACT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2-Cols: Overview Specs & Description */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Key Specs Card Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bedrooms</span>
                <span className="text-base font-extrabold text-slate-900">{property.bedrooms} Beds</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bathrooms</span>
                <span className="text-base font-extrabold text-slate-900">{property.bathrooms} Baths</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Area</span>
                <span className="text-base font-extrabold text-slate-900">{property.area} sqft</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Property Type</span>
                <span className="text-base font-extrabold text-slate-900 capitalize">{property.propertyType}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900">Property Description</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {property.description}
            </p>
          </div>

          {/* Amenities Checklist */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-xl font-extrabold text-slate-900">Features & Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right 1-Col: Agent Card & Contact Sticky Box */}
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-lg sticky top-24 space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <img
                src={property.postedBy?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop'}
                alt={property.postedBy?.name || 'Agent'}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md"
              />
              <div>
                <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider mb-1">
                  {property.postedBy?.role || 'Listing Agent'}
                </span>
                <h4 className="text-lg font-extrabold text-slate-900">{property.postedBy?.name || 'Agent'}</h4>
                <p className="text-xs text-slate-500 font-medium">{property.postedBy?.phone || '+1 (800) 555-REAL'}</p>
              </div>
            </div>

            {property.postedBy?.bio && (
              <p className="text-xs text-slate-500 leading-relaxed italic bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                "{property.postedBy.bio}"
              </p>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setInquiryModalOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Agent / Inquire</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified Listing Agent</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SIMILAR PROPERTIES CAROUSEL */}
      {similarProperties.length > 0 && (
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <h3 className="text-2xl font-extrabold text-slate-900">Similar Properties You Might Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map(simProp => (
              <PropertyCard key={simProp._id} property={simProp} />
            ))}
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      <InquiryModal
        property={property}
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />

    </div>
  );
}
