import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { USERS, DEPARTMENTS } from '../../data/seedData';
import { 
  Wrench, 
  Bell, 
  RotateCcw, 
  ChevronDown, 
  User, 
  ShieldCheck, 
  Briefcase, 
  PlusCircle, 
  Layers,
  Sparkles
} from 'lucide-react';

export function Navbar({ onOpenNotifications }) {
  const { 
    currentUser, 
    switchUser, 
    switchRole, 
    notifications, 
    activePage, 
    navigateTo, 
    resetData 
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [deptMenuOpen, setDeptMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      {/* Top Demo Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500 text-white tracking-wider uppercase">
            Interactive Prototype
          </span>
          <span className="hidden sm:inline text-slate-400">
            Quick Role Switcher for Evaluators:
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Quick 1-click Role buttons */}
          <button
            onClick={() => switchRole('student')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              currentUser.role === 'student' 
                ? 'bg-brand-600 text-white shadow-sm font-semibold' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🎓 Student Mode
          </button>

          <button
            onClick={() => switchRole('admin')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              currentUser.role === 'admin' 
                ? 'bg-brand-600 text-white shadow-sm font-semibold' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🛡️ Admin Mode
          </button>

          <div className="relative">
            <button
              onClick={() => setDeptMenuOpen(!deptMenuOpen)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
                currentUser.role === 'department' 
                  ? 'bg-brand-600 text-white shadow-sm font-semibold' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🔧 Dept: {currentUser.role === 'department' ? currentUser.departmentId : 'Switch Dept'}
              <ChevronDown className="w-3 h-3" />
            </button>

            {deptMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Select Campus Dept:
                </div>
                {['Electrical', 'IT / Internet', 'Hostel', 'Cleanliness', 'Transport', 'Classroom', 'Maintenance'].map(dept => (
                  <button
                    key={dept}
                    onClick={() => {
                      switchRole('department', dept);
                      setDeptMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>{dept}</span>
                    {currentUser.role === 'department' && currentUser.departmentId === dept && (
                      <span className="text-brand-600 font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={resetData}
            title="Reset to fresh mock data"
            className="ml-2 px-2 py-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-1 transition-colors text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => navigateTo(currentUser.role === 'admin' ? 'admin-dashboard' : (currentUser.role === 'department' ? 'dept-dashboard' : 'student-dashboard'))}
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
                <span className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200 rounded">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Report. Track. Resolve.
              </p>
            </div>
          </div>

          {/* Center Action (Report button if student/staff) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('report')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold shadow-sm transition-all hover:shadow hover:shadow-brand-500/25"
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

            {/* User Profile Chip */}
            <div className="relative">
              <button
                onClick={() => navigateTo('profile')}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
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
                      : (currentUser.role === 'admin' ? 'Campus Admin' : 'Student')}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
