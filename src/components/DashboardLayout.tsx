"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaHome, FaBox, FaUsers, FaTrophy, FaChartLine, FaClipboardCheck, 
         FaExchangeAlt, FaWarehouse, FaHandshake, FaBars, FaBell, FaBook, 
         FaUserFriends } from 'react-icons/fa';

// Menu configurations for different user types
const MENU_CONFIG = {
  STORE_OWNER: [
    { icon: FaHome, label: 'Home', href: '/auth/ram/dashboard' },
    { icon: FaBox, label: 'Orders & Returns', href: '/auth/ram/dashboard/orders' },
    { icon: FaClipboardCheck, label: 'Payment Verification', href: '/auth/ram/dashboard/payments' },
    { icon: FaWarehouse, label: 'Book & Inventory', href: '/auth/ram/dashboard/inventory' },
    { icon: FaUsers, label: 'Distributor Management', href: '/auth/ram/dashboard/distributors' },
    { icon: FaTrophy, label: 'Leaderboard', href: '/auth/ram/dashboard/leaderboard' }
  ],
  VEC_STORE_OWNER: [
    { icon: FaHome, label: 'Home', href: '/auth/ram/dashboard' },
    { icon: FaBox, label: 'Orders & Returns', href: '/auth/ram/dashboard/orders' },
    { icon: FaClipboardCheck, label: 'Payment Verification', href: '/auth/ram/dashboard/payments' },
    { icon: FaWarehouse, label: 'Book & Inventory', href: '/auth/ram/dashboard/inventory' },
    { icon: FaUsers, label: 'Distributor Management', href: '/auth/ram/dashboard/distributors' },
    { icon: FaTrophy, label: 'Leaderboard', href: '/auth/ram/dashboard/leaderboard' }
  ],
  DISTRIBUTOR: [
    { icon: FaHome, label: 'Home', href: '/auth/ram/dashboard' },
    { icon: FaWarehouse, label: 'My Inventory', href: '/auth/ram/dashboard/my-inventory' },
    { icon: FaHandshake, label: 'Customer & Sales', href: '/auth/ram/dashboard/sales' },
    { icon: FaTrophy, label: 'Leaderboard', href: '/auth/ram/dashboard/leaderboard' }
  ],
  CAPTAIN: [
    { icon: FaHome, label: 'Home', href: '/auth/ram/dashboard' },
    { icon: FaUsers, label: 'Distributor Management', href: '/auth/ram/dashboard/team' },
    { icon: FaChartLine, label: 'Team Score', href: '/auth/ram/dashboard/team-score' },
    { icon: FaTrophy, label: 'Leaderboard', href: '/auth/ram/dashboard/leaderboard' }
  ]
};

const QUOTES = [
  "Books are the basis, purity is the force, preaching is the essence, utility is the principle. - Srila Prabhupada",
  "Distribution of books is our most important activity. The temple is not for sleeping and eating, but as a base from which we send out our soldiers to fight with maya. - Srila Prabhupada",
  "If you feel at all indebted to me, then you should preach vigorously like me. - Srila Prabhupada",
  "Your duty is to somehow or other distribute books. That is real preaching. - Srila Prabhupada"
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: any;
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewAs, setViewAs] = useState<'CAPTAIN' | 'DISTRIBUTOR' | null>(null);
  const [quote, setQuote] = useState('');
  const pathname = usePathname();
  const [showTeam, setShowTeam] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    // Set home tab as active by default
    if (pathname === '/auth/ram/dashboard') {
      const defaultPath = MENU_CONFIG[user.userType as keyof typeof MENU_CONFIG]?.[0]?.href;
      if (defaultPath && pathname !== defaultPath) {
        window.location.href = defaultPath;
      }
    }
    
    // Random quote
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    // Set initial view for captain
    if (user.userType === 'CAPTAIN') setViewAs('CAPTAIN');
  }, []);

  const activeMenu = viewAs || user.userType;
  const menuItems = MENU_CONFIG[activeMenu as keyof typeof MENU_CONFIG] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-white flex">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-white shadow-lg transition-all duration-300 border-r border-yellow-100 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4 flex items-center justify-between border-b border-yellow-100">
          {!sidebarCollapsed && <Image src="/iskcon-logo.png" alt="ISKCON Logo" width={120} height={60} className="rounded" />}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 rounded-lg hover:bg-yellow-50">
            <FaBars className="text-pink-700" />
          </button>
        </div>
        <nav className="flex-1 py-4">
          {menuItems.map((item, i) => (
            <Link 
              key={i} 
              href={item.href} 
              className={`flex items-center px-4 py-3 ${
                pathname === item.href ? 'bg-yellow-50 text-pink-700' : 'text-gray-600 hover:bg-yellow-50/50'
              }`}
            >
              <item.icon className={`text-xl ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-yellow-100">
            <div className="text-sm text-gray-500 italic">{quote}</div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-md border-b border-yellow-100 px-4 h-16 flex items-center justify-between relative">
          <div className="md:hidden">
            <Image src="/iskcon-logo.png" alt="ISKCON Logo" width={100} height={50} className="rounded" />
          </div>
          <div className="flex items-center gap-4">
            {/* Store Owner Team Button */}
            {(user.userType === 'STORE_OWNER' || user.userType === 'VEC_STORE_OWNER') && (
              <button
                onClick={() => setShowTeam(!showTeam)}
                className="px-3 py-1.5 rounded-lg bg-yellow-50 text-sm font-medium text-pink-700 hover:bg-yellow-100 flex items-center gap-2"
              >
                <FaUserFriends />
                My Team
              </button>
            )}
            
            {/* Captain View Switcher */}
            {user.userType === 'CAPTAIN' && (
              <button
                onClick={() => setViewAs(viewAs === 'CAPTAIN' ? 'DISTRIBUTOR' : 'CAPTAIN')}
                className="px-3 py-1.5 rounded-lg bg-yellow-50 text-sm font-medium text-pink-700 hover:bg-yellow-100 flex items-center gap-2"
              >
                <FaExchangeAlt />
                Switch to {viewAs === 'CAPTAIN' ? 'Distributor' : 'Captain'} View
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-yellow-50 relative"
              >
                <FaBell className="text-xl text-pink-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-yellow-100 z-50">
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-pink-700 mb-2">Notifications</h3>
                    {/* Notification content will go here */}
                  </div>
                </div>
              )}
            </div>

            {/* Notebook */}
            <div className="relative">
              <button 
                onClick={() => setShowNotes(!showNotes)}
                className="p-2 rounded-lg hover:bg-yellow-50"
              >
                <FaBook className="text-xl text-pink-700" />
              </button>
              {showNotes && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-yellow-100 z-50">
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-pink-700 mb-2">Notes</h3>
                    {/* Notes content will go here */}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-yellow-400 flex items-center justify-center text-white font-bold">
              {user.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden flex items-center justify-around bg-white border-t border-yellow-100 h-16">
          {menuItems.map((item, i) => (
            <Link 
              key={i} 
              href={item.href} 
              className={`flex flex-col items-center justify-center flex-1 py-1 ${
                pathname === item.href ? 'text-pink-700' : 'text-gray-400'
              }`}
            >
              <item.icon className="text-xl mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}