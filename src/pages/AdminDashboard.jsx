import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/common/StatusBadge';
import { CATEGORIES, PRIORITIES, DEPARTMENTS } from '../data/seedData';
import { 
  Layers, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight, 
  Building, 
  Search, 
  Filter, 
  X, 
  MessageSquare, 
  MapPin, 
  Navigation, 
  ExternalLink,
  ChevronDown,
  CheckCircle,
  Eye,
  Send,
  Lock
} from 'lucide-react';

export function AdminDashboard() {
  const { 
    complaints, 
    navigateTo, 
    assignDepartment, 
    updateComplaintStatus, 
    updatePriority, 
    addComplaintResponse 
  } = useApp();

  // Metrics
  const total = complaints.length;
  const newComplaints = complaints.filter(c => c.status === 'Submitted').length;
  const pending = complaints.filter(c => ['Submitted', 'Under Review'].includes(c.status)).length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const closed = complaints.filter(c => c.status === 'Closed').length;
  const criticalOrHigh = complaints.filter(c => ['Critical', 'High'].includes(c.priority) && !['Resolved', 'Closed'].includes(c.status)).length;

  // Search & Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  // Quick Action Modal states
  const [activeModalTicket, setActiveModalTicket] = useState(null);
  const [modalType, setModalType] = useState(null); // 'assign' | 'status' | 'priority' | 'reply'
  const [modalSelectVal, setModalSelectVal] = useState('');
  const [modalNote, setModalNote] = useState('');

  // Filter complaints
  const filtered = complaints.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      (item.reportedBy?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.reportedBy?.studentId || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesDept = deptFilter === 'All' || item.assignedDepartment === deptFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesDept;
  });

  const openActionModal = (ticket, type) => {
    setActiveModalTicket(ticket);
    setModalType(type);
    if (type === 'assign') setModalSelectVal(ticket.assignedDepartment || 'Electrical');
    if (type === 'status') setModalSelectVal(ticket.status || 'Under Review');
    if (type === 'priority') setModalSelectVal(ticket.priority || 'Medium');
    setModalNote('');
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!activeModalTicket) return;

    if (modalType === 'assign') {
      assignDepartment(activeModalTicket.id, modalSelectVal, modalNote);
    } else if (modalType === 'status') {
      updateComplaintStatus(activeModalTicket.id, modalSelectVal, modalNote);
    } else if (modalType === 'priority') {
      updatePriority(activeModalTicket.id, modalSelectVal);
    } else if (modalType === 'reply') {
      if (modalNote.trim()) {
        addComplaintResponse(activeModalTicket.id, modalNote);
      }
    }

    setActiveModalTicket(null);
    setModalType(null);
    setModalNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Campus Operations & Complaint Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Administrator
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Permanent record database monitoring, rapid departmental dispatch, and student grievance resolution.
          </p>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
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
          <span className="text-[11px] font-semibold text-blue-600 uppercase">Pending</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{pending}</div>
          <span className="text-[10px] text-slate-400">Under review</span>
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
            {closed > 0 ? `+${closed} Closed` : 'Rectified'}
          </span>
        </div>

        <div className="bg-rose-50/80 rounded-xl p-4 border border-rose-200 shadow-sm">
          <span className="text-[11px] font-bold text-rose-700 uppercase flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            Critical / High
          </span>
          <div className="text-2xl font-black text-rose-700 mt-1">{criticalOrHigh}</div>
          <span className="text-[10px] text-rose-600 font-semibold">Urgent attention</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search ID, student, keyword, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white text-slate-700 font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="sm:col-span-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white text-slate-700 font-medium"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white text-slate-700 font-medium"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="sm:col-span-2">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white text-slate-700 font-medium"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Reset */}
        {(search || statusFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All' || deptFilter !== 'All') && (
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-500">Showing {filtered.length} of {complaints.length} tickets</span>
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
                setPriorityFilter('All');
                setCategoryFilter('All');
                setDeptFilter('All');
              }}
              className="text-brand-600 font-semibold hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Main Admin Complaint Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px] tracking-wider">
                <th className="py-3 px-3.5">ID</th>
                <th className="py-3 px-3.5">Student</th>
                <th className="py-3 px-3.5">Category</th>
                <th className="py-3 px-3.5">Location</th>
                <th className="py-3 px-3.5">Priority</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5">Date</th>
                <th className="py-3 px-3.5">Department</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-10 text-center text-slate-400 text-xs">
                    No complaints match the filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <button
                        onClick={() => navigateTo('complaint-details', item.id)}
                        className="font-mono font-bold text-brand-600 hover:text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-200"
                        title="View Full Details"
                      >
                        {item.id}
                      </button>
                    </td>

                    {/* Student */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">
                        {item.reportedBy?.name || 'Student'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.reportedBy?.studentId || item.reportedBy?.email || 'Registered Student'}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <CategoryBadge category={item.category} />
                    </td>

                    {/* Location & GPS */}
                    <td className="py-3 px-3.5 min-w-[140px]">
                      <div className="text-slate-700 font-medium truncate max-w-[150px]">
                        {item.location}
                      </div>
                      {item.coordinates && (
                        <a
                          href={`https://www.google.com/maps?q=${item.coordinates.lat},${item.coordinates.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold hover:underline mt-0.5"
                          title="Open GPS location in Google Maps"
                        >
                          <Navigation className="w-2.5 h-2.5" />
                          <span>GPS Map</span>
                        </a>
                      )}
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <PriorityBadge priority={item.priority} size="sm" />
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3.5 whitespace-nowrap text-slate-500 text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>

                    {/* Department */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                        <Building className="w-3 h-3 text-slate-400" />
                        {item.assignedDepartment || 'Unassigned'}
                      </span>
                    </td>

                    {/* Actions: View, Assign, Update Priority, Update Status, Reply, Resolve, Close */}
                    <td className="py-3 px-3.5 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => navigateTo('complaint-details', item.id)}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-brand-600 transition-colors"
                          title="View Complaint Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => openActionModal(item, 'assign')}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-[11px] font-semibold border border-slate-200 transition-colors"
                          title="Assign Department"
                        >
                          Assign
                        </button>

                        <button
                          onClick={() => openActionModal(item, 'priority')}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 text-[11px] font-semibold border border-slate-200 transition-colors"
                          title="Update Priority"
                        >
                          Priority
                        </button>

                        <button
                          onClick={() => openActionModal(item, 'status')}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-[11px] font-semibold border border-slate-200 transition-colors"
                          title="Update Status"
                        >
                          Status
                        </button>

                        <button
                          onClick={() => openActionModal(item, 'reply')}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition-colors"
                          title="Reply / Resolution Note"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>

                        {item.status !== 'Resolved' && item.status !== 'Closed' && (
                          <button
                            onClick={() => updateComplaintStatus(item.id, 'Resolved', 'Resolved by Administrator.')}
                            className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm transition-colors"
                            title="Mark Resolved"
                          >
                            Resolve
                          </button>
                        )}

                        {item.status !== 'Closed' && (
                          <button
                            onClick={() => updateComplaintStatus(item.id, 'Closed', 'Ticket closed by Administrator.')}
                            className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-800 text-white text-[11px] font-bold shadow-sm transition-colors"
                            title="Close Ticket"
                          >
                            Close
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog for Actions (Assign / Status / Priority / Reply) */}
      {activeModalTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {modalType === 'assign' && 'Assign Department'}
                  {modalType === 'status' && 'Update Complaint Status'}
                  {modalType === 'priority' && 'Adjust Priority Level'}
                  {modalType === 'reply' && 'Add Admin Response / Note'}
                  <span className="font-mono text-brand-600 ml-1.5">#{activeModalTicket.id}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
                  {activeModalTicket.title}
                </p>
              </div>
              <button
                onClick={() => { setActiveModalTicket(null); setModalType(null); }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-3.5 text-xs">
              {modalType === 'assign' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Responsible Department:
                  </label>
                  <select
                    value={modalSelectVal}
                    onChange={(e) => setModalSelectVal(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none bg-white font-medium text-slate-800"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name} (Lead: {d.lead})</option>
                    ))}
                  </select>
                </div>
              )}

              {modalType === 'status' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select New Status:
                  </label>
                  <select
                    value={modalSelectVal}
                    onChange={(e) => setModalSelectVal(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none bg-white font-medium text-slate-800"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              )}

              {modalType === 'priority' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Priority Level:
                  </label>
                  <select
                    value={modalSelectVal}
                    onChange={(e) => setModalSelectVal(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none bg-white font-medium text-slate-800"
                  >
                    <option value="Low">Low Priority (48h SLA)</option>
                    <option value="Medium">Medium Priority (24h SLA)</option>
                    <option value="High">High Priority (8h SLA)</option>
                    <option value="Critical">Critical Priority (2h SLA)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {modalType === 'reply' ? 'Resolution Response Message:' : 'Audit Note / Reason (Optional):'}
                </label>
                <textarea
                  required={modalType === 'reply'}
                  rows={3}
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  placeholder={modalType === 'reply' ? 'Write official administrator response to the student...' : 'e.g., Dispatched electrical technician with replacement parts...'}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-none text-slate-800 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setActiveModalTicket(null); setModalType(null); }}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold"
                >
                  Save & Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
