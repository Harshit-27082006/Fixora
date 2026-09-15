import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/common/StatusBadge';
import { DEPARTMENTS } from '../data/seedData';
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldAlert, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  PlusCircle, 
  Sparkles, 
  Building,
  User,
  Send,
  X
} from 'lucide-react';

export function DeptDashboard() {
  const { 
    currentUser, 
    complaints, 
    navigateTo, 
    updateComplaintStatus, 
    addComplaintResponse,
    switchRole 
  } = useApp();

  const currentDeptId = currentUser.departmentId || 'Electrical';
  const deptInfo = DEPARTMENTS.find(d => d.id === currentDeptId) || DEPARTMENTS[0];

  // Complaints assigned to this department
  const deptComplaints = complaints.filter(c => c.assignedDepartment === currentDeptId);
  const activeQueue = deptComplaints.filter(c => c.status !== 'Resolved');
  const inProgress = deptComplaints.filter(c => c.status === 'In Progress');
  const resolved = deptComplaints.filter(c => c.status === 'Resolved');
  const critical = deptComplaints.filter(c => c.priority === 'Critical' && c.status !== 'Resolved');

  // Quick note modal
  const [modalTicket, setModalTicket] = useState(null);
  const [actionType, setActionType] = useState('progress'); // 'progress' | 'resolve'
  const [noteText, setNoteText] = useState('');

  const openActionModal = (ticket, type) => {
    setModalTicket(ticket);
    setActionType(type);
    setNoteText(type === 'resolve' ? 'Completed repair, checked functionality and verified safe.' : 'Technician assigned and working on site.');
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!modalTicket) return;

    if (actionType === 'resolve') {
      updateComplaintStatus(modalTicket.id, 'Resolved', noteText);
    } else {
      updateComplaintStatus(modalTicket.id, 'In Progress', noteText);
    }
    setModalTicket(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Department Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              {deptInfo.name} Work Queue & Operations
            </h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              Department Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Department Lead: <strong className="text-slate-800">{currentUser.name}</strong> • Direct contact: {currentUser.email}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            Assigned Operations: <strong className="text-slate-900 font-bold">{deptInfo.name}</strong>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Assigned Total</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{deptComplaints.length}</div>
            <span className="text-[11px] text-slate-400 font-medium">To {deptInfo.name}</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase">Active In-Progress</span>
            <div className="text-2xl font-black text-indigo-700 mt-1">{inProgress.length}</div>
            <span className="text-[11px] text-slate-400 font-medium">Under repair</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase">Resolved Today</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">{resolved.length}</div>
            <span className="text-[11px] text-slate-400 font-medium">Fixed and closed</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-rose-50/80 rounded-xl p-5 border border-rose-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-700 uppercase flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Critical SLA
            </span>
            <div className="text-2xl font-black text-rose-700 mt-1">{critical.length}</div>
            <span className="text-[11px] text-rose-600 font-semibold">Priority &lt; 2h</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Active Work Queue */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {deptInfo.name} Active Task Queue ({activeQueue.length} tickets)
            </h2>
            <p className="text-xs text-slate-500">
              Update status, post field technician notes, and complete maintenance tasks.
            </p>
          </div>
        </div>

        {activeQueue.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
            <p className="text-sm font-bold text-slate-800">All tasks resolved!</p>
            <p className="text-xs text-slate-400 mt-1">
              No active pending complaints for {deptInfo.name} at this time.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activeQueue.map(item => (
              <div
                key={item.id}
                className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0 pr-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => navigateTo('complaint-details', item.id)}
                      className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 hover:bg-brand-100"
                    >
                      {item.id}
                    </button>
                    <CategoryBadge category={item.category} />
                    <PriorityBadge priority={item.priority} size="sm" />
                    <StatusBadge status={item.status} size="sm" />
                  </div>

                  <h3 
                    onClick={() => navigateTo('complaint-details', item.id)}
                    className="text-sm font-bold text-slate-900 hover:text-brand-600 cursor-pointer"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {item.location}
                    </span>
                    <span>•</span>
                    <span>Reported: {new Date(item.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="text-slate-600">
                      Reported by: <strong>{item.reportedBy?.name || 'Student'}</strong>
                    </span>
                  </div>
                </div>

                {/* Fast Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {item.status !== 'In Progress' && (
                    <button
                      onClick={() => openActionModal(item, 'progress')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors flex items-center gap-1"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Start Work</span>
                    </button>
                  )}

                  <button
                    onClick={() => openActionModal(item, 'resolve')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Fixed</span>
                  </button>

                  <button
                    onClick={() => navigateTo('complaint-details', item.id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Full Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolved History for this Department */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Completed / Resolved Work History ({resolved.length})
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {resolved.slice(0, 4).map(item => (
            <div 
              key={item.id}
              onClick={() => navigateTo('complaint-details', item.id)}
              className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-slate-600">{item.id}</span>
                <span className="font-bold text-slate-900 truncate max-w-sm">{item.title}</span>
                <span className="text-slate-400 hidden sm:inline">{item.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={item.status} size="sm" />
                <span className="text-brand-600 font-bold hover:underline">View Audit →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Modal */}
      {modalTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {actionType === 'resolve' ? 'Mark Complaint Resolved' : 'Set Task In-Progress'}
              </h3>
              <button
                onClick={() => setModalTicket(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400">Ticket:</span>{' '}
                <strong className="text-slate-900">#{modalTicket.id} - {modalTicket.title}</strong>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {actionType === 'resolve' ? 'Resolution Summary & Notes:' : 'Technician Action Log:'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalTicket(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg font-bold text-white shadow-sm ${
                    actionType === 'resolve' 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  Confirm & Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
