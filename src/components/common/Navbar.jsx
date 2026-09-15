import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wrench, 
  Bell, 
  PlusCircle, 
  LogOut,
  UserCheck
} from 'lucide-react';

export function Navbar({ onOpenNotifications }) {
  const { 
    currentUser, 
    notifications, 
    navigateTo, 
    logout 
  } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!currentUser) return null;

  const handleLogoClick = () => {
    if (currentUser.role === 'admin') {
      navigateTo('admin-dashboard');
    } else if (currentUser.role === 'department') {
      navigateTo('dept-dashboard');
    } else {
      navigateTo('student-dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  FIXORA
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Report. Track. Resolve.
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Report button */}
            <button
              onClick={() => navigateTo('report')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all hover:shadow hover:shadow-brand-500/25"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Complaint</span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Info */}
            <button
              onClick={() => navigateTo('profile')}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              title="View Profile"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30"
              />
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-slate-500 capitalize">
                  {currentUser.role === 'department' 
                    ? `${currentUser.departmentId} Staff` 
                    : (currentUser.role === 'admin' ? 'Campus Administration' : (currentUser.rollNumber || 'Student'))}
                </div>
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
              title="Sign Out of Campus Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
