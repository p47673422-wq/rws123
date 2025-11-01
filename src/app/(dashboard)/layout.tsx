"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, BookOpen, Users, ShoppingCart, Settings, LogOut, Bell, Search, Menu, ChevronLeft, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../../components/ui/Avatar';

type NavItem = { id: string; label: string; href: string; icon: React.ReactNode };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // fetch current user
    (async () => {
      try {
        const res = await fetch('/api/ram/auth/me');
        if (!res.ok) return;
        const j = await res.json();
        if (j?.ok && j.user) {
          setUser(j.user);
          setUserType((j.user as any).role || (j.user as any).userType || null);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const commonNav: NavItem[] = [
    { id: 'home', label: 'Home', href: '/booking-home', icon: <Home size={18} /> },
    { id: 'books', label: 'Books', href: '/books', icon: <BookOpen size={18} /> },
  ];

  const distributorNav: NavItem[] = [
    { id: 'orders', label: 'Orders', href: '/distributor/orders', icon: <ShoppingCart size={18} /> },
    { id: 'team', label: 'Team', href: '/distributor/team', icon: <Users size={18} /> },
  ];

  const captainNav: NavItem[] = [
    { id: 'collections', label: 'Collections', href: '/captain/collections', icon: <ShoppingCart size={18} /> },
    { id: 'team', label: 'Team', href: '/captain/team', icon: <Users size={18} /> },
  ];

  const storeNav: NavItem[] = [
    { id: 'inventory', label: 'Inventory', href: '/store/inventory', icon: <BookOpen size={18} /> },
    { id: 'sales', label: 'Sales', href: '/store/sales', icon: <ShoppingCart size={18} /> },
  ];

  let nav: NavItem[] = commonNav;
  if (userType && userType.toUpperCase().includes('DISTRIBUTOR')) nav = [...nav, ...distributorNav];
  else if (userType && userType.toUpperCase().includes('CAPTAIN')) nav = [...nav, ...captainNav];
  else if (userType && (userType.toUpperCase().includes('VEC') || userType.toUpperCase().includes('STORE'))) nav = [...nav, ...storeNav];

  async function handleLogout() {
    try {
      await fetch('/api/ram/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    } finally {
      router.push('/auth/ram/login');
    }
  }

  return (
    <div className="min-h-screen antialiased bg-fixed bg-[linear-gradient(180deg,#FEF3C7_0%,#FFF7ED_30%,#F9A8D4_70%)]">
      <div className="min-h-screen flex">
        {/* Sidebar - desktop */}
        <div className={`hidden md:flex flex-col ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
          <motion.aside initial={{ x: -20 }} animate={{ x: 0 }} className="h-full flex flex-col bg-white/20 backdrop-blur glass p-4">
            <div className="flex items-center gap-3 px-2 py-3">
              <div className="w-10 h-10 rounded-full bg-krishna-blue flex items-center justify-center text-white font-bold">K</div>
              {!collapsed && <div className="text-lg font-semibold text-krishna-blue">MyKrishna</div>}
            </div>

            <nav className="flex-1 mt-6">
              {nav.map(item => {
                const active = pathname?.startsWith(item.href);
                return (
                  <Link key={item.id} href={item.href} className={`flex items-center gap-3 px-3 py-2 my-1 rounded-md ${active ? 'bg-krishna-blue/10 text-krishna-blue' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <div className="text-gray-600">{item.icon}</div>
                    {!collapsed && <div className="text-sm font-medium">{item.label}</div>}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto px-2">
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50">
                <Avatar src={user?.avatar} name={user?.name} />
                {!collapsed && (
                  <div className="flex-1">
                    <div className="text-sm font-medium">{user?.name || 'Guest'}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                )}
                {!collapsed && (
                  <button onClick={handleLogout} aria-label="Logout" className="text-red-600"><LogOut size={16} /></button>
                )}
              </div>

              <div className="mt-3 flex justify-center">
                <button onClick={() => setCollapsed(s=>!s)} className="p-2 rounded-full bg-white/30">
                  {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
                </button>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Main column */}
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <header className="w-full border-b bg-white/30 backdrop-blur sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 h-16">
              <div className="flex items-center gap-3">
                <button className="md:hidden p-2 rounded" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu /></button>
                <div className="relative">
                  <input aria-label="Search" placeholder="Search…" className="rounded-md px-3 py-2 border bg-white/60 focus:outline-none focus:ring-2" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="relative p-2 rounded hover:bg-gray-100" aria-label="Notifications">
                  <Bell />
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-krishna-saffron rounded-full">3</span>
                </button>

                <div className="hidden md:flex items-center gap-3">
                  <div className="text-sm text-gray-700">{user?.name}</div>
                  <Avatar src={user?.avatar} name={user?.name} />
                </div>
              </div>
            </div>
          </header>

          {/* Content area */}
          <main className="flex-1 w-full max-w-7xl mx-auto p-6">
            <div className="rounded-lg p-4 bg-white/40 glass">
              {children}
            </div>
          </main>

          {/* Mobile bottom nav */}
          <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 rounded-xl shadow-krishna-md px-4 py-2 flex items-center gap-4">
            <Link href="/booking-home" className="flex flex-col items-center text-sm"><Home size={18} /><span>Home</span></Link>
            <Link href="/books" className="flex flex-col items-center text-sm"><BookOpen size={18} /><span>Books</span></Link>
            <Link href="/cart" className="flex flex-col items-center text-sm"><ShoppingCart size={18} /><span>Cart</span></Link>
            <Link href="/profile" className="flex flex-col items-center text-sm"><User size={18} /><span>Me</span></Link>
          </nav>
        </div>
      </div>

      {/* Mobile slide-out menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring' }} className="fixed inset-0 z-50 bg-white/90 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-krishna-blue text-white flex items-center justify-center">K</div><div className="font-semibold">MyKrishna</div></div>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 rounded"><ChevronLeft /></button>
            </div>

            <div className="mt-6 space-y-2">
              {nav.map(i => <Link key={i.id} href={i.href} className="flex items-center gap-3 p-3 rounded hover:bg-gray-100" onClick={() => setMobileOpen(false)}>{i.icon}<span>{i.label}</span></Link>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
