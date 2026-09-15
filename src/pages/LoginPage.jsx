import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wrench, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  AlertCircle,
  HelpCircle,
  X,
  FileCheck2,
  Clock,
  ExternalLink
} from 'lucide-react';

export function LoginPage() {
  const { login } = useApp();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!userId.trim()) {
      setErrorMessage('Please enter your User ID or Enrollment Number.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your portal password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = login(userId.trim(), password.trim(), rememberMe);
      if (!res.success) {
        setErrorMessage(res.message || 'Invalid institutional credentials.');
        setIsSubmitting(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      {/* Background Decorative Patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Institutional Header */}
      <header className="relative z-10 border-b border-slate-800 bg-slate-950/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Wrench className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">FIXORA</span>
              <span className="ml-2 text-xs font-semibold text-slate-400 hidden sm:inline border-l border-slate-700 pl-2">
                Campus Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Official University ERP Gateway</span>
          </div>
        </div>
      </header>

      {/* Main Login Body */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-800/20">
          
          {/* Left Column: Institutional Information Banner (Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-8 flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-400/30 text-brand-300 text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Enterprise Resource Planning</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-black tracking-tight text-white leading-snug">
                  Campus Complaint Management System
                </h1>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Single integrated grievance and maintenance portal for classrooms, laboratories, hostels, power systems, internet, and transport facilities.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <FileCheck2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">End-to-End Tracking</strong>
                    <span className="text-slate-400 text-[11px]">Real-time 5-stage lifecycle progression with timestamped resolution audit logs.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">SLA-Guaranteed Dispatch</strong>
                    <span className="text-slate-400 text-[11px]">Direct automated routing to designated campus maintenance departments.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 relative z-10">
              <p>For technical inquiries or system assistance, contact University IT Services at <strong className="text-slate-300 font-mono">support@campus.edu</strong>.</p>
            </div>
          </div>

          {/* Right Column: ERP Login Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
            <div className="space-y-2 mb-6">
              <div className="lg:hidden flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                Campus ERP Portal
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Institutional Portal Sign-In
              </h2>
              <p className="text-xs text-slate-500">
                Enter your registered User ID or Student Enrollment Number to access your campus dashboard.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User ID / Enrollment Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  User ID / Enrollment Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter User ID or Enrollment No."
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Password Field with Show/Hide Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your portal password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Session */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500"
                  />
                  <span>Keep me signed in on this workstation</span>
                </label>
              </div>

              {/* Login Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-60 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Login to Campus Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Institutional Security Notice */}
            <div className="mt-8 pt-5 border-t border-slate-100 flex items-start gap-2.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p>
                Authorized access only. All login events, complaint records, and status modifications are audited under the university institutional IT security policy.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/60 py-3 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>FIXORA — Campus Complaint Management System</span>
          <span className="text-slate-600">Enterprise Resource Planning • University Facilities</span>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900">
                <HelpCircle className="w-5 h-5 text-brand-600" />
                <h3 className="text-sm font-bold">Credential Recovery</h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                In accordance with institutional security guidelines, password resets must be verified through the Central IT Directorate or your department administrator.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <strong className="text-slate-800 block">Procedure to Reset Credentials:</strong>
                <ul className="list-disc list-inside space-y-1 text-slate-500">
                  <li>Visit the Campus Computer Centre (Admin Block, Room 102).</li>
                  <li>Present your physical student or faculty identity card.</li>
                  <li>Or submit an authorized ticket to <strong className="text-brand-600">it-support@campus.edu</strong> from your registered university email.</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
