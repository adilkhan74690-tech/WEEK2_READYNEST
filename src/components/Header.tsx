import React, { useState } from 'react';
import { Search, Bell, HelpCircle, Grid, User as UserIcon, Settings, LogOut, Check } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  profile: User | null;
  onNavigate: (tab: string) => void;
  onToggleSidebar: () => void;
  onSearch: (query: string) => void;
}

export default function Header({ profile, onNavigate, onToggleSidebar, onSearch }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showApps, setShowApps] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const notifications = [
    { id: 1, title: 'Mid-term schedule published', time: '10 mins ago', urgent: true, read: false },
    { id: 2, title: 'New registration request (CS Dept)', time: '2 hours ago', urgent: false, read: false },
    { id: 3, title: 'Server maintenance completed', time: '5 hours ago', urgent: false, read: true },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearch(e.target.value);
  };

  // Compute initials for fallback avatar
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-white border-b border-slate-200 flex justify-between items-center px-6 py-3 transition-all duration-200">
      {/* Search & Mobile Menu Button */}
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-emerald-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Toggle Sidebar"
          id="btn-mobile-sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={searchVal}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-50 text-slate-800 border-none placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-sans"
            placeholder="Search records, students, classes..."
          />
        </div>
      </div>

      {/* Quick Action Controls */}
      <div className="flex items-center gap-4">
        {/* Notifications Popover */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowApps(false); }}
            className="p-2 rounded-full hover:bg-slate-50 transition-all duration-200 relative cursor-pointer text-slate-600"
            id="btn-notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                <span className="font-semibold text-sm text-slate-800">Notifications</span>
                <span className="text-xs text-emerald-600 hover:underline cursor-pointer">Mark all read</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 flex items-start gap-3 transition-colors ${!notif.read ? 'bg-emerald-50/20' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${notif.urgent ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    <div className="flex-1">
                      <p className={`text-xs text-slate-700 ${!notif.read ? 'font-medium' : ''}`}>{notif.title}</p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* System Apps Popover */}
        <div className="relative">
          <button 
            onClick={() => { setShowApps(!showApps); setShowNotifications(false); }}
            className="p-2 rounded-full hover:bg-slate-50 transition-all duration-200 cursor-pointer text-slate-600"
            id="btn-apps"
          >
            <Grid className="w-5 h-5" />
          </button>

          {showApps && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50">
              <span className="font-semibold text-xs text-slate-400 uppercase tracking-widest block mb-3">Portal Modules</span>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { onNavigate('dashboard'); setShowApps(false); }} className="p-3 bg-slate-50 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-all flex flex-col items-center gap-1.5 text-xs font-medium cursor-pointer">
                  <Grid className="w-5 h-5 text-emerald-600" />
                  <span>Control Center</span>
                </button>
                <button onClick={() => { onNavigate('timetable'); setShowApps(false); }} className="p-3 bg-slate-50 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-all flex flex-col items-center gap-1.5 text-xs font-medium cursor-pointer">
                  <HelpCircle className="w-5 h-5 text-emerald-600" />
                  <span>Schedules</span>
                </button>
                <button onClick={() => { onNavigate('attendance'); setShowApps(false); }} className="p-3 bg-slate-50 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-all flex flex-col items-center gap-1.5 text-xs font-medium cursor-pointer">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>Attendance</span>
                </button>
                <button onClick={() => { onNavigate('settings'); setShowApps(false); }} className="p-3 bg-slate-50 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-all flex flex-col items-center gap-1.5 text-xs font-medium cursor-pointer">
                  <Settings className="w-5 h-5 text-emerald-600" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Help Modal Trigger */}
        <button 
          onClick={() => onNavigate('settings')} 
          className="p-2 rounded-full hover:bg-slate-50 transition-all duration-200 cursor-pointer text-slate-600"
          id="btn-help"
          title="System Settings and Guides"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Vertical Divider */}
        <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

        {/* Super Admin Identity Badge */}
        <div 
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
          title="View profile details"
        >
          <div className="text-right hidden lg:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{profile?.name || 'Academic User'}</p>
            <p className="text-xs text-slate-400 capitalize">{profile?.role?.toLowerCase() || 'Session'}</p>
          </div>
          {profile?.avatar ? (
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="w-10 h-10 rounded-full border-2 border-emerald-400 object-cover shadow-sm hover:scale-105 transition-transform select-none"
            />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-emerald-400 bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-sm shadow-sm hover:scale-105 transition-transform select-none">
              {getInitials(profile?.name)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
