"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface Book {
  bookId: string;
  title: string;
  language: string;
  quantity: number;
  price: number;
}

interface CategoryBreakdown {
  category: string;
  amount: number;
  books: Book[];
}

interface DistributorScore {
  distributor: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  totalScore: number;
  categoryBreakdown: CategoryBreakdown[];
}

export default function LeaderboardPage() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const [leaderboardData, setLeaderboardData] = useState<DistributorScore[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    useEffect(() => {
      fetch('/api/ram/auth/me').then(r => r.json()).then(d => {
        if (!d?.user) router.push('/auth/ram/login');
        else {
          setUser(d.user);
        }
      });
    }, []);

    // Set default date range (last 30 days)
    useEffect(() => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      setStartDate(formatDate(start));
      setEndDate(formatDate(end));
    }, []);

    useEffect(() => {
      if (startDate && endDate) {
        fetchLeaderboardData();
      }
    }, [startDate, endDate]);

    const fetchLeaderboardData = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        const response = await fetch(`/api/ram/leaderboard?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch leaderboard data");
        const data = await response.json();
        setLeaderboardData(data);
        setError(null);
      } catch (err) {
        setError("Failed to load leaderboard data");
      } finally {
        setIsLoading(false);
      }
    };
  
    if (!user) return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-50 to-white">
        <div className="text-xl text-pink-700 font-bold">Loading...</div>
      </div>
    );

    const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-700"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout user={user}>
        <div className="text-center text-red-600">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-pink-700 mb-6">Distributor Leaderboard</h1>
          
          {/* Date Range Filter */}
          <div className="bg-white rounded-lg shadow-md p-4 flex gap-4 items-end flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <button
              onClick={() => fetchLeaderboardData()}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Update
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-pink-100 sticky top-0">
                <tr>
                  <th className="px-3 py-3 md:px-6 md:py-4 text-left text-sm font-semibold text-pink-900 w-12">Rank</th>
                  <th className="px-3 py-3 md:px-6 md:py-4 text-left text-sm font-semibold text-pink-900">Distributor Name</th>
                  <th className="px-3 py-3 md:px-6 md:py-4 text-left text-sm font-semibold text-pink-900">Phone</th>
                  <th className="px-3 py-3 md:px-6 md:py-4 text-right text-sm font-semibold text-pink-900">Points (Total Amount)</th>
                  <th className="px-3 py-3 md:px-6 md:py-4 text-center text-sm font-semibold text-pink-900 w-12">Details</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((item, index) => (
                  <motion.tr
                    key={item.distributor.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-yellow-50 transition-colors"
                  >
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm font-semibold text-pink-700">#{index + 1}</td>
                      <td className="px-3 py-3 md:px-6 md:py-4 text-sm font-medium text-gray-900">{item.distributor.name}</td>
                      <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-gray-600">{item.distributor.phone}</td>
                      <td className="px-3 py-3 md:px-6 md:py-4 text-sm font-bold text-pink-700 text-right">
                      {formatAmount(item.totalScore)}
                    </td>
                      <td className="px-3 py-3 md:px-6 md:py-4 text-center">
                      <button
                        onClick={() => setExpandedId(expandedId === item.distributor.id ? null : item.distributor.id)}
                        className="p-1 hover:bg-yellow-100 rounded transition-colors"
                      >
                        {expandedId === item.distributor.id ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expandable Category Breakdown */}
          <AnimatePresence>
            {expandedId && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-yellow-50 border-t border-yellow-200 overflow-hidden"
              >
                {(() => {
                  const expanded = leaderboardData.find(item => item.distributor.id === expandedId);
                  if (!expanded) return null;
                  
                  return (
                    <div className="px-3 py-4 md:px-6 max-w-4xl">
                      <h3 className="text-lg font-semibold text-pink-700 mb-4">
                        {expanded.distributor.name} - Category Breakdown
                      </h3>
                      <div className="space-y-4">
                        {expanded.categoryBreakdown.map((cat) => (
                          <div key={cat.category} className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-sm font-semibold text-gray-800">{cat.category}</h4>
                              <span className="text-sm font-bold text-pink-700">
                                {formatAmount(cat.amount)}
                              </span>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs min-w-[520px]">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-gray-600">Book Title</th>
                                    <th className="px-3 py-2 text-left text-gray-600">Language</th>
                                    <th className="px-3 py-2 text-center text-gray-600">Qty</th>
                                    <th className="px-3 py-2 text-right text-gray-600">Price</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {cat.books.map((book) => (
                                    <tr key={book.bookId} className="border-b">
                                      <td className="px-3 py-2 text-gray-700">{book.title}</td>
                                      <td className="px-3 py-2 text-gray-600">{book.language}</td>
                                      <td className="px-3 py-2 text-center text-gray-700">{book.quantity}</td>
                                      <td className="px-3 py-2 text-right text-gray-700">
                                        {formatAmount(book.price)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {leaderboardData.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No data available for the selected date range.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}