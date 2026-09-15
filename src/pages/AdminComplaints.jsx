import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/common/StatusBadge';
import { CATEGORIES, PRIORITIES, DEPARTMENTS } from '../data/seedData';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Building, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  Layers, 
  X, 
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

export function AdminComplaints() {
  const { 
    complaints, 
    navigateTo, 
    assignDepartment, 
    updateComplaintStatus, 
    updatePriority 
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  // Quick modals
  const [activeModalTicket, setActiveModalTicket] = useState(null);
  const [modalType, setModalType] = useState(null); // 'assign' | 'status' | 'priority'
  const [modalSelectVal, setModalSelectVal] = useState('');
  const [modalNote, setModalNote] = useState('');

  const filtered = complaints.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.reportedBy?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter;
    const matchesDept = deptFilter === 'All' || item.assignedDepartment === deptFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesDept;
  });

  const openActionModal = (ticket, type) => {
    setActiveModalTicket(ticket);
    setModalType(type);
    if (type === 'assign') setModalSelectVal(ticket.assignedDepartment || 'Electrical');
    if (type === 'status') setModalSelectVal(ticket.status || 'In Progress');
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
    }

    setActiveModalTicket(null);
    setModalType(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Administrative Complaint Triage & Dispatch Table
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming complaints, adjust priority thresholds, assign campus teams, and track resolution audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            Total Tickets: <strong className="text-slate-900 font-bold">{complaints.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search ID, keyword, location, student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
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

          {/* Status Filter */}
          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white text-slate-700 font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted (New)</option>
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
        </div>

        {/* Clear Filters Reset */}
        {(search || statusFilter !== 'All' || categoryFilter !== 'All' || priorityFilter !== 'All' || deptFilter !== 'All') && (
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-500">Filtered: {filtered.length} matches</span>
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
                setCategoryFilter('All');
                setPriorityFilter('All');
                setDeptFilter('All');
              }}
              className="text-brand-600 font-semibold hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Main Complaints Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4 min-w-[220px]">Title & Facility</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Assigned Dept</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Admin Triage Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-slate-400">
                    No complaints match the specified search or filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(item => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-slate-50/90 transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => navigateTo('complaint-details', item.id)}
                        className="font-mono font-bold text-brand-600 hover:text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-200"
                      >
                        {item.id}
                      </button>
                    </td>

                    {/* Title & Category */}
                    <td className="py-3.5 px-4">
                      <div 
                        onClick={() => navigateTo('complaint-details', item.id)}
                        className="font-bold text-slate-900 hover:text-brand-600 cursor-pointer line-clamp-1 max-w-xs"
                      >
                        {item.title}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <CategoryBadge category={item.category} />
                        <span className="text-[11px] text-slate-400 truncate">
                          By: {item.reportedBy?.name || 'Student'}
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                      {item.location}
                    </td>

                    {/* Priority (Click to change) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => openActionModal(item, 'priority')}
                        title="Click to change priority"
                        className="hover:opacity-80 transition-opacity"
                      >
                        <PriorityBadge priority={item.priority} size="sm" />
                      </button>
                    </td>

                    {/* Assigned Department */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => openActionModal(item, 'assign')}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 font-semibold text-[11px] border border-slate-200 flex items-center gap-1 transition-colors"
                      >
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>{item.assignedDepartment || 'Unassigned'}</span>
                        <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                      </button>
                    </td>

                    {/* Status (Click to change) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => openActionModal(item, 'status')}
                        title="Click to update status"
                        className="hover:opacity-80 transition-opacity"
                      >
                        <StatusBadge status={item.status} size="sm" />
                      </button>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
                      <button
                        onClick={() => navigateTo('complaint-details', item.id)}
                        className="px-2.5 py-1 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-bold text-[11px] shadow-sm transition-colors"
                      >
                        Triage & Timeline
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inline Action Modal for Fast Triage */}
      {activeModalTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Quick Triage: Ticket #{activeModalTicket.id}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
                  {activeModalTicket.title}
                </p>
              </div>
              <button
                onClick={() => setActiveModalTicket(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-3.5 text-xs">
              {modalType === 'assign' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Assigned Department:
                  </label>
                  <select
                    value={modalSelectVal}
                    onChange={(e) => setModalSelectVal(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none bg-white font-medium"
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
                    Change Ticket Lifecycle Status:
                  </label>
                  <select
                    value={modalSelectVal}
                    onChange={(e) => setModalSelectVal(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none bg-white font-medium"
                  >
                    <option value="Submitted">Submitted (New)</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              )}

              {modalType === 'priority' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Adjust Priority Level:
                  </label>
                  <select
                    value={modalSelectVal}
                    onChange={(e) => setModalSelectVal(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none bg-white font-medium"
                  >
                    <option value="Low">Low Priority (48h SLA)</option>
                    <option value="Medium">Medium Priority (24h SLA)</option>
                    <option value="High">High Priority (8h SLA)</option>
                    <option value="Critical">Critical Priority (2h Emergency SLA)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Audit Log Note (Reason):
                </label>
                <textarea
                  rows={2}
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  placeholder="e.g., Escalated to on-duty team; spare components dispatched."
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModalTicket(null)}
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
