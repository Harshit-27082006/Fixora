import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Bell, 
  RotateCcw,
  Sparkles,
  Award,
  LogOut
} from 'lucide-react';

export function ProfilePage() {
  const { currentUser, logout, complaints, resetData, showToast } = useApp();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [pushAlerts, setPushAlerts] = useState(true);

  // User stats
  const userTickets = complaints.filter(c => c.reportedBy?.id === currentUser.id);
  const resolved = userTickets.filter(c => c.status === 'Resolved').length;
  const inProgress = userTickets.filter(c => c.status === 'In Progress').length;

  const handleSavePreferences = (e) => {
    e.preventDefault();
    showToast('Notification preferences updated successfully!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">
          User Account & Campus Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your contact credentials, institutional affiliation, and notification preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: User Identity Card */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full rounded-full object-cover ring-4 ring-brand-100 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]">
                ✓
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">{currentUser.name}</h2>
              <p className="text-xs text-brand-600 font-semibold uppercase tracking-wider mt-0.5">
                {currentUser.role === 'admin' ? 'Administrator' : 'Student'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {currentUser.department || currentUser.designation || (currentUser.role === 'admin' ? 'Central Administration' : 'Enrolled Student')}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-left space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{currentUser.phone}</span>
              </div>
              {currentUser.hostel && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{currentUser.hostel}</span>
                </div>
              )}
              {currentUser.rollNumber && (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Roll: {currentUser.rollNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Institutional Account Security Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Institutional Account Status
            </h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Access Tier:</span>
                <span className="font-bold text-brand-700 capitalize">
                  {currentUser.role === 'admin' ? 'Administrator' : 'Student'}
                </span>
              </div>
              {currentUser.role === 'student' && (
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Student ID / Roll:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {currentUser.studentId || currentUser.rollNumber || 'CS-2023-042'}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">SSO Verification:</span>
                <span className="font-semibold text-emerald-700">Verified Institutional Member</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Account Created:</span>
                <span className="font-medium text-slate-700">
                  {currentUser.joinedDate || 'September 2024'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Session Security:</span>
                <span className="font-mono text-[11px] text-slate-600 truncate max-w-[160px]">
                  {currentUser.sessionToken || 'Encrypted JWT'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Access Scope:</span>
                <span className="font-semibold text-slate-700">
                  {currentUser.role === 'admin' ? 'Full Campus Infrastructure Oversight' : 'Grievance Submission & Tracking'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="w-full mt-2 py-2 px-3 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out of Campus Portal</span>
            </button>
          </div>
        </div>

        {/* Right: Activity Stats & Preferences */}
        <div className="md:col-span-7 space-y-6">
          {/* User Activity Snapshot */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Campus Activity Snapshot
            </h3>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-xl font-black text-slate-900">{userTickets.length}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Tickets Logged</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-xl font-black text-indigo-600">{inProgress}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">In Progress</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-xl font-black text-emerald-600">{resolved}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Resolved</div>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <form onSubmit={handleSavePreferences} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-brand-600" />
              SLA & Dispatch Alerts
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-800">Email Notifications</div>
                  <div className="text-[11px] text-slate-400">Receive status milestone updates and technician notes via email</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-800">Critical Emergency SMS Alerts</div>
                  <div className="text-[11px] text-slate-400">Receive SMS notifications for high safety hazard issues</div>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-800">Browser In-App Notifications</div>
                  <div className="text-[11px] text-slate-400">Real-time alerts whenever a ticket is updated or resolved</div>
                </div>
                <input
                  type="checkbox"
                  checked={pushAlerts}
                  onChange={(e) => setPushAlerts(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </form>

          {/* Clear Local Cache */}
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Clear Local Storage Cache</h4>
              <p className="text-[11px] text-slate-500">Resets local browser cache and returns to institutional sign-in</p>
            </div>
            <button
              type="button"
              onClick={resetData}
              className="px-3.5 py-1.5 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-300 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Cache</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
