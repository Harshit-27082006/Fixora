import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/common/StatusBadge';
import { CATEGORIES } from '../data/seedData';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Layers, 
  Clock, 
  CheckCircle2, 
  X,
  Sparkles
} from 'lucide-react';

export function MyComplaints() {
  const { complaints, currentUser, navigateTo } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Filter complaints
  // In student view: show user's complaints or show all with clear tag
  const isStudent = currentUser.role === 'student';
  const baseComplaints = isStudent 
    ? complaints.filter(c => c.reportedBy?.id === currentUser.id || !c.reportedBy?.id)
    : complaints;

  const filtered = baseComplaints.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const statuses = ['All', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {isStudent ? 'My Reported Complaints' : 'Complaint Records Directory'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time progress, response logs, and technician assignments for your tickets.
          </p>
        </div>

        <button
          onClick={() => navigateTo('report')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Complaint</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by ticket ID (e.g. FX-2026-001), keywords, location..."
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

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white text-slate-700"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="sm:col-span-3">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white text-slate-700"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Critical">Critical Priority</option>
            </select>
          </div>
        </div>

        {/* Status Horizontal Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Status:
          </span>
          {statuses.map(st => {
            const count = st === 'All' 
              ? baseComplaints.length 
              : baseComplaints.filter(c => c.status === st).length;
            const isSelected = statusFilter === st;

            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Complaints List / Cards */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-500 flex items-center justify-between px-1">
          <span>Showing {filtered.length} of {baseComplaints.length} tickets</span>
          {(search || statusFilter !== 'All' || categoryFilter !== 'All' || priorityFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
                setCategoryFilter('All');
                setPriorityFilter('All');
              }}
              className="text-brand-600 hover:underline text-xs font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
            <Layers className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No complaints found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting search keywords or status filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filtered.map(item => (
              <div
                key={item.id}
                onClick={() => navigateTo('complaint-details', item.id)}
                className="bg-white rounded-xl border border-slate-200 hover:border-brand-400 hover:shadow-md transition-all p-5 cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-200">
                        {item.id}
                      </span>
                      <CategoryBadge category={item.category} />
                      <PriorityBadge priority={item.priority} size="sm" />
                      <StatusBadge status={item.status} size="sm" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {item.aiSummary && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                        <Sparkles className="w-3 h-3 text-brand-600 shrink-0" />
                        <span className="italic">AI Brief: {item.aiSummary}</span>
                      </div>
                    )}

                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      {item.assignedDepartment && (
                        <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-medium text-[11px]">
                          Dept: <strong>{item.assignedDepartment}</strong>
                        </span>
                      )}
                      {item.timeline && (
                        <span className="text-slate-400 text-[11px]">
                          • {item.timeline.length} updates logged
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail / Status tracker button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt="Thumbnail"
                        className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                      />
                    )}
                    <button className="px-3 py-1.5 rounded-lg bg-slate-50 group-hover:bg-brand-50 text-brand-600 font-bold text-xs flex items-center gap-1 transition-colors border border-slate-200 group-hover:border-brand-200">
                      <span>View Timeline</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
