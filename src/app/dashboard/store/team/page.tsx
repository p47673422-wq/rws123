"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { FaSearch, FaChevronDown, FaPhone, FaIdBadge, FaBuilding, FaUser, FaCalendarAlt, FaTag, FaTimes, FaTrash, FaPlus } from 'react-icons/fa';

type TabType = 'orders' | 'payments' | 'returns';
type FormType = 'order' | 'return' | 'payment' | null;

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
  orders?: any[];
  returns?: any[];
  payments?: any[];
}

interface OrderSummary {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}

interface BookItem {
  id: string;
  name: string;
  language: string;
  price: number;
}

interface FormItem {
  bookId: string;
  bookName: string;
  language: string;
  quantity?: number;
  price: number;
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

  // Modal states
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [bookSearchTerm, setBookSearchTerm] = useState('');
  const [formItems, setFormItems] = useState<FormItem[]>([]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [createdBill, setCreatedBill] = useState<any>(null);
  const [billType, setBillType] = useState<FormType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inlineErrors, setInlineErrors] = useState<Record<number, string>>({});

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

  // Populate book lists depending on the active form:
  // - order: books available in WAREHOUSE for current user's storeType (call /api/ram/inventory)
  // - payment / return: derive from distributor's preorders minus already paid quantities
  useEffect(() => {
    const loadForOrder = async () => {
      try {
        // fetch warehouse inventory for current user's storeType
        const params = new URLSearchParams({ inventoryType: 'WAREHOUSE' });
        if (user?.storeType) params.set('warehouseType', user.storeType);
        const res = await fetch(`/api/ram/inventory?${params.toString()}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          // map inventory rows to book entries with available quantity
          const mapped = data.map((inv: any) => ({ id: inv.book.id, name: inv.book.name, language: inv.book.language, price: inv.book.price ?? 0, available: inv.quantity }));
          setBooks(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch warehouse inventory:', err);
      }
    };

    const computeAvailableFromPreorders = () => {
      if (!searchedUser) return [];
      const orderMap: Record<string, { id: string; name: string; language: string; qty: number; price: number }> = {};
      // sum preorders
      (searchedUser.orders || []).forEach((o: any) => {
        (o.items || []).forEach((it: any) => {
          const key = `${it.bookId}`;
          if (!orderMap[key]) orderMap[key] = { id: it.bookId, name: it.title || it.bookName || '', language: it.language || '', qty: 0, price: Number(it.price) || 0 };
          orderMap[key].qty += Number(it.quantity) || 0;
        });
      });

      // subtract already returned quantities
      (searchedUser.returns || []).forEach((r: any) => {
        (r.items || []).forEach((it: any) => {
          const key = `${it.bookId}`;
          if (!orderMap[key]) return;
          orderMap[key].qty -= Number(it.quantity) || 0;
        });
      });

      // subtract already paid quantities from payment requests
      (searchedUser.payments || []).forEach((p: any) => {
        (p.items || []).forEach((it: any) => {
          const key = `${it.bookId}`;
          if (!orderMap[key]) return;
          orderMap[key].qty -= Number(it.quantity) || 0;
        });
      });

      const arr = Object.values(orderMap).filter(x => x.qty > 0).map(x => ({ id: x.id, name: x.name, language: x.language, price: x.price, available: x.qty }));
      setBooks(arr);
      return arr;
    };

    if (activeForm === 'order') {
      loadForOrder();
    } else if ((activeForm === 'payment' || activeForm === 'return') && searchedUser) {
      computeAvailableFromPreorders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeForm, user, searchedUser]);

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

  // Add item to form, respecting available quantities when present
  const handleAddItem = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    const available = (book as any).available ?? Infinity;
    // if there is an available constraint, ensure we don't add more than available
    const alreadySelected = formItems.reduce((s, it) => it.bookId === bookId ? s + (Number(it.quantity) || 0) : s, 0);
    if (alreadySelected >= available) {
      alert('No more available quantity for this book');
      return;
    }

    setFormItems([...formItems, {
      bookId: book.id,
      bookName: book.name,
      language: book.language,
      // quantity left empty for user to enter
      price: Number((book as any).price) || 0
    }]);
    setBookSearchTerm('');
  };

  // helper to get base available for a book id from `books`
  const getBaseAvailable = (bookId: string) => {
    const b = books.find(bb => bb.id === bookId) as any;
    if (!b) return Infinity;
    return Number(b.available) || 0;
  };

  // helper to compute remaining available considering items already in form (excluding current index)
  const getAvailableRemaining = (bookId: string, excludeIndex?: number) => {
    const base = getBaseAvailable(bookId);
    const selected = formItems.reduce((s, it, i) => {
      if (excludeIndex !== undefined && i === excludeIndex) return s;
      return it.bookId === bookId ? s + (Number(it.quantity) || 0) : s;
    }, 0);
    return Math.max(0, base - selected);
  };

  // Remove item from form
  const handleRemoveItem = (index: number) => {
    setFormItems(formItems.filter((_, i) => i !== index));
  };

  // Calculate total
  const calculateTotal = () => {
    return formItems.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);
  };

  // Handle form submission (Create Order / Return / Payment)
  const handleFormSubmit = async () => {
    if (!searchedUser) return;
    if (!formItems.length) {
      alert('Please add at least one item');
      return;
    }

    if (activeForm === 'payment' && !paymentAmount) {
      alert('Please enter payment amount');
      return;
    }

    // helper to compute available quantities (preorders - returns - payments) per book
    const getAvailableMap = (): Map<string, number> => {
      const map = new Map<string, number>();
      if (!searchedUser) return map;
      // sum preorders
      (searchedUser.orders || []).forEach((o: any) => {
        (o.items || []).forEach((it: any) => {
          const id = String(it.bookId);
          map.set(id, (map.get(id) || 0) + (Number(it.quantity) || 0));
        });
      });
      // subtract returns
      (searchedUser.returns || []).forEach((r: any) => {
        (r.items || []).forEach((it: any) => {
          const id = String(it.bookId);
          map.set(id, (map.get(id) || 0) - (Number(it.quantity) || 0));
        });
      });
      // subtract payments
      (searchedUser.payments || []).forEach((p: any) => {
        (p.items || []).forEach((it: any) => {
          const id = String(it.bookId);
          map.set(id, (map.get(id) || 0) - (Number(it.quantity) || 0));
        });
      });
      return map;
    };

    // Validate quantities entered and availability
    const availableMap = getAvailableMap();
    for (const it of formItems) {
      const qty = Number(it.quantity) || 0;
      if (qty <= 0) {
        alert('Please enter quantity for all items');
        return;
      }
      const avail = availableMap.get(it.bookId) || 0;
      if (qty > avail) {
        alert(`Quantity for ${it.bookName} exceeds available (${avail}).`);
        return;
      }
    }

    // For payments, ensure paymentAmount matches computed total
    const itemsTotal = calculateTotal();
    if (activeForm === 'payment') {
      const paid = Number(paymentAmount) || 0;
      if (Math.abs(itemsTotal - paid) > 0.009) {
        alert('Payment amount must match sum of item prices × quantities');
        return;
      }
    }

    // final guard: ensure no inline errors before submit
    if (Object.values(inlineErrors).some(v => v)) {
      alert('Please fix quantity errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      let endpoint = '';
      let payload: any = {
        distributorId: searchedUser.id,
        items: formItems.map(it => ({ bookId: it.bookId, quantity: it.quantity, price: it.price }))
      };

      if (activeForm === 'order') {
        endpoint = '/api/ram/team-members/create-order';
      } else if (activeForm === 'return') {
        endpoint = '/api/ram/team-members/create-return';
      } else if (activeForm === 'payment') {
        endpoint = '/api/ram/team-members/record-payment';
        payload.totalAmount = parseFloat(paymentAmount);
      }
      // include optional reason for returns
      if (activeForm === 'return') {
        payload.reason = returnReason || null;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data?.error) {
        alert(data.error);
      } else {
        // Show print bill modal
        setCreatedBill({
          id: data.id,
          items: formItems,
          totalAmount: calculateTotal(),
          timestamp: new Date()
        });
        setBillType(activeForm);
      }
    } catch (err) {
      console.error('Form submission failed:', err);
      alert('Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal and reset
  const closeModal = () => {
    setActiveForm(null);
    setFormItems([]);
    setPaymentAmount('');
    setBookSearchTerm('');
    setReturnReason('');
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
              <button 
                onClick={() => { setActiveForm('order'); setFormItems([]); setPaymentAmount(''); }}
                className="w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-medium transition shadow-md flex items-center justify-center gap-2"
              >
                📦 Create Order
              </button>
              <button 
                onClick={() => { setActiveForm('payment'); setFormItems([]); setPaymentAmount(''); }}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition shadow-md flex items-center justify-center gap-2"
              >
                💰 Record Payment
              </button>
              <button 
                onClick={() => { setActiveForm('return'); setFormItems([]); setPaymentAmount(''); }}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition shadow-md flex items-center justify-center gap-2"
              >
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
              <button onClick={() => { setActiveForm('order'); setFormItems([]); setPaymentAmount(''); }}
              className="flex-1 lg:flex-initial px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-medium transition shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                📦 Create Order
              </button>
              <button onClick={() => { setActiveForm('payment'); setFormItems([]); setPaymentAmount(''); }}
              className="flex-1 lg:flex-initial px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                💰 Record Payment
              </button>
              <button onClick={() => { setActiveForm('return'); setFormItems([]); setPaymentAmount(''); }}
              className="flex-1 lg:flex-initial px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition shadow-md hover:shadow-lg flex items-center justify-center gap-2">
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

                    {/* Orders List */}
                    {(searchedUser?.orders && searchedUser.orders.length > 0) ? (
                      <div className="space-y-3">
                        {searchedUser.orders.map((o: any) => (
                          <div key={o.id} className="bg-white p-4 rounded-lg shadow-sm flex items-start justify-between">
                            <div>
                              <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString('en-IN')}</div>
                              <div className="font-medium text-gray-900">Order #{o.id} • {o.status}</div>
                              <div className="text-sm text-gray-700 mt-2">
                                {o.items?.map((it: any, idx: number) => (
                                  <div key={idx} className="text-sm text-gray-600">{it.title || it.bookName} ({it.language}) — x{it.quantity ?? 0}</div>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <button
                                onClick={() => {
                                  // prepare print bill from server order
                                  const items = (o.items || []).map((it: any) => ({ bookId: it.bookId, bookName: it.title || it.bookName || '', language: it.language, quantity: it.quantity, price: Number(it.price) || 0 }));
                                  const total = items.reduce((s: number, it: any) => s + (Number(it.price) * (Number(it.quantity) || 0)), 0);
                                  setCreatedBill({ id: o.id, items, totalAmount: total, timestamp: o.createdAt });
                                  setBillType('order');
                                }}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                              >
                                Print
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FaTag size={32} className="mx-auto mb-2 text-gray-300" />
                        <p>No orders found for this distributor</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'payments' && (
                  <div>
                    {(searchedUser?.payments && searchedUser.payments.length > 0) ? (
                      <div className="space-y-3">
                        {searchedUser.payments.map((p: any) => (
                          <div key={p.id} className="bg-white p-4 rounded-lg shadow-sm flex items-start justify-between">
                            <div>
                              <div className="text-sm text-gray-600">{new Date(p.createdAt).toLocaleString('en-IN')}</div>
                              <div className="font-medium text-gray-900">Payment #{p.id} • {p.status}</div>
                              <div className="text-sm text-gray-700 mt-2">
                                {p.items?.map((it: any, idx: number) => (
                                  <div key={idx} className="text-sm text-gray-600">{it.title || it.bookName} ({it.language}) — x{it.quantity ?? 0}</div>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="font-medium">₹{(Number(p.totalAmount) || 0).toFixed(2)}</div>
                              <button
                                onClick={() => {
                                  const items = (p.items || []).map((it: any) => ({ bookId: it.bookId, bookName: it.title || it.bookName || '', language: it.language, quantity: it.quantity, price: Number(it.price) || 0 }));
                                  const computedTotal = items.reduce((s: number, it: any) => s + (Number(it.price) * (Number(it.quantity) || 0)), 0);
                                  setCreatedBill({ id: p.id, items, totalAmount: Number(p.totalAmount) || computedTotal, timestamp: p.createdAt });
                                  setBillType('payment');
                                }}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                              >
                                Print
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FaTag size={32} className="mx-auto mb-2 text-gray-300" />
                        <p>No payment records found for this distributor</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'returns' && (
                  <div>
                    {(searchedUser?.returns && searchedUser.returns.length > 0) ? (
                      <div className="space-y-3">
                        {searchedUser.returns.map((r: any) => (
                          <div key={r.id} className="bg-white p-4 rounded-lg shadow-sm flex items-start justify-between">
                            <div>
                              <div className="text-sm text-gray-600">{new Date(r.createdAt).toLocaleString('en-IN')}</div>
                              <div className="font-medium text-gray-900">Return #{r.id} • {r.status}</div>
                              {r.reason && <div className="text-sm text-gray-600 mt-1">Reason: {r.reason}</div>}
                              <div className="text-sm text-gray-700 mt-2">
                                {r.items?.map((it: any, idx: number) => (
                                  <div key={idx} className="text-sm text-gray-600">{it.title || it.bookName} ({it.language}) — x{it.quantity ?? 0}</div>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <button
                                onClick={() => {
                                  const items = (r.items || []).map((it: any) => ({ bookId: it.bookId, bookName: it.title || it.bookName || '', language: it.language, quantity: it.quantity, price: Number(it.price) || 0 }));
                                  const total = items.reduce((s: number, it: any) => s + (Number(it.price) * (Number(it.quantity) || 0)), 0);
                                  setCreatedBill({ id: r.id, items, totalAmount: total, timestamp: r.createdAt });
                                  setBillType('return');
                                }}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                              >
                                Print
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FaTag size={32} className="mx-auto mb-2 text-gray-300" />
                        <p>No return requests found for this distributor</p>
                      </div>
                    )}
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

        {/* ===== MODAL: Create Form (Order, Return, Payment) ===== */}
        {activeForm && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="bg-white w-full h-full max-w-full rounded-none shadow-xl overflow-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">
                  {activeForm === 'order' && `Create Order for ${searchedUser?.name}`}
                  {activeForm === 'return' && `Create Return for ${searchedUser?.name}`}
                  {activeForm === 'payment' && `Record Payment for ${searchedUser?.name}`}
                </h3>
                <button onClick={closeModal} className="p-1 hover:bg-pink-700 rounded transition">
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-6 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
                {/* Payment Amount (only for payment form) */}
                {activeForm === 'payment' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="Enter total amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                )}

                {/* Return reason (only for return form) */}
                {activeForm === 'return' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason (optional)</label>
                    <textarea
                      placeholder="Enter reason for return (optional)"
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      rows={3}
                    />
                  </div>
                )}

                {/* Book Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Book Name</label>
                  {(activeForm === 'payment' || activeForm === 'return') && (
                    <div className="text-xs text-gray-500 mb-2">Showing books from distributor's preorders minus already paid quantities. Select a book to add to this {activeForm}.</div>
                  )}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search book name..."
                      value={bookSearchTerm}
                      onChange={(e) => setBookSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    {/* Visible list of available books for this form */}
                    {(activeForm === 'payment' || activeForm === 'return' || activeForm === 'order') && books.length > 0 && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {books.map((b) => (
                          <div key={b.id} className="flex items-center justify-between p-2 border rounded bg-white">
                            <div>
                              <div className="font-medium text-sm">{b.name}</div>
                              <div className="text-xs text-gray-500">{b.language} • ₹{b.price}</div>
                              <div className="text-xs text-gray-600">Available: {Number((b as any).available) || 0}</div>
                            </div>
                            <div className="flex flex-col items-end">
                              <button
                                type="button"
                                onClick={() => handleAddItem(b.id)}
                                className="px-3 py-1 bg-pink-600 text-white rounded text-sm"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {bookSearchTerm && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                        {books
                          .filter(b => b.name.toLowerCase().includes(bookSearchTerm.toLowerCase()))
                          .map((book) => (
                            <button
                              key={book.id}
                              type="button"
                              onClick={() => {
                                handleAddItem(book.id);
                                setBookSearchTerm('');
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-pink-50 flex justify-between items-center"
                            >
                              <span>{book.name}</span>
                              <span className="text-sm text-gray-500">({book.language}) ₹{book.price}</span>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Items List */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                  {formItems.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No items added yet. Search and select books above.</p>
                  ) : (
                    <div className="space-y-2">
                      {formItems.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{item.bookName}</div>
                            <div className="text-sm text-gray-600">{item.language} • ₹{item.price} each</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity ?? ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === '') {
                                  setFormItems(prev => prev.map((p, i) => i === idx ? { ...p, quantity: undefined } : p));
                                  setInlineErrors(prev => ({ ...prev, [idx]: '' }));
                                  return;
                                }
                                let newQty = Math.max(1, parseInt(val) || 1);
                                const availableRem = getAvailableRemaining(item.bookId, idx);
                                if (newQty > availableRem) {
                                  newQty = availableRem;
                                  setInlineErrors(prev => ({ ...prev, [idx]: `Max available ${availableRem}` }));
                                } else {
                                  setInlineErrors(prev => ({ ...prev, [idx]: '' }));
                                }
                                setFormItems(prev => prev.map((p, i) => i === idx ? { ...p, quantity: newQty } : p));
                              }}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                            <span className="text-sm font-medium min-w-[60px] text-right">
                              ₹{(Number(item.price) * (Number(item.quantity) || 0)).toFixed(2)}
                            </span>
                            {inlineErrors[idx] && (
                              <div className="text-xs text-red-600 mt-1">{inlineErrors[idx]}</div>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total */}
                {formItems.length > 0 && (
                  <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Subtotal</span>
                          <span className="text-lg font-bold text-pink-600">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                    {activeForm === 'payment' && (
                      <div className="text-sm text-red-600 mt-2">
                        {Math.abs((Number(paymentAmount) || 0) - calculateTotal()) > 0.009 ? 'Payment amount does not match items total' : ''}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 p-4 flex gap-3 justify-end border-t">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFormSubmit}
                  disabled={isSubmitting || !formItems.length || (activeForm === 'payment' && Math.abs((Number(paymentAmount) || 0) - calculateTotal()) > 0.009) || Object.values(inlineErrors).some(v => v)}
                  className="px-6 py-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-lg font-medium transition flex items-center gap-2"
                >
                  {isSubmitting ? 'Processing...' : activeForm === 'payment' ? 'Record Payment' : activeForm === 'order' ? 'Create Order' : 'Create Return'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== MODAL: Print Bill ===== */}
        {createdBill && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="bg-white w-full h-full max-w-full rounded-none shadow-xl overflow-auto">
              <div className="p-6 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
                {/* Header with Logo */}
                <div className="text-center mb-6">
                  <img src="/iskcon-logo.png" alt="Logo" className="w-20 h-20 mx-auto mb-3" />
                  <div className="text-xl font-bold text-gray-900">Invoice</div>
                  <div className="text-sm text-gray-600">Bill ID: {createdBill.id}</div>
                </div>

                {/* Date & Time Info */}
                <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <div className="font-medium">{new Date(createdBill.timestamp).toLocaleDateString('en-IN')}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span>
                    <div className="font-medium">{new Date(createdBill.timestamp).toLocaleTimeString('en-IN')}</div>
                  </div>
                </div>

                {/* Store Owner Info */}
                <div className="border-t pt-4">
                  <div className="text-sm font-medium text-gray-700 mb-1">Store Owner</div>
                  <div className="text-gray-900 font-medium">{user?.name || 'N/A'}</div>
                </div>

                {/* Distributor Info */}
                <div className="border-t pt-4">
                  <div className="text-sm font-medium text-gray-700 mb-1">Distributor</div>
                  <div className="text-gray-900 font-medium">{searchedUser?.name}</div>
                  <div className="text-sm text-gray-600">📱 {searchedUser?.phone}</div>
                  {searchedUser?.captainName && (
                    <div className="text-sm text-gray-600 mt-1">Captain: {searchedUser.captainName}</div>
                  )}
                </div>

                {/* Bill Type */}
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <span className="font-medium text-blue-900">
                    {billType === 'order' && '📦 CREATE ORDER'}
                    {billType === 'return' && '🔄 RETURN REQUEST'}
                    {billType === 'payment' && '💰 PAYMENT RECORD'}
                  </span>
                </div>

                {/* Items Table */}
                <div className="border-t pt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-700 font-medium">Item</th>
                        <th className="text-center py-2 text-gray-700 font-medium">Qty</th>
                        <th className="text-right py-2 text-gray-700 font-medium">Price</th>
                        <th className="text-right py-2 text-gray-700 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {createdBill.items?.map((item: FormItem, idx: number) => (
                        <tr key={idx} className="border-b">
                          <td className="py-2">
                            <div className="font-medium text-gray-900">{item.bookName}</div>
                            <div className="text-xs text-gray-600">{item.language}</div>
                          </td>
                                <td className="py-2 text-center">{item.quantity ?? 0}</td>
                                  <td className="py-2 text-right">₹{(Number(item.price) || 0).toFixed(2)}</td>
                                  <td className="py-2 text-right font-medium">₹{(Number(item.price) * (Number(item.quantity) || 0)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total */}
                <div className="border-t pt-4 flex justify-end">
                  <div className="text-right">
                    <div className="text-gray-600 text-sm mb-2">Grand Total</div>
                    <div className="text-2xl font-bold text-pink-600">₹{(Number(createdBill.totalAmount) || 0).toFixed(2)}</div>
                  </div>
                </div>

                {/* Footer Text */}
                <div className="text-center text-xs text-gray-500 border-t pt-4">
                  <p>This is a system-generated bill. Please keep it for your records.</p>
                </div>
              </div>

              {/* Print & Done Buttons */}
              <div className="bg-gray-50 p-4 flex gap-3 justify-end border-t">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  🖨️ Print
                </button>
                <button
                  onClick={() => {
                    setCreatedBill(null);
                    closeModal();
                  }}
                  className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
