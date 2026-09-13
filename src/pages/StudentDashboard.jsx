import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/common/StatusBadge';
import { CAMPUS_ANNOUNCEMENTS } from '../data/seedData';
import { 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Wifi, 
  Zap, 
  Droplet, 
  Sparkles, 
  Monitor, 
  Layers, 
  Calendar, 
  MapPin, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export function StudentDashboard() {
  const { currentUser, complaints, navigateTo } = useApp();

  // Filter complaints for current student (or all if demo)
  const studentComplaints = complaints.filter(c => c.reportedBy?.id === currentUser.id);
  const total = studentComplaints.length;
  const pending = studentComplaints.filter(c => ['Submitted', 'Under Review'].includes(c.status)).length;
  const inProgress = studentComplaints.filter(c => c.status === 'In Progress').length;
  const resolved = studentComplaints.filter(c => c.status === 'Resolved').length;

  const quickTemplates = [
    { title: 'Campus Wi-Fi Down', category: 'IT / Internet', location: 'Library Reading Hall', icon: Wifi },
    { title: 'Broken Ceiling Fan / AC', category: 'Classroom', location: 'Classroom 204', icon: Zap },
    { title: 'Water Leakage / Tap Issue', category: 'Hostel', location: 'Hostel 3 Washroom', icon: Droplet },
    { title: 'Washroom Cleanliness', category: 'Cleanliness', location: 'Academic Block West Wing', icon: Sparkles },
    { title: 'Classroom Projector Failure', category: 'Classroom', location: 'Seminar Hall 1', icon: Monitor }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-brand-500/10 pointer-events-none rounded-l-full blur-2xl" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Campus Helpdesk Online • 24/7 Monitoring</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Report any facility issues across classrooms, hostels, labs, or transport. Our AI-assisted dispatch routes tickets straight to on-campus technicians.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigateTo('report')}
              className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 active:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/30 flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report a New Complaint</span>
            </button>
            <button
              onClick={() => navigateTo('my-complaints')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur transition-all"
            >
              View My Complaints ({total})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Reported
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
            <span className="text-[11px] text-slate-400 font-medium">Lifetime tickets</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
              Pending Triage
            </span>
            <div className="text-2xl font-black text-amber-700 mt-1">{pending}</div>
            <span className="text-[11px] text-slate-400 font-medium">Awaiting admin</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
              In Progress
            </span>
            <div className="text-2xl font-black text-indigo-700 mt-1">{inProgress}</div>
            <span className="text-[11px] text-slate-400 font-medium">Technicians on-site</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
              Resolved
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1">{resolved}</div>
            <span className="text-[11px] text-slate-400 font-medium">Successfully fixed</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Complaint Templates */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Quick Issue Presets
            </h3>
            <p className="text-xs text-slate-500">
              Frequently reported campus disruptions — click to auto-fill the complaint form
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {quickTemplates.map((tpl, i) => {
            const Icon = tpl.icon;
            return (
              <button
                key={i}
                onClick={() => navigateTo('report')}
                className="p-3 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-brand-100 text-slate-600 group-hover:text-brand-600 flex items-center justify-center mb-2 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-brand-700 truncate">
                  {tpl.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {tpl.category}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Campus Announcements Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CAMPUS_ANNOUNCEMENTS.map(ann => (
          <div key={ann.id} className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-bold text-amber-900 truncate">
                  {ann.title}
                </h4>
                <span className="text-[10px] font-semibold text-amber-700 font-mono">
                  {ann.date}
                </span>
              </div>
              <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                {ann.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Complaints Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              My Recent Complaints
            </h2>
            <p className="text-xs text-slate-500">
              Real-time timeline and technician status for issues you reported
            </p>
          </div>
          <button
            onClick={() => navigateTo('my-complaints')}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All ({studentComplaints.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {studentComplaints.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-sm font-medium">No complaints logged yet.</p>
            <button
              onClick={() => navigateTo('report')}
              className="mt-3 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-lg shadow-sm"
            >
              Report Your First Issue
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {studentComplaints.slice(0, 5).map(item => (
              <div
                key={item.id}
                onClick={() => navigateTo('complaint-details', item.id)}
                className="p-4 sm:p-5 hover:bg-slate-50/80 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {item.id}
                    </span>
                    <CategoryBadge category={item.category} />
                    <PriorityBadge priority={item.priority} size="sm" />
                    <StatusBadge status={item.status} size="sm" />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1">
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {item.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    {item.assignedDepartment && (
                      <>
                        <span>•</span>
                        <span className="text-slate-600">
                          Dept: <strong>{item.assignedDepartment}</strong>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 text-xs font-bold text-slate-600">
                  <span className="text-brand-600 flex items-center gap-1 group">
                    Track details
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
