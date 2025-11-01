"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Loader from '../../../components/ui/Loader';
import { ShoppingCart, CreditCard, MapPin, Book, Trophy, RefreshCw, Calendar } from 'lucide-react';

type Metrics = {
  pendingOrders: number;
  pendingPayments: number; // amount
  inventoryCount: number;
  score: { value: number; rank: number };
};

type Activity = { id: string; type: 'order' | 'payment'; title: string; time: string; status: string; amount?: number };

export default function DistributorDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // pull-to-refresh state
  const startY = useRef<number | null>(null);
  const pullRef = useRef<HTMLDivElement | null>(null);
  const [pullDistance, setPullDistance] = useState(0);

  async function fetchData() {
    setLoading(true);
    try {
      const mRes = await fetch('/api/ram/distributor/metrics');
      const aRes = await fetch('/api/ram/distributor/recent');

      if (mRes.ok && aRes.ok) {
        const mJson = await mRes.json();
        const aJson = await aRes.json();
        setMetrics(mJson as Metrics);
        setActivities(aJson as Activity[]);
      } else {
        // fallback demo data
        setMetrics({ pendingOrders: 12, pendingPayments: 4580, inventoryCount: 320, score: { value: 1240, rank: 7 } });
        setActivities([
          { id: '1', type: 'order', title: 'Order #1009', time: '2h ago', status: 'pending' },
          { id: '2', type: 'payment', title: 'Payment from Ramesh', time: '4h ago', status: 'received', amount: 1200 },
          { id: '3', type: 'order', title: 'Order #1008', time: '1d ago', status: 'packed' },
          { id: '4', type: 'payment', title: 'Payment from Sita', time: '2d ago', status: 'pending', amount: 700 },
          { id: '5', type: 'order', title: 'Order #1007', time: '3d ago', status: 'collected' },
        ]);
      }
    } catch (e) {
      setMetrics({ pendingOrders: 12, pendingPayments: 4580, inventoryCount: 320, score: { value: 1240, rank: 7 } });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchData();
    setTimeout(() => setRefreshing(false), 600);
  }

  // Pull to refresh handlers
  function onTouchStart(e: React.TouchEvent) {
    if (pullRef.current && pullRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setPullDistance(0);
    }
  }
  function onTouchMove(e: React.TouchEvent) {
    if (startY.current == null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) {
      e.preventDefault();
      setPullDistance(Math.min(delta, 120));
    }
  }
  function onTouchEnd() {
    if (pullDistance > 80) {
      handleRefresh();
    }
    startY.current = null;
    setPullDistance(0);
  }

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-krishna-cream via-white to-krishna-lotus">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-krishna-blue">Distributor Dashboard</h1>
          <div className="flex items-center gap-2">
            <button onClick={handleRefresh} aria-label="Refresh" className="p-2 rounded bg-white/70"><RefreshCw /></button>
            <div className="text-sm text-gray-600">{refreshing ? 'Refreshing…' : 'Updated recently'}</div>
          </div>
        </div>

        <div
          ref={pullRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="space-y-4"
        >
          <div style={{ transform: `translateY(${pullDistance * 0.3}px)` }} className="transition-transform">
            <motion.div initial="hidden" animate="show" variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Metric cards */}
              <motion.div variants={itemVariants}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Pending Orders</div>
                      <div className="text-2xl font-bold text-krishna-blue">{loading ? <Loader size={28} /> : metrics?.pendingOrders}</div>
                    </div>
                    <div className="bg-krishna-saffron/20 p-2 rounded-md"><ShoppingCart /></div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Pending Payments</div>
                      <div className="text-2xl font-bold text-krishna-blue">{loading ? <Loader size={28} /> : `₹ ${metrics?.pendingPayments}`}</div>
                    </div>
                    <div className="bg-krishna-lotus/20 p-2 rounded-md"><CreditCard /></div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Current Inventory</div>
                      <div className="text-2xl font-bold text-krishna-blue">{loading ? <Loader size={28} /> : metrics?.inventoryCount}</div>
                    </div>
                    <div className="bg-krishna-gold/20 p-2 rounded-md"><Book /></div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Score</div>
                      <div className="text-2xl font-bold text-krishna-blue">{loading ? <Loader size={28} /> : metrics?.score.value} <span className="text-sm text-gray-500">(#{metrics?.score.rank})</span></div>
                    </div>
                    <div className="bg-krishna-blue/10 p-2 rounded-md"><Trophy /></div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            {/* Quick actions */}
            <motion.div className="mt-4" initial="hidden" animate="show" variants={containerVariants}>
              <motion.h2 variants={itemVariants} className="text-lg font-semibold mb-2">Quick actions</motion.h2>
              <div className="grid grid-cols-2 gap-3">
                <motion.div variants={itemVariants}><Button className="w-full py-4"><ShoppingCart /> <span className="ml-2">Create Pre-Order</span></Button></motion.div>
                <motion.div variants={itemVariants}><Button variant="secondary" className="w-full py-4"><CreditCard /> <span className="ml-2">Record Payment</span></Button></motion.div>
                <motion.div variants={itemVariants}><Button variant="ghost" className="w-full py-4"><MapPin /> <span className="ml-2">Book Venue</span></Button></motion.div>
                <motion.div variants={itemVariants}><Button variant="ghost" className="w-full py-4"><Book /> <span className="ml-2">Add Note</span></Button></motion.div>
              </div>
            </motion.div>

            {/* Recent activity feed */}
            <motion.div className="mt-6" initial="hidden" animate="show" variants={containerVariants}>
              <motion.h2 variants={itemVariants} className="text-lg font-semibold mb-2">Recent activity</motion.h2>

              <div className="space-y-2">
                {loading && <div className="p-4 bg-white rounded-md flex items-center justify-center"><Loader /></div>}
                {!loading && activities.map(a => (
                  <motion.div key={a.id} variants={itemVariants} className="p-3 bg-white rounded-md flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{a.title}</div>
                      <div className="text-xs text-gray-500">{a.time} • {a.type === 'payment' ? `₹ ${a.amount ?? 0}` : a.status}</div>
                    </div>
                    <div>
                      <Badge status={a.status}>{a.status}</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
