import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import {
  User,
  LayoutDashboard,
  Heart,
  MessageSquare,
  Shield,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Users,
  Edit3,
  Save,
  PlusCircle
} from 'lucide-react';

export default function DashboardPage() {
  const { user, updateProfile, isAdmin, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentTab = searchParams.get('tab') || 'profile';

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // My Listings State
  const [myListings, setMyListings] = useState([]);
  const [myListingsLoading, setMyListingsLoading] = useState(false);

  // Saved Properties State
  const [savedProperties, setSavedProperties] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);

  // Inquiries State
  const [receivedInquiries, setReceivedInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);

  // Admin State
  const [pendingProperties, setPendingProperties] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);

  // Sync user profile state
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  // Load tab content on tab change
  useEffect(() => {
    if (currentTab === 'listings') {
      fetchMyListings();
    } else if (currentTab === 'saved') {
      fetchSavedProperties();
    } else if (currentTab === 'inquiries') {
      fetchInquiries();
    } else if (currentTab === 'admin' && isAdmin) {
      fetchAdminData();
    }
  }, [currentTab, isAdmin]);

  const fetchMyListings = async () => {
    setMyListingsLoading(true);
    try {
      const res = await axios.get('/api/properties/user/my-listings');
      setMyListings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setMyListingsLoading(false);
    }
  };

  const fetchSavedProperties = async () => {
    setSavedLoading(true);
    try {
      const res = await axios.get('/api/properties/user/saved');
      setSavedProperties(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSavedLoading(false);
    }
  };

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const res = await axios.get('/api/inquiries/received');
      setReceivedInquiries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const fetchAdminData = async () => {
    setAdminLoading(true);
    try {
      const [pendingRes, statsRes] = await Promise.all([
        axios.get('/api/admin/pending'),
        axios.get('/api/admin/stats')
      ]);
      setPendingProperties(pendingRes.data);
      setAdminStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg('');
    try {
      await updateProfile(profileForm);
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property listing?')) return;
    try {
      await axios.delete(`/api/properties/${id}`);
      setMyListings(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert('Failed to delete listing.');
    }
  };

  const handleAdminStatusChange = async (id, status) => {
    try {
      await axios.put(`/api/admin/properties/${id}/status`, { status });
      setPendingProperties(prev => prev.filter(p => p._id !== id));
      fetchAdminData();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-lg"
          />
          <div>
            <h1 className="text-2xl font-extrabold">{user?.name}</h1>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
              Role: {user?.role}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/post-property')}
          className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Post New Property</span>
        </button>
      </div>

      {/* TAB NAVIGATION BAR */}
      <div className="flex overflow-x-auto gap-2 pb-2 border-b border-slate-200">
        {[
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'listings', label: 'My Listings', icon: LayoutDashboard },
          { id: 'saved', label: 'Saved Properties', icon: Heart },
          { id: 'inquiries', label: 'Received Inquiries', icon: MessageSquare },
          ...(isAdmin ? [{ id: 'admin', label: 'Admin Moderation', icon: Shield }] : [])
        ].map(tab => {
          const Icon = tab.icon;
          const active = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREA */}
      <div>
        
        {/* TAB 1: PROFILE */}
        {currentTab === 'profile' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-2xl space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Account Profile Details</h3>
              <p className="text-xs text-slate-500">Update your public contact info and agent bio</p>
            </div>

            {profileMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{profileMsg}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={profileForm.avatar}
                  onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Agent / Seller Bio</label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Briefly describe your real estate experience..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="py-3 px-6 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{profileSaving ? 'Saving Changes...' : 'Save Profile'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: MY LISTINGS */}
        {currentTab === 'listings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900">My Posted Property Listings</h3>
              <button
                onClick={() => navigate('/post-property')}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                + Add Listing
              </button>
            </div>

            {myListingsLoading ? (
              <p className="text-slate-500 text-sm">Loading your properties...</p>
            ) : myListings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 space-y-3">
                <Building className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-slate-600 font-semibold text-sm">You haven't posted any property listings yet.</p>
                <button
                  onClick={() => navigate('/post-property')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  Create First Listing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map(item => (
                  <div key={item._id} className="relative group">
                    <PropertyCard property={item} />
                    
                    {/* Status Badge Overlay */}
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md ${
                        item.status === 'approved'
                          ? 'bg-emerald-600'
                          : item.status === 'pending'
                          ? 'bg-amber-500'
                          : 'bg-rose-600'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    {/* Delete action overlay button */}
                    <div className="p-3 bg-white border-t border-slate-100 rounded-b-3xl flex justify-end gap-2 -mt-3 relative z-10">
                      <button
                        onClick={() => handleDeleteListing(item._id)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Listing</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAVED PROPERTIES */}
        {currentTab === 'saved' && (
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900">Saved Favorite Properties</h3>

            {savedLoading ? (
              <p className="text-slate-500 text-sm">Loading saved properties...</p>
            ) : savedProperties.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 space-y-3">
                <Heart className="w-10 h-10 text-rose-400 mx-auto" />
                <p className="text-slate-600 font-semibold text-sm">No saved properties yet.</p>
                <button
                  onClick={() => navigate('/properties')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  Explore Properties
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.map(item => (
                  <PropertyCard key={item._id} property={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: INQUIRIES */}
        {currentTab === 'inquiries' && (
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900">Received Buyer / Tenant Inquiries</h3>

            {inquiriesLoading ? (
              <p className="text-slate-500 text-sm">Loading messages...</p>
            ) : receivedInquiries.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 space-y-3">
                <MessageSquare className="w-10 h-10 text-indigo-400 mx-auto" />
                <p className="text-slate-600 font-semibold text-sm">No property inquiries received yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {receivedInquiries.map(inq => (
                  <div key={inq._id} className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-xs font-bold text-indigo-600 uppercase">Property: {inq.property?.title || 'Listing'}</span>
                        <h4 className="font-extrabold text-slate-900 text-base">{inq.senderName}</h4>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      "{inq.message}"
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
                      <span>Email: <a href={`mailto:${inq.senderEmail}`} className="text-indigo-600 hover:underline">{inq.senderEmail}</a></span>
                      {inq.senderPhone && <span>Phone: <a href={`tel:${inq.senderPhone}`} className="text-indigo-600 hover:underline">{inq.senderPhone}</a></span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ADMIN MODERATION */}
        {currentTab === 'admin' && isAdmin && (
          <div className="space-y-8">
            
            {/* Admin Stats Overview */}
            {adminStats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 bg-white rounded-3xl border border-slate-200/80 text-center space-y-1">
                  <span className="text-2xl font-black text-indigo-600">{adminStats.totalProperties}</span>
                  <p className="text-xs font-bold text-slate-400 uppercase">Total Properties</p>
                </div>
                <div className="p-5 bg-white rounded-3xl border border-slate-200/80 text-center space-y-1">
                  <span className="text-2xl font-black text-amber-500">{adminStats.pendingProperties}</span>
                  <p className="text-xs font-bold text-slate-400 uppercase">Pending Review</p>
                </div>
                <div className="p-5 bg-white rounded-3xl border border-slate-200/80 text-center space-y-1">
                  <span className="text-2xl font-black text-emerald-600">{adminStats.approvedProperties}</span>
                  <p className="text-xs font-bold text-slate-400 uppercase">Approved</p>
                </div>
                <div className="p-5 bg-white rounded-3xl border border-slate-200/80 text-center space-y-1">
                  <span className="text-2xl font-black text-purple-600">{adminStats.totalUsers}</span>
                  <p className="text-xs font-bold text-slate-400 uppercase">Registered Users</p>
                </div>
              </div>
            )}

            {/* Pending Approvals List */}
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-slate-900">Pending Property Approval Queue</h3>

              {adminLoading ? (
                <p className="text-slate-500 text-sm">Loading queue...</p>
              ) : pendingProperties.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 text-slate-500 text-sm font-semibold">
                  🎉 No pending approvals. All listings are reviewed!
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingProperties.map(item => (
                    <div key={item._id} className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-1 text-left">
                        <h4 className="font-extrabold text-slate-900 text-lg">{item.title}</h4>
                        <p className="text-xs text-slate-500">{item.location?.city} • ${item.price} • Posted by {item.postedBy?.name}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAdminStatusChange(item._id, 'approved')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleAdminStatusChange(item._id, 'rejected')}
                          className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
