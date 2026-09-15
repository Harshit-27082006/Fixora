import React from 'react';
import { AlertTriangle, Clock, CheckCircle2, AlertCircle, ArrowUpRight, ShieldAlert } from 'lucide-react';

export function StatusBadge({ status, size = 'md' }) {
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : size === 'lg' 
      ? 'px-3.5 py-1.5 text-sm font-semibold' 
      : 'px-2.5 py-1 text-xs font-medium';

  const config = {
    'Submitted': {
      bg: 'bg-slate-100 text-slate-700 border-slate-300',
      dot: 'bg-slate-400',
      icon: Clock,
      label: 'Submitted'
    },
    'Under Review': {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      icon: AlertCircle,
      label: 'Under Review'
    },
    'Assigned': {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
      icon: ArrowUpRight,
      label: 'Assigned'
    },
    'In Progress': {
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      dot: 'bg-indigo-500',
      icon: Clock,
      label: 'In Progress'
    },
    'Resolved': {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      icon: CheckCircle2,
      label: 'Resolved'
    },
    'Closed': {
      bg: 'bg-slate-200 text-slate-800 border-slate-400',
      dot: 'bg-slate-600',
      icon: CheckCircle2,
      label: 'Closed'
    },
    'Rejected': {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      icon: AlertTriangle,
      label: 'Rejected'
    }
  };

  const current = config[status] || config['Submitted'];
  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${current.bg} ${sizeClasses} shadow-sm transition-all`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} ${status === 'In Progress' ? 'animate-pulse' : ''}`} />
      <Icon className="w-3.5 h-3.5" />
      <span>{current.label}</span>
    </span>
  );
}

export function PriorityBadge({ priority, size = 'md' }) {
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : size === 'lg' 
      ? 'px-3 py-1 text-sm font-semibold' 
      : 'px-2.5 py-0.5 text-xs font-semibold';

  const config = {
    'Low': {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'Low Priority'
    },
    'Medium': {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
      label: 'Medium Priority'
    },
    'High': {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      label: 'High Priority'
    },
    'Critical': {
      bg: 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-200',
      dot: 'bg-rose-500 animate-ping',
      label: 'Critical'
    }
  };

  const current = config[priority] || config['Medium'];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border ${current.bg} ${sizeClasses} tracking-tight`}>
      {priority === 'Critical' && <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />}
      <span className={`relative flex h-2 w-2`}>
        {priority === 'Critical' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`}></span>
      </span>
      <span>{current.label}</span>
    </span>
  );
}

export function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      {category}
    </span>
  );
}
