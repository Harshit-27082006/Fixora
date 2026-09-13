import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { USERS, DEPARTMENTS } from '../data/seedData';
import { 
  Wrench, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  AlertTriangle,
  Building,
  ChevronRight,
  BarChart3,
  Flame
} from 'lucide-react';

export function LandingPage() {
  const { switchUser, navigateTo } = useApp();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState('student');

  // Simulated Login Form State
  const [email, setEmail] = useState('aarav.sharma@campus.edu');
  const [password, setPassword] = useState('demo1234');
  const [campusRole, setCampusRole] = useState('student');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (campusRole === 'admin') {
      switchUser('user_admin_1');
    } else if (campusRole === 'department') {
      switchUser('user_dept_elec');
    } else {
      switchUser('user_student_1');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white">
      {/* Top Banner */}
      <div className="border-b border-slate-800 bg-slate-950/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Wrench className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">FIXORA</span>
              <span className="ml-2 text-xs font-semibold text-brand-400">Campus System</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                switchUser('user_admin_1');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Admin Demo
            </button>
            <button
              onClick={() => {
                switchUser('user_student_1');
              }}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/30 transition-all"
            >
              Launch Portal →
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left copy */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Next-Gen Campus Facilities & Issue Resolution</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Report. Track. <br />
                <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  Resolve Seamlessly.
                </span>
              </h1>
              <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                Fixora bridges students, administrators, and campus maintenance departments into a single unified operating system with real-time tracking and automated triage.
              </p>
            </div>

            {/* Live Metrics Row */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur">
                <div className="text-2xl font-black text-white">45m</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Avg First Dispatch</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur">
                <div className="text-2xl font-black text-emerald-400">98.4%</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">SLA Compliance</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur">
                <div className="text-2xl font-black text-brand-300">9 Facilities</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Departments Synced</div>
              </div>
            </div>

            {/* Quick Demo Access Bar */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                ⚡ Instant 1-Click Role Access for Evaluators
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => switchUser('user_student_1')}
                  className="p-3.5 rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/70 hover:to-brand-900/60 border border-slate-700 hover:border-brand-500/50 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white group-hover:text-brand-300">Student Portal</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-brand-400 transition-all" />
                  </div>
                  <div className="text-[11px] text-slate-400">Aarav Sharma (CSE)</div>
                  <div className="text-[10px] text-brand-400 mt-1 font-semibold">Report & track issues</div>
                </button>

                <button
                  onClick={() => switchUser('user_admin_1')}
                  className="p-3.5 rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/70 hover:to-brand-900/60 border border-slate-700 hover:border-brand-500/50 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white group-hover:text-brand-300">Campus Admin</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-brand-400 transition-all" />
                  </div>
                  <div className="text-[11px] text-slate-400">Dr. Sunita Mehra</div>
                  <div className="text-[10px] text-amber-400 mt-1 font-semibold">Triage & dispatch</div>
                </button>

                <button
                  onClick={() => switchUser('user_dept_elec')}
                  className="p-3.5 rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/70 hover:to-brand-900/60 border border-slate-700 hover:border-brand-500/50 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white group-hover:text-brand-300">Department</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-brand-400 transition-all" />
                  </div>
                  <div className="text-[11px] text-slate-400">Rajesh Rao (Electrical)</div>
                  <div className="text-[10px] text-emerald-400 mt-1 font-semibold">Work queue & fixes</div>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Interactive Login Card */}
          <div className="lg:col-span-5">
            <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-7 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {isRegisterMode ? 'Register Campus Account' : 'Campus Portal Sign-In'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select your credentials or use quick demo presets
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  FX
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Role Switch Tabs */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Login Role
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setCampusRole('student');
                        setEmail('aarav.sharma@campus.edu');
                      }}
                      className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                        campusRole === 'student'
                          ? 'bg-white text-brand-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCampusRole('admin');
                        setEmail('dean.admin@campus.edu');
                      }}
                      className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                        campusRole === 'admin'
                          ? 'bg-white text-brand-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCampusRole('department');
                        setEmail('rajesh.electrical@campus.edu');
                      }}
                      className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                        campusRole === 'department'
                          ? 'bg-white text-brand-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Dept Staff
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institutional Email ID
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-brand-600 focus:ring-brand-500" />
                    <span>Remember session</span>
                  </label>
                  <span className="text-brand-600 hover:underline cursor-pointer">
                    Need help?
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In as {campusRole.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors"
                >
                  {isRegisterMode 
                    ? 'Already have an account? Sign in here' 
                    : "Don't have an institutional login? Register new account"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-16 pt-12 border-t border-slate-800/80">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-black text-white">Full Lifecycle Complaint Resolution</h2>
            <p className="text-sm text-slate-400 mt-1.5">
              Designed specifically for multi-building university campuses and colleges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/40 text-brand-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">AI Smart Triage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Auto-classifies categories, scores urgency risks, flags safety hazards, and detects duplicate complaints in the same location.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">5-Stage Status Timeline</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time milestone progression from Submitted through Review, Dispatch, In Progress to Resolution with timestamped audit trails.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-4">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">9 Connected Departments</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct assignment to Electrical, IT/Internet, Hostel, Cleanliness, Transport, Lab, Classroom, and Maintenance work queues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
