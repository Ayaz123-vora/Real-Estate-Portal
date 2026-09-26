import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';
import {
  Search,
  Building,
  Home as HomeIcon,
  Key,
  ShieldCheck,
  Zap,
  TrendingUp,
  MapPin,
  ArrowRight,
  Sparkles,
  Award,
  Users,
  CheckCircle
} from 'lucide-react';

export default function HomePage() {
  const { featuredProperties, fetchFeatured, updateFilter, resetFilters, featuredLoading } = useProperties();
  const navigate = useNavigate();

  const [heroTab, setHeroTab] = useState('all'); // 'all', 'sale', 'rent'
  const [cityInput, setCityInput] = useState('');
  const [typeInput, setTypeInput] = useState('all');

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    resetFilters();
    if (heroTab !== 'all') updateFilter('listingType', heroTab);
    if (cityInput) updateFilter('city', cityInput);
    if (typeInput !== 'all') updateFilter('propertyType', typeInput);
    navigate('/properties');
  };

  const handleCategoryClick = (propertyType) => {
    resetFilters();
    updateFilter('propertyType', propertyType);
    navigate('/properties');
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white">
        
        {/* Decorative background glow circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>#1 Property Sales & Rental Portal</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-none">
            Find Your Dream Home & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400">Luxury Rentals</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Explore thousands of verified properties for sale and rent with interactive search filters, responsive UI, and instant agent inquiries.
          </p>

          {/* DYNAMIC HERO SEARCH CARD */}
          <div className="mt-10 max-w-4xl mx-auto bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-2xl text-slate-900 border border-white/20">
            
            {/* Search Type Tabs */}
            <div className="flex items-center gap-2 mb-4 border-b border-slate-200/80 pb-3">
              {[
                { id: 'all', label: 'All Listings', icon: HomeIcon },
                { id: 'sale', label: 'Buy Property', icon: Building },
                { id: 'rent', label: 'Rent Property', icon: Key }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setHeroTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      heroTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form Inputs Grid */}
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
              
              {/* City Input */}
              <div className="relative text-left">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Location / City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
                  <input
                    type="text"
                    placeholder="e.g. New York, Miami"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Property Type Dropdown */}
              <div className="text-left">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Property Type
                </label>
                <select
                  value={typeInput}
                  onChange={(e) => setTypeInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="all">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>

              {/* Quick Keywords / City Pill */}
              <div className="hidden lg:block text-left">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Popular Hubs
                </label>
                <div className="flex gap-1.5 pt-1">
                  {['Los Angeles', 'Chicago'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCityInput(c)}
                      className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 font-medium transition-colors"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 sm:pt-4 lg:pt-0">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 stroke-[3]" />
                  <span>Search Properties</span>
                </button>
              </div>

            </form>

          </div>

          {/* Quick Stats Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-slate-400 text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Listings</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Zero Brokerage Fees on Select Properties</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Instant Agent Connect</span>
            </div>
          </div>

        </div>
      </section>

      {/* QUICK CATEGORY SEARCH GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore by Property Type</h2>
          <p className="text-slate-500 text-sm mt-1">Browse listings categorized by architecture and lifestyle purpose</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {[
            { id: 'apartment', name: 'Apartments', count: '450+ Listings', icon: '🏢', bg: 'bg-blue-50 text-blue-600 border-blue-100' },
            { id: 'house', name: 'Houses', count: '320+ Listings', icon: '🏡', bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
            { id: 'villa', name: 'Luxury Villas', count: '180+ Listings', icon: '🏰', bg: 'bg-purple-50 text-purple-600 border-purple-100' },
            { id: 'commercial', name: 'Commercial', count: '120+ Listings', icon: '💼', bg: 'bg-amber-50 text-amber-600 border-amber-100' },
            { id: 'land', name: 'Plot & Land', count: '90+ Listings', icon: '🏞️', bg: 'bg-rose-50 text-rose-600 border-rose-100' }
          ].map(cat => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`p-6 rounded-3xl border ${cat.bg} hover:-translate-y-1.5 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg flex flex-col items-center text-center`}
            >
              <span className="text-4xl mb-3">{cat.icon}</span>
              <h3 className="font-bold text-slate-900 text-base">{cat.name}</h3>
              <span className="text-xs font-semibold text-slate-500 mt-1">{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PROPERTIES CAROUSEL / GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Collection</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Featured Property Listings</h2>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 bg-slate-200 rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.slice(0, 8).map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* WHY CHOOSE US & STATS */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Why UrbanHaven</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                The Most Trusted Platform for Buyers, Tenants & Sellers
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                We combine real-time MongoDB query optimization, JWT secured user profiles, and intuitive UI filters to make property hunting smooth and transparent.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  { title: 'Verified Property Listings', desc: 'Every property goes through agent moderation before publishing.' },
                  { title: 'Dynamic Multi-Filter Search', desc: 'Filter by exact budget, location, bedroom counts, amenities, and listing type.' },
                  { title: 'Direct Inquiries', desc: 'Connect directly with property owners and licensed agents via built-in messaging.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {[
                { number: '1,200+', label: 'Active Properties', icon: Building },
                { number: '99%', label: 'Happy Clients', icon: Users },
                { number: '35+', label: 'Top Cities', icon: MapPin },
                { number: '24/7', label: 'Support & Security', icon: Zap }
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/60 text-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center mx-auto">
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-black text-white">{stat.number}</p>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* CALL TO ACTION FOR SELLERS/LANDLORDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 p-8 sm:p-12 text-white overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Are You a Property Owner or Real Estate Agent?</h2>
            <p className="text-indigo-100 text-sm sm:text-base">
              List your homes, apartments, or commercial spaces for sale or rent on UrbanHaven and connect with thousands of active buyers and renters daily.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/post-property"
                className="px-6 py-3.5 rounded-2xl bg-white text-indigo-900 font-extrabold text-sm shadow-xl hover:bg-indigo-50 transition-all cursor-pointer"
              >
                + Post Your Property Free
              </Link>
              <Link
                to="/register"
                className="px-6 py-3.5 rounded-2xl border border-white/30 text-white font-bold text-sm hover:bg-white/10 transition-all"
              >
                Create Agent Account
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
