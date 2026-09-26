import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import {
  Home,
  PlusCircle,
  Heart,
  User,
  LogOut,
  LayoutDashboard,
  Building,
  Key,
  Shield,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { updateFilter, resetFilters } = useProperties();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const savedCount = user?.savedProperties?.length || 0;

  const handleNavCategory = (type) => {
    resetFilters();
    updateFilter('listingType', type);
    navigate('/properties');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-19">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Urban<span className="text-indigo-600">Haven</span>
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase -mt-1">
                Real Estate Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-indigo-600 bg-indigo-50/70 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Home
            </Link>

            <button
              onClick={() => handleNavCategory('sale')}
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Building className="w-4 h-4 text-emerald-500" />
              For Sale
            </button>

            <button
              onClick={() => handleNavCategory('rent')}
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="w-4 h-4 text-blue-500" />
              For Rent
            </button>

            <Link
              to="/properties"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/properties' ? 'text-indigo-600 bg-indigo-50/70 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Explore All
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Post Listing CTA */}
            <Link
              to="/post-property"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Property</span>
            </Link>

            {/* Saved Favorites Button */}
            {isAuthenticated && (
              <Link
                to="/dashboard?tab=saved"
                className="relative p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Saved Properties"
              >
                <Heart className="w-5 h-5" />
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {savedCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Dropdown / Auth Links */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop'}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/20"
                  />
                  <span className="text-sm font-semibold text-slate-700 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-md bg-indigo-50 text-indigo-600">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/dashboard?tab=profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      My Profile
                    </Link>

                    <Link
                      to="/dashboard?tab=listings"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      My Listings
                    </Link>

                    <Link
                      to="/dashboard?tab=saved"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-slate-400" />
                      Saved Properties ({savedCount})
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/dashboard?tab=admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-600 font-medium hover:bg-amber-50 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-amber-500" />
                        Admin Moderation
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100/60 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <button
            onClick={() => handleNavCategory('sale')}
            className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Properties For Sale
          </button>
          <button
            onClick={() => handleNavCategory('rent')}
            className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Properties For Rent
          </button>
          <Link
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            All Listings
          </Link>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/post-property"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center font-semibold rounded-xl bg-indigo-600 text-white shadow-xs"
            >
              + Post Property
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard?tab=profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-slate-700 font-medium"
                >
                  Dashboard & Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-rose-600 font-semibold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center rounded-xl border border-slate-200 font-semibold text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center rounded-xl bg-slate-900 text-white font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
