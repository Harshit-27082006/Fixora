import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  ListFilter, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  ShieldAlert, 
  User, 
  Layers, 
  Activity,
  AlertCircle
} from 'lucide-react';

export function Sidebar({ onOpenNotifications }) {
  const { currentUser, activePage, navigateTo, complaints } = useApp();

  // Calculate live counts
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => ['Submitted', 'Under Review'].includes(c.status)).length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const criticalCount = complaints.filter(c => c.priority === 'Critical' && c.status !== 'Resolved').length;

  const getNavLinks = () => {
    if (currentUser.role === 'admin') {
      return [
        { id: 'admin-dashboard', label: 'Admin Overview', icon: LayoutDashboard, badge: null },
        { id: 'admin-complaints', label: 'Complaint Triage', icon: ListFilter, badge: pendingCount ? `${pendingCount} new` : null },
        { id: 'report', label: 'Log Complaint', icon: PlusCircle, badge: null },
        { id: 'profile', label: 'Admin Settings', icon: User, badge: null }
      ];
    }
    
    if (currentUser.role === 'department') {
      const deptTickets = complaints.filter(c => c.assignedDepartment === currentUser.departmentId && c.status !== 'Resolved');
      return [
        { id: 'dept-dashboard', label: `${currentUser.departmentId} Queue`, icon: LayoutDashboard, badge: deptTickets.length ? `${deptTickets.length} active` : null },
        { id: 'admin-complaints', label: 'All Complaints', icon: ListFilter, badge: null },
        { id: 'report', label: 'Report Issue', icon: PlusCircle, badge: null },
        { id: 'profile', label: 'Staff Profile', icon: User, badge: null }
      ];
    }

    // Default: Student/Staff
    const myOpen = complaints.filter(c => c.reportedBy?.id === currentUser.id && c.status !== 'Resolved');
    return [
      { id: 'student-dashboard', label: 'Student Dashboard', icon: LayoutDashboard, badge: null },
      { id: 'report', label: 'Report Complaint', icon: PlusCircle, badge: 'Smart AI' },
      { id: 'my-complaints', label: 'My Complaints', icon: FileText, badge: myOpen.length ? `${myOpen.length} open` : null },
      { id: 'profile', label: 'My Profile', icon: User, badge: null }
    ];
  };

  const navLinks = getNavLinks();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between p-4 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Role Badge Indicator */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Active Workspace
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800">
              {currentUser.role === 'admin' 
                ? 'Campus Central Admin' 
                : (currentUser.role === 'department' ? `${currentUser.departmentId} Dept` : 'Student Portal')}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {currentUser.name}
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Navigation
          </div>
          {navLinks.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold border-l-4 border-brand-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.badge.includes('Critical') || item.badge.includes('new')
                      ? 'bg-rose-100 text-rose-700'
                      : (item.badge.includes('AI') ? 'bg-indigo-100 text-indigo-700 font-extrabold' : 'bg-slate-100 text-slate-600')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Snapshot Metrics */}
        <div className="pt-2">
          <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Campus SLA Pulse
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-slate-500 font-medium">Pending</div>
              <div className="text-lg font-bold text-amber-600 mt-0.5">{pendingCount}</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-slate-500 font-medium">In Progress</div>
              <div className="text-lg font-bold text-indigo-600 mt-0.5">{inProgressCount}</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-slate-500 font-medium">Resolved</div>
              <div className="text-lg font-bold text-emerald-600 mt-0.5">{resolvedCount}</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-slate-500 font-medium">Critical</div>
              <div className={`text-lg font-bold mt-0.5 ${criticalCount > 0 ? 'text-rose-600 animate-pulse' : 'text-slate-700'}`}>
                {criticalCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campus System Card */}
      <div className="pt-4 border-t border-slate-100">
        <div className="p-3 bg-gradient-to-br from-slate-900 to-brand-950 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Facility Operations
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
              98.4% SLA
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
            Auto-triage active. Real-time routing enabled across 9 campus facilities.
          </p>
        </div>
      </div>
    </aside>
  );
}
