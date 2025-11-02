"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/ram/auth/me').then(r=>r.json()).then(d=>{
      if (!d.user) router.push('/auth/ram/login');
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

  return (
    <DashboardLayout user={user}>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-pink-700 mb-4">Welcome, {user.name}!</h1>
        <p className="text-gray-600">Select an option from the menu to get started.</p>
      </div>
    </DashboardLayout>
  );
}
