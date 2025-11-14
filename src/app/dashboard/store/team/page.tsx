"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { FaSearch, FaChevronDown, FaPhone, FaIdBadge, FaBuilding, FaUser, FaCalendarAlt, FaTag } from 'react-icons/fa';

type TabType = 'orders' | 'payments' | 'returns';

interface SearchedUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  userType: string;
  storeType: string;
  captainId?: string;
  captainName?: string;
  captainPhone?: string;
  createdAt: string;
  isPartialUser?: boolean;
}

interface OrderSummary {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}

export default function TeamPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Search states
  const [searchPhone, setSearchPhone] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchedUser, setSearchedUser] = useState<SearchedUser | null>(null);
  const [searchError, setSearchError] = useState('');
  const [isUserExpanded, setIsUserExpanded] = useState(false);

  // Form states (for creating partial user)
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', captainId: '' });
  const [captains, setCaptains] = useState<any[]>([]);
  const [creatingUser, setCreatingUser] = useState(false);

  // Content states
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({ total: 0, pending: 0, accepted: 0, rejected: 0 });

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/ram/auth/me');
        const data = await res.json();
        if (!data?.user) {
          router.push('/auth/ram/login');
        } else if (data.user.userType !== 'STORE_OWNER' && data.user.userType !== 'VEC_STORE_OWNER') {
          router.push('/auth/ram/dashboard');
        } else {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/auth/ram/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Fetch captains on mount
  useEffect(() => {
    const fetchCaptains = async () => {
      try {
        const res = await fetch('/api/ram/team-members/captains');
        const data = await res.json();
        if (Array.isArray(data)) {
          setCaptains(data);
        }
      } catch (err) {
        console.error('Failed to fetch captains:', err);
      }
    };
    if (user) {
      fetchCaptains();
    }
  }, [user]);

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhone.trim()) {
      setSearchError('Please enter a phone number');
      return;
    }

    setSearching(true);
    setSearchError('');
    setSearchedUser(null);

    try {
      const normalizedPhone = searchPhone.replace(/\D/g, '');
      const res = await fetch(`/api/ram/team-members/details?phone=${normalizedPhone}`);
      const data = await res.json();

      if (data?.error) {
        setSearchError(data.error || 'User not found');
        setShowCreateForm(true);
        setFormData({ ...formData, phone: normalizedPhone });
      } else {
        setSearchedUser(data);
        setShowCreateForm(false);
        setIsUserExpanded(false);
        // Set order summary from the API response
        if (data.orderSummary) {
          setOrderSummary(data.orderSummary);
        }
      }
    } catch (err) {
      console.error('Search failed:', err);
      setSearchError('Failed to search user');
    } finally {
      setSearching(false);
    }
  };

  // Fetch order summary for searched user
  const fetchOrderSummary = async (userId: string) => {
    try {
      // Order summary is now part of the user response, but we can update it here if needed
      // For now this is kept for future enhancements
    } catch (err) {
      console.error('Failed to fetch order summary:', err);
    }
  };

  // Handle create user form
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Name and phone are required');
      return;
    }

    setCreatingUser(true);
    try {
      const res = await fetch('/api/ram/team-members/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          name: formData.name,
          captainId: formData.captainId || null
        })
      });

      const data = await res.json();
      if (data?.user) {
        setSearchedUser({
          id: data.user.id,
          name: data.user.name,
          phone: data.user.phone,
          email: data.user.email,
          userType: data.user.userType,
          storeType: data.user.storeType,
          captainId: data.user.captainId,
          isPartialUser: true,
          createdAt: new Date().toISOString()
        });
        setShowCreateForm(false);
        setFormData({ name: '', phone: '', captainId: '' });
        setSearchError('');
      } else {
        alert(data?.error || 'Failed to create user');
      }
    } catch (err) {
      console.error('Create user failed:', err);
      alert('Failed to create user');
    } finally {
      setCreatingUser(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-50 to-white">
        <div className="text-xl text-pink-700 font-bold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-200px)]">
        
        {/* ===== LEFT PANEL: SEARCH & USER CARD ===== */}
        <div className={`${searchedUser ? 'lg:w-80' : 'w-full lg:w-1/3'} flex-shrink-0`}>
          
          {/* SEARCH BOX */}
          <div className={`bg-white rounded-xl shadow-lg p-4 mb-4 transition-all ${searchedUser ? 'compact' : ''}`}>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-pink-500" />
                <input
                  type="tel"
                  placeholder="Search by phone…"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <button
                type="submit"
                disabled={searching}
                className="w-full mt-2 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition disabled:opacity-50"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </form>
            {searchError && !showCreateForm && (
              <p className="text-red-600 text-sm mt-2">{searchError}</p>
            )}
          </div>

          {/* ACTION BUTTONS: shown under search on left when a user is present */}
          {searchedUser && !showCreateForm && (
            <div className="flex flex-col gap-3">
              <button className="w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-medium transition shadow-md flex items-center justify-center gap-2">
                📦 Create Order
              </button>
              <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition shadow-md flex items-center justify-center gap-2">
                💰 Record Payment
              </button>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition shadow-md flex items-center justify-center gap-2">
                🔄 Create Return
              </button>
            </div>
          )}

          {/* create form moved to main content when needed */}
        </div>

        {/* ===== RIGHT PANEL: ACTIONS & CONTENT ===== */}
        {(searchedUser || showCreateForm) && (
          <div className="flex-1 flex flex-col">
            {/* USER CARD (top-right) */}
            {searchedUser && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-pink-600 p-4 text-white cursor-pointer hover:from-pink-600 hover:to-pink-700 transition"
                  onClick={() => setIsUserExpanded(!isUserExpanded)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-10 h-10 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                          <FaUser className="text-white" size={18} />
                        </div>
                        <div>
                          <h3 className="font-medium text-base">{searchedUser.name}</h3>
                        </div>
                      </div>
                      <div className="text-sm text-pink-100 ml-12 flex items-center gap-2">
                        <FaPhone size={12} />
                        {searchedUser.phone}
                      </div>
                    </div>
                    <FaChevronDown 
                      size={18}
                      className={`transition-transform ${isUserExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    <FaIdBadge size={12} />
                    {searchedUser.userType}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                    <FaBuilding size={12} />
                    {searchedUser.storeType}
                  </span>
                  {searchedUser.isPartialUser && (
                    <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                      PARTIAL USER
                    </span>
                  )}
                </div>

                {isUserExpanded && (
                  <div className="px-4 py-4 space-y-3 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900">{searchedUser.email || '—'}</span>
                    </div>
                    {searchedUser.captainName && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Captain:</span>
                          <span className="font-medium text-gray-900">{searchedUser.captainName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Captain Phone:</span>
                          <span className="font-medium text-gray-900">{searchedUser.captainPhone}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(searchedUser.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${searchedUser.isPartialUser ? 'text-orange-600' : 'text-green-600'}`}>
                        {searchedUser.isPartialUser ? 'PARTIAL USER' : 'COMPLETE'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* If creating a user (not found), show the create form in main area to occupy whole space */}
            {showCreateForm && !searchedUser ? (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
                <h3 className="font-medium text-base text-gray-900 mb-2">Create Team Member</h3>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      disabled
                      placeholder="Phone"
                      value={formData.phone}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Captain (Optional)</label>
                    <select
                      value={formData.captainId}
                      onChange={(e) => setFormData({ ...formData, captainId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">— Select Captain —</option>
                      {captains.map((captain) => (
                        <option key={captain.id} value={captain.id}>
                          {captain.name} ({captain.phone})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={creatingUser}
                      className="flex-1 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                    >
                      {creatingUser ? 'Creating...' : 'Create Member'}
                    </button>
                    <button type="button" onClick={() => setShowCreateForm(false)} className="py-2 px-4 bg-gray-100 rounded">Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              /* ACTION BUTTONS (Sticky Top) */
              <div className="sticky top-24 z-10 bg-white rounded-xl shadow-lg p-4 mb-4 flex gap-3 flex-wrap lg:flex-row">
              <button className="flex-1 lg:flex-initial px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-medium transition shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                📦 Create Order
              </button>
              <button className="flex-1 lg:flex-initial px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                💰 Record Payment
              </button>
              <button className="flex-1 lg:flex-initial px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                🔄 Create Return
              </button>
            </div>
            )}

            {/* TAB SEGMENT CONTROL */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
              <div className="flex border-b border-gray-200">
                {(['orders', 'payments', 'returns'] as TabType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 font-medium transition ${
                      activeTab === tab
                        ? 'bg-pink-50 text-pink-700 border-b-2 border-pink-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab === 'orders' && 'All Orders'}
                    {tab === 'payments' && 'All Payments'}
                    {tab === 'returns' && 'All Returns'}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT */}
              <div className="p-4">
                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    {/* Summary Strip */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-gray-600 text-sm">Total</p>
                        <p className="text-2xl font-bold text-gray-900">{orderSummary.total}</p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg text-center">
                        <p className="text-yellow-600 text-sm">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{orderSummary.pending}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <p className="text-green-600 text-sm">Accepted</p>
                        <p className="text-2xl font-bold text-green-600">{orderSummary.accepted}</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg text-center">
                        <p className="text-red-600 text-sm">Rejected</p>
                        <p className="text-2xl font-bold text-red-600">{orderSummary.rejected}</p>
                      </div>
                    </div>
                    
                    {/* Empty State */}
                    <div className="text-center py-8 text-gray-500">
                      <FaTag size={32} className="mx-auto mb-2 text-gray-300" />
                      <p>No orders found for this distributor</p>
                    </div>
                  </div>
                )}

                {activeTab === 'payments' && (
                  <div className="text-center py-8 text-gray-500">
                    <FaTag size={32} className="mx-auto mb-2 text-gray-300" />
                    <p>No payment records found for this distributor</p>
                  </div>
                )}

                {activeTab === 'returns' && (
                  <div className="text-center py-8 text-gray-500">
                    <FaTag size={32} className="mx-auto mb-2 text-gray-300" />
                    <p>No return requests found for this distributor</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State (no search) */}
        {!searchedUser && !showCreateForm && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center">
              <FaSearch size={48} className="mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-medium text-gray-700 mb-2">Search for a Distributor</h2>
              <p className="text-gray-500 max-w-md">
                Enter a phone number in the search box to find a distributor and manage their orders, payments, and returns.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
