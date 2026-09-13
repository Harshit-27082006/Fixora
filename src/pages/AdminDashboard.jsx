import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/common/StatusBadge';
import { DEPARTMENTS } from '../data/seedData';
import { 
  Layers, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight, 
  ChevronRight, 
  Building, 
  TrendingUp, 
  Zap, 
  Sliders, 
  ListFilter,
  CheckCircle,
  FileText
} from 'lucide-react';

export function AdminDashboard() {
  const { complaints, navigateTo, assignDepartment, updateComplaintStatus } = useApp();

  const total = complaints.length;
  const newComplaints = complaints.filter(c => c.status === 'Submitted').length;
  const pending = complaints.filter(c => ['Submitted', 'Under Review'].includes(c.status)).length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const critical = complaints.filter(c => c.priority === 'Critical' && c.status !== 'Resolved').length;

  // Department Distribution calculation
  const deptStats = DEPARTMENTS.map(d => {
    const deptComplaints = complaints.filter(c => c.assignedDepartment === d.id);
    const active = deptComplaints.filter(c => c.status !== 'Resolved').length;
    const completed = deptComplaints.filter(c => c.status === 'Resolved').length;
    return {
      ...d,
      active,
      completed,
      total: deptComplaints.length
    };
  }).sort((a, b) => b.active - a.active);

  // Urgent / High Priority queue
  const urgentQueue = complaints
    .filter(c => ['Critical', 'High'].includes(c.priority) && c.status !== 'Resolved')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Campus Operations & Complaint Command Center
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
              Admin Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time campus triage, multi-department workload routing, and facility SLA monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigateTo('admin-complaints')}
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <ListFilter className="w-4 h-4" />
            <span>Complaint Triage ({pending} unassigned)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Tickets</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
          <span className="text-[10px] text-slate-400">All campus areas</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-amber-600 uppercase">New Tickets</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{newComplaints}</div>
          <span className="text-[10px] text-amber-600 font-semibold">Needs triage</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-blue-600 uppercase">Pending Review</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{pending}</div>
          <span className="text-[10px] text-slate-400">Queued</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-indigo-600 uppercase">In Progress</span>
          <div className="text-2xl font-black text-indigo-700 mt-1">{inProgress}</div>
          <span className="text-[10px] text-slate-400">Technicians active</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase">Resolved</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{resolved}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">
            {total > 0 ? `${Math.round((resolved / total) * 100)}% Closed` : '0%'}
          </span>
        </div>

        <div className="bg-rose-50/80 rounded-xl p-4 border border-rose-200 shadow-sm">
          <span className="text-[11px] font-bold text-rose-700 uppercase flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            Critical SLA
          </span>
          <div className="text-2xl font-black text-rose-700 mt-1">{critical}</div>
          <span className="text-[10px] text-rose-600 font-semibold">Requires &lt; 2h fix</span>
        </div>
      </div>

      {/* Critical & Urgent Triage Notice Bar */}
      {critical > 0 && (
        <div className="p-4 bg-rose-50 border-l-4 border-rose-600 rounded-r-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-600 text-white animate-bounce">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900">
                {critical} Critical Safety & Infrastructure Alerts Flagged
              </h4>
              <p className="text-xs text-rose-800/90 mt-0.5">
                Immediate electrical, plumbing or hazard risks detected by the AI Urgency scoring engine.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('admin-complaints')}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm whitespace-nowrap self-start sm:self-auto"
          >
            Review Critical Tickets →
          </button>
        </div>
      )}

      {/* Grid: Left Urgent Triage Table, Right Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Urgent Triage Queue */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                Priority Triage Queue (Critical & High)
              </h3>
              <p className="text-xs text-slate-500">
                Requires immediate departmental dispatch and technician assignment
              </p>
            </div>
            <button
              onClick={() => navigateTo('admin-complaints')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              View Full List →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {urgentQueue.map(item => (
              <div
                key={item.id}
                className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {item.id}
                    </span>
                    <PriorityBadge priority={item.priority} size="sm" />
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <h4 
                    onClick={() => navigateTo('complaint-details', item.id)}
                    className="text-xs font-bold text-slate-900 hover:text-brand-600 cursor-pointer truncate"
                  >
                    {item.title}
                  </h4>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>{item.location}</span>
                    <span>•</span>
                    <span>Dept: <strong>{item.assignedDepartment}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigateTo('complaint-details', item.id)}
                    className="px-2.5 py-1 text-xs font-bold rounded bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 border border-slate-200 transition-colors"
                  >
                    Dispatch / Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Workload & Distribution */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-4 h-4 text-brand-600" />
                Departmental Workload Balance
              </h3>
              <p className="text-xs text-slate-500">
                Active tickets distributed across operational teams
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {deptStats.slice(0, 6).map(dept => {
              const activePct = total > 0 ? (dept.active / total) * 100 : 0;
              return (
                <div key={dept.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      {dept.name}
                    </span>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-brand-600 font-bold font-mono">{dept.active} active</span>
                      <span className="text-slate-400">/</span>
                      <span className="text-emerald-600 font-medium">{dept.completed} fixed</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-brand-600 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(8, activePct * 3))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              onClick={() => navigateTo('admin-complaints')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
            >
              <span>Manage All 9 Department Queues</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
