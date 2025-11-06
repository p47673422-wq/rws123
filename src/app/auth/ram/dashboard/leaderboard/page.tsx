"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaTrophy } from "react-icons/fa";

interface DistributorScore {
  distributor: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  totalScore: number;
  categoryBreakdown: {
    category: string;
    totalAmount: number;
  }[];
  yesterdayPayments: {
    total: number;
    breakdown: {
      category: string;
      totalAmount: number;
    }[];
  };
}

export default function LeaderboardPage() {
    const [user, setUser] = useState<any>(null);
      const router = useRouter();
  const [leaderboardData, setLeaderboardData] = useState<DistributorScore[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rankView, setRankView] = useState<'overall' | 'yesterday'>('overall');

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch("/api/ram/leaderboard");
      if (!response.ok) throw new Error("Failed to fetch leaderboard data");
      const data = await response.json();
      setLeaderboardData(data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load leaderboard data");
      setIsLoading(false);
    }
  };

  const getTrophyColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-500"; // Gold
      case 1:
        return "text-gray-400"; // Silver
      case 2:
        return "text-amber-600"; // Bronze
      default:
        return "text-gray-300"; // Other positions
    }
  };
  useEffect(() => {
      fetch('/api/ram/auth/me').then(r => r.json()).then(d => {
        if (!d?.user) router.push('/auth/ram/login');
        else {
          setUser(d.user);
        }
      });
    }, []);
  
    if (!user) return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-50 to-white">
        <div className="text-xl text-pink-700 font-bold">Loading...</div>
      </div>
    );

  

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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <DashboardLayout user={user}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-pink-700">Distributor Leaderboard</h1>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => setRankView('overall')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                rankView === 'overall'
                  ? 'bg-pink-600 text-white'
                  : 'bg-yellow-50 text-pink-700 hover:bg-yellow-100'
              }`}
            >
              Overall Ranking
            </button>
            <button
              onClick={() => setRankView('yesterday')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                rankView === 'yesterday'
                  ? 'bg-pink-600 text-white'
                  : 'bg-yellow-50 text-pink-700 hover:bg-yellow-100'
              }`}
            >
              Yesterday's Ranking
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Main Rankings Panel */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {rankView === 'overall' ? 'Overall Rankings' : 'Yesterday\'s Rankings'}
            </h2>
            <div className="space-y-4">
              {(rankView === 'overall' 
                ? leaderboardData
                : [...leaderboardData].sort((a, b) => b.yesterdayPayments.total - a.yesterdayPayments.total)
              ).map((item, index) => (
                <div key={item.distributor.id} className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-yellow-50 rounded-lg p-4 cursor-pointer hover:bg-yellow-100 transition-colors"
                    onClick={() => setExpandedId(expandedId === item.distributor.id ? null : item.distributor.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8">
                          <FaTrophy className={getTrophyColor(index)} size={24} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{item.distributor.name}</h3>
                          <p className="text-sm text-gray-600">{item.distributor.phone}</p>
                        </div>
                      </div>
                        <div className="text-right">
                          <p className="font-bold text-pink-700">
                            {rankView === 'overall' 
                              ? formatAmount(item.totalScore)
                              : formatAmount(item.yesterdayPayments.total)
                            }
                          </p>
                          {expandedId === item.distributor.id ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                    </div>

                    <AnimatePresence>
                      {expandedId === item.distributor.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 space-y-3 overflow-hidden"
                        >
                            <div className="bg-white rounded-lg p-4 space-y-3">
                              <h4 className="font-medium text-gray-800">Category Breakdown</h4>
                              {(rankView === 'overall' ? item.categoryBreakdown : item.yesterdayPayments.breakdown).map((cat) => (
                              <div key={cat.category} className="flex justify-between text-sm">
                                <span className="text-gray-600">{cat.category}</span>
                                <span className="font-medium text-gray-900">
                                  {formatAmount(cat.totalAmount)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Yesterday's Performance */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Yesterday's Performance</h2>
            <div className="space-y-4">
              {leaderboardData
                .sort((a, b) => b.yesterdayPayments.total - a.yesterdayPayments.total)
                .map((item, index) => (
                  <div key={item.distributor.id} className="relative">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-yellow-50 rounded-lg p-4 cursor-pointer hover:bg-yellow-100 transition-colors"
                      onClick={() => setExpandedId(expandedId === `yesterday-${item.distributor.id}` ? null : `yesterday-${item.distributor.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8">
                            <FaTrophy className={getTrophyColor(index)} size={24} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{item.distributor.name}</h3>
                            <p className="text-sm text-gray-600">{item.distributor.phone}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-pink-700">
                            {formatAmount(item.yesterdayPayments.total)}
                          </p>
                          {expandedId === `yesterday-${item.distributor.id}` ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedId === `yesterday-${item.distributor.id}` && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 space-y-3 overflow-hidden"
                          >
                            <div className="bg-white rounded-lg p-4 space-y-3">
                              <h4 className="font-medium text-gray-800">Category Breakdown</h4>
                              {item.yesterdayPayments.breakdown.map((cat) => (
                                <div key={cat.category} className="flex justify-between text-sm">
                                  <span className="text-gray-600">{cat.category}</span>
                                  <span className="font-medium text-gray-900">
                                    {formatAmount(cat.totalAmount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}