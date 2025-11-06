"use client";
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { PaymentStatus_Z } from '@prisma/client';

interface IPaymentRequest {
  id: string;
  dates: Date[];
  items: any[];
  totalAmount: number;
  paymentImageUrl?: string;
  status: PaymentStatus_Z;
  notes?: string;
  createdAt: Date;
  rejectionReason?: string;
  distributor: {
    id: string;
    email: string;
    name: string;
    userType: string;
  };
}

export default function PaymentsPage() {
  const [user, setUser] = useState<any>(null);
  const [payments, setPayments] = useState<IPaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  
  // Filters and sorting
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterEmail, setFilterEmail] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [groupBy, setGroupBy] = useState<'none' | 'status' | 'user'>('none');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [showRejectionModal, setShowRejectionModal] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user data
    fetch('/api/ram/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d?.user) setUser(d.user);
      });

    // Fetch payments for the store type
    fetch('/api/ram/payments/store-payments')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setPayments(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleVerify = async (paymentId: string) => {
    try {
      const res = await fetch('/api/ram/payments/verify-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentId,
          status: 'VERIFIED'
        })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Update payment in the list
      setPayments(prevPayments => 
        prevPayments.map(p => p.id === paymentId ? { ...p, status: 'VERIFIED' } : p)
      );
    } catch (err: any) {
      alert(err.message || 'Failed to verify payment');
    }
  };

  const handleReject = async (paymentId: string) => {
    if (!rejectionReason) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      const res = await fetch('/api/ram/payments/verify-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentId,
          status: 'REJECTED',
          rejectionReason
        })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Update payment in the list
      setPayments(prevPayments => 
        prevPayments.map(p => p.id === paymentId ? 
          { ...p, status: 'REJECTED', rejectionReason } : p
        )
      );
      setShowRejectionModal(null);
      setRejectionReason('');
    } catch (err: any) {
      alert(err.message || 'Failed to reject payment');
    }
  };

  const toggleExpand = (paymentId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(paymentId)) {
        newSet.delete(paymentId);
      } else {
        newSet.add(paymentId);
      }
      return newSet;
    });
  };

  // Filter and sort payments
  const processedPayments = React.useMemo(() => {
    let filtered = [...payments];
    
    // Apply filters
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }
    if (filterEmail) {
      const searchTerm = filterEmail.toLowerCase();
      filtered = filtered.filter(p => 
        p.distributor.email.toLowerCase().includes(searchTerm) ||
        p.distributor.name.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = sortBy === 'date' ? new Date(a.createdAt).getTime() :
                   sortBy === 'amount' ? Number(a.totalAmount) :
                   sortBy === 'email' ? a.distributor.email :
                   a.status;
      let bValue = sortBy === 'date' ? new Date(b.createdAt).getTime() :
                   sortBy === 'amount' ? Number(b.totalAmount) :
                   sortBy === 'email' ? b.distributor.email :
                   b.status;

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Apply grouping
    if (groupBy !== 'none') {
      const groups: Record<string, IPaymentRequest[]> = {};
      filtered.forEach(payment => {
        const key = groupBy === 'status' ? payment.status : payment.distributor.email;
        if (!groups[key]) groups[key] = [];
        groups[key].push(payment);
      });
      return { grouped: true, groups };
    }

    return { grouped: false, payments: filtered };
  }, [payments, filterStatus, filterEmail, sortBy, sortOrder, groupBy]);

  if (!user) return <div>Loading...</div>;
  if (!['VEC_STORE_OWNER', 'STORE_OWNER'].includes(user.userType)) {
    return <div className="p-6">You don't have permission to view this page.</div>;
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-pink-700">Store Payments</h1>
          
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search by email or name"
              value={filterEmail}
              onChange={e => setFilterEmail(e.target.value)}
              className="border rounded px-3 py-1"
            />
            
            <select 
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <select 
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="email">Sort by Email</option>
              <option value="status">Sort by Status</option>
            </select>

            <select 
              value={groupBy}
              onChange={e => setGroupBy(e.target.value as 'none' | 'status' | 'user')}
              className="border rounded px-2 py-1"
            >
              <option value="none">No Grouping</option>
              <option value="status">Group by Status</option>
              <option value="user">Group by User</option>
            </select>

            <button 
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="border rounded px-3 py-1 flex items-center gap-1"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading payments...</div>
        ) : (
          <div className="space-y-4">
            {processedPayments.grouped ? (
              Object.entries(processedPayments.groups ?? {}).map(([group, groupPayments]) => (
                <div key={group} className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-700">{group}</h2>
                  <div className="grid gap-4">
                    {groupPayments.map(payment => (
                      /* Payment card component */
                      <PaymentCard
                        key={payment.id}
                        payment={payment}
                        isExpanded={expandedCards.has(payment.id)}
                        onToggle={() => toggleExpand(payment.id)}
                        onVerify={() => handleVerify(payment.id)}
                        onReject={() => setShowRejectionModal(payment.id)}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="grid gap-4">
                {(processedPayments.payments ?? []).map(payment => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                    isExpanded={expandedCards.has(payment.id)}
                    onToggle={() => toggleExpand(payment.id)}
                    onVerify={() => handleVerify(payment.id)}
                    onReject={() => setShowRejectionModal(payment.id)}
                  />
                ))}
              </div>
            )}

            {payments.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <p className="text-gray-600">No payment requests found</p>
              </div>
            )}
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Rejection Reason</h3>
              <textarea
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                className="w-full border rounded p-2 mb-4"
                rows={3}
                placeholder="Enter reason for rejection..."
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRejectionModal(null);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(showRejectionModal)}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function PaymentCard({ 
  payment, 
  isExpanded, 
  onToggle,
  onVerify,
  onReject 
}: { 
  payment: IPaymentRequest; 
  isExpanded: boolean;
  onToggle: () => void;
  onVerify: () => void;
  onReject: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onToggle} className="text-gray-500">
            {isExpanded ? '▼' : '▶'}
          </button>
          <div>
            <h3 className="font-semibold">Payment Request #{payment.id}</h3>
            <p className="text-sm text-gray-600">{payment.distributor.name} ({payment.distributor.email})</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded-full text-sm ${
            payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
            payment.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
            payment.status === 'VERIFIED' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>{payment.status}</span>
          {payment.status === 'PENDING' && (
            <div className="flex gap-2">
              <button
                onClick={onVerify}
                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm"
              >
                Verify
              </button>
              <button
                onClick={onReject}
                className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 mt-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="text-lg">₹{payment.totalAmount}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Submitted on: {new Date(payment.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Dates Included:</h4>
            <div className="flex flex-wrap gap-2">
              {payment.dates.map((date: string, idx: number) => (
                <span key={idx} className="bg-pink-50 px-2 py-1 rounded text-sm">
                  {new Date(date).toLocaleDateString()}
                </span>
              ))}
            </div>
          </div> */}

          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Books:</h4>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {payment.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                  <span>{item.title} ({item.language})</span>
                  <span>Qty: {item.quantity} × ₹{item.price} = ₹{item.quantity * item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {payment.paymentImageUrl && (
            <div>
              <h4 className="font-medium text-gray-700">Payment Screenshot:</h4>
              <img 
                src={payment.paymentImageUrl} 
                alt="Payment Screenshot" 
                className="mt-2 max-h-60 rounded border cursor-pointer hover:opacity-90"
                onClick={() => window.open(payment.paymentImageUrl, '_blank')}
              />
            </div>
          )}

          {payment.notes && (
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <h4 className="font-medium text-gray-700">Notes:</h4>
              <p className="mt-1 text-gray-600">{payment.notes}</p>
            </div>
          )}

          {payment.status === 'REJECTED' && payment.rejectionReason && (
            <div className="bg-red-50 p-3 rounded-lg text-sm">
              <h4 className="font-medium text-red-800">Rejection Reason:</h4>
              <p className="mt-1 text-red-600">{payment.rejectionReason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}