import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg">
                <Building className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Urban<span className="text-indigo-400">Haven</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Discover luxury homes, apartments, and prime real estate listings with our dynamic search platform and verified agent network.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>New York • Los Angeles • Miami</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home Portal</Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">All Properties</Link>
              </li>
              <li>
                <Link to="/post-property" className="hover:text-white transition-colors">List Your Property</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">User Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Property Types</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/properties?propertyType=apartment" className="hover:text-white transition-colors">Modern Apartments</Link>
              </li>
              <li>
                <Link to="/properties?propertyType=house" className="hover:text-white transition-colors">Suburban Houses</Link>
              </li>
              <li>
                <Link to="/properties?propertyType=villa" className="hover:text-white transition-colors">Luxury Villas</Link>
              </li>
              <li>
                <Link to="/properties?propertyType=commercial" className="hover:text-white transition-colors">Commercial Offices</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-slate-400">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+1 (800) 555-REAL</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@urbanhaven.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} UrbanHaven Real Estate Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with Node.js, Express, MongoDB & React</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
