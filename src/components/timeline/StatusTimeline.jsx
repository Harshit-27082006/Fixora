import React from 'react';
import { STATUS_STEPS } from '../../data/seedData';
import { CheckCircle2, Clock, Circle, ArrowRight, UserCheck, ShieldCheck, AlertCircle } from 'lucide-react';

export function StatusTimeline({ complaint }) {
  if (!complaint) return null;

  const currentStatus = complaint.status;
  const stepKeys = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];
  
  const currentIndex = stepKeys.indexOf(currentStatus);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Complaint Lifecycle Tracker
          </h3>
          <p className="text-xs text-slate-500">
            Ticket #{complaint.id} • Real-time resolution progression
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          Target SLA: {complaint.priority === 'Critical' ? '2 hrs' : (complaint.priority === 'High' ? '8 hrs' : '24 hrs')}
        </span>
      </div>

      {/* Visual Step Progression Bar */}
      <div className="relative">
        <div className="hidden sm:block absolute top-5 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
        <div 
          className="hidden sm:block absolute top-5 left-6 h-0.5 bg-brand-600 transition-all duration-500 -z-0"
          style={{ width: `${Math.max(0, (Math.min(currentIndex, 4) / 4) * 100 - 5)}%` }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
          {stepKeys.map((step, idx) => {
            const isCompleted = idx < currentIndex || currentStatus === 'Resolved';
            const isCurrent = idx === currentIndex && currentStatus !== 'Resolved';
            const isUpcoming = idx > currentIndex && currentStatus !== 'Resolved';

            return (
              <div key={step} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                      : isCurrent
                        ? 'bg-brand-600 text-white ring-4 ring-brand-100 shadow-md shadow-brand-500/30'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Clock className="w-5 h-5 animate-pulse" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </div>

                <div className="text-left sm:text-center">
                  <div className={`text-xs font-bold ${
                    isCompleted ? 'text-emerald-700' : isCurrent ? 'text-brand-700' : 'text-slate-400'
                  }`}>
                    {step}
                  </div>
                  <div className="text-[11px] text-slate-500 hidden md:block">
                    {idx === 0 && 'Logged'}
                    {idx === 1 && 'Triage'}
                    {idx === 2 && 'Dispatched'}
                    {idx === 3 && 'Fixing'}
                    {idx === 4 && 'Complete'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Audit Trail History */}
      <div className="pt-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Activity & Audit Log ({complaint.timeline?.length || 0} events)
        </h4>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {(complaint.timeline || []).map((entry, i) => (
            <div key={i} className="relative group">
              <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-brand-500 ring-4 ring-brand-100" />
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/80">
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-slate-900">
                    {entry.title || entry.status}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(entry.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {entry.description}
                </p>
                {entry.actor && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <UserCheck className="w-3.5 h-3.5 text-brand-600" />
                    <span>Action by: <strong className="text-slate-700">{entry.actor}</strong> ({entry.actorRole || 'Staff'})</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
