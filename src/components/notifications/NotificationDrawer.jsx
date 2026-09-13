import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCheck, Bell, ArrowRight, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export function NotificationDrawer({ isOpen, onClose }) {
  const { notifications, markNotificationAsRead, markAllNotificationsRead, navigateTo, currentUser } = useApp();
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'

  if (!isOpen) return null;

  // Filter relevant notifications for current user/role
  const userNotifs = notifications.filter(n => {
    if (n.userId && n.userId === currentUser.id) return true;
    if (n.role && n.role === currentUser.role) return true;
    return true; // show all for demo ease
  });

  const displayedNotifs = filter === 'unread' 
    ? userNotifs.filter(n => !n.read) 
    : userNotifs;

  const unreadCount = userNotifs.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'assignment':
        return <ArrowRight className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4 text-brand-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-brand-600/30 text-brand-300 border border-brand-500/30">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold">Notifications Center</h2>
                <p className="text-xs text-slate-400">
                  {unreadCount} unread alert{unreadCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Bar */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-white text-slate-900 font-bold shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({userNotifs.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  filter === 'unread' 
                    ? 'bg-white text-brand-600 font-bold shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="flex items-center gap-1 text-brand-600 hover:text-brand-700 font-semibold"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {displayedNotifs.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">No notifications right now</p>
                <p className="text-xs mt-1">You're all caught up!</p>
              </div>
            ) : (
              displayedNotifs.map(n => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationAsRead(n.id);
                    if (n.complaintId) {
                      navigateTo('complaint-details', n.complaintId);
                      onClose();
                    }
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    !n.read 
                      ? 'bg-brand-50/50 hover:bg-brand-50 border-l-4 border-brand-500' 
                      : 'hover:bg-slate-50 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 rounded-md bg-white border border-slate-200 shadow-2xl">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {n.title}
                        </h4>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {n.complaintId && (
                          <span className="text-brand-600 font-semibold flex items-center gap-0.5 hover:underline">
                            View Ticket #{n.complaintId} →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
