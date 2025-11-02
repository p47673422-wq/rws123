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
  const [notes, setNotes] = useState<any[]>([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteType, setNoteType] = useState<'FOLLOWUP' | 'FREEFLOW'>('FREEFLOW');
  const [showProfile, setShowProfile] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/ram/notes');
const responseBody = await res.json();

// 💡 Assume the array is under the 'notes' key
const notesArray = responseBody.notes;


if (Array.isArray(notesArray)) {
  setNotes(notesArray.sort((a: any, b: any) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ));
} else {

  setNotes(notesArray); // Fallback to whatever was returned
}
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // Fetch team members for store owners
  const fetchTeamMembers = async () => {
    if (user.userType === 'STORE_OWNER' || user.userType === 'VEC_STORE_OWNER') {
      try {
        const res = await fetch('/api/ram/team-members');
        const data = await res.json();
        setTeamMembers(data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    }
  };

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

    // Fetch initial data
    fetchNotes();
    fetchTeamMembers();
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
              <div className="relative">
                <button
                  onClick={() => setShowTeam(!showTeam)}
                  className="px-3 py-1.5 rounded-lg bg-yellow-50 text-sm font-medium text-pink-700 hover:bg-yellow-100 flex items-center gap-2"
                >
                  <FaUserFriends />
                  My Team
                </button>

                {/* Team Members Dropdown */}
                {showTeam && (
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-yellow-100 z-50 max-h-[60vh]">
                    <div className="p-4 border-b border-yellow-100">
                      <h3 className="text-lg font-bold text-pink-700">Team Members</h3>
                    </div>
                    
                    <div className="overflow-y-auto p-4 space-y-4">
                      {teamMembers.map((member: any) => (
                        <div key={member.id} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-pink-700 font-medium">{member.name[0]}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{member.name}</h4>
                            <p className="text-sm text-gray-600">{member.phone}</p>
                            <p className="text-sm text-gray-600">{member.email}</p>
                            <span className="text-xs font-medium px-2 py-1 rounded bg-pink-100 text-pink-700 mt-2 inline-block">
                              {member.userType}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-yellow-100 z-50 max-h-[80vh] flex flex-col">
                  <div className="p-4 border-b border-yellow-100">
                    <h3 className="text-lg font-bold text-pink-700">Notes</h3>
                  </div>
                  
                  {/* Notes List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {/* 💡 Conditional Check for Empty Array */}
    {notes?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gray-50 rounded-lg shadow-inner">
            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-3-3v6m-4 5h8a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <p className="text-lg font-semibold text-gray-600 mb-2">You don't have any notes.</p>
            <p className="text-sm text-gray-500">To add a note, click on the **Add Note** button.</p>
        </div>
    ) : (
        /* Original mapping of notes */
        notes.map((note: any) => (
            <div key={note.id} className="bg-yellow-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-medium px-2 py-1 rounded bg-pink-100 text-pink-700">
                        {note.noteType}
                    </span>
                    <span className="text-xs text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <p className="text-sm text-gray-700">{note.content}</p>
                {note.noteType === 'FOLLOWUP' && (
                    <div className="text-xs text-gray-600">
                        <p>Follow up with: {note.followUpPerson}</p>
                        <p>Due: {new Date(note.followUpDate).toLocaleDateString()}</p>
                    </div>
                )}
                {note.reminderSet && !note.reminderSent && (
                    <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        Reminder set for: {new Date(note.dueDate).toLocaleDateString()}
                    </div>
                )}
            </div>
        ))
    )}
</div>
                  {/* Add Note Button - Sticky */}
                  <div className="p-4 border-t border-yellow-100 sticky bottom-0 bg-white">
                    <button
                      onClick={() => setShowAddNote(true)}
                      className="w-full py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      Add New Note
                    </button>
                  </div>
                </div>
              )}
              
              {/* Add Note Modal */}
              {showAddNote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 w-full max-w-md">
                    <h3 className="text-xl font-bold text-pink-700 mb-4">Add New Note</h3>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const data = {
                        noteType,
                        content: formData.get('content'),
                        followUpPerson: formData.get('followUpPerson'),
                        followUpDate: formData.get('followUpDate'),
                        reminderSet: formData.get('reminderSet') === 'true',
                        dueDate: formData.get('dueDate'),
                      };
                      
                      try {
                        await fetch('/api/ram/notes', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(data),
                        });
                        await fetchNotes();
                        setShowAddNote(false);
                      } catch (error) {
                        console.error('Error saving note:', error);
                      }
                    }}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Note Type
                          </label>
                          <select
                            className="w-full rounded-lg border-gray-300"
                            value={noteType}
                            onChange={(e) => setNoteType(e.target.value as 'FOLLOWUP' | 'FREEFLOW')}
                          >
                            <option value="FREEFLOW">Free Flow</option>
                            <option value="FOLLOWUP">Follow Up</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                          </label>
                          <textarea
                            name="content"
                            required
                            className="w-full rounded-lg border-gray-300"
                            rows={4}
                          />
                        </div>

                        {noteType === 'FOLLOWUP' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Follow Up Person
                              </label>
                              <input
                                type="text"
                                name="followUpPerson"
                                required
                                className="w-full rounded-lg border-gray-300"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Follow Up Date
                              </label>
                              <input
                                type="date"
                                name="followUpDate"
                                required
                                className="w-full rounded-lg border-gray-300"
                              />
                            </div>
                          </>
                        )}

                        <div>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              name="reminderSet"
                              value="true"
                              className="rounded border-gray-300 text-pink-600"
                            />
                            <span className="text-sm text-gray-700">Set Reminder</span>
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Due Date
                          </label>
                          <input
                            type="date"
                            name="dueDate"
                            className="w-full rounded-lg border-gray-300"
                          />
                        </div>

                        <div className="flex space-x-3">
                          <button
                            type="submit"
                            className="flex-1 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                          >
                            Save Note
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddNote(false)}
                            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar and Profile */}
            <div className="relative">
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-yellow-400 flex items-center justify-center text-white font-bold"
              >
                {user.name?.[0]?.toUpperCase()}
              </button>

              {/* Profile Dropdown */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-yellow-100 z-50">
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-pink-700">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.phone}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Link
                        href="/auth/ram/change-password"
                        className="block w-full py-2 px-4 text-center bg-yellow-50 text-pink-700 rounded-lg hover:bg-yellow-100"
                      >
                        Change Password
                      </Link>
                      <button
                        onClick={async () => {
                          try {
                            await fetch('/api/ram/logout', { method: 'POST' });
                            window.location.href = '/auth/ram/login';
                          } catch (error) {
                            console.error('Error logging out:', error);
                          }
                        }}
                        className="w-full py-2 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
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