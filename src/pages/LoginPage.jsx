import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wrench, 
  Lock, 
  Mail,
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
  GraduationCap,
  ShieldAlert,
  UserPlus,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

export function LoginPage() {
  const { login, registerStudent } = useApp();

  // Mode & Role State
  const [role, setRole] = useState('student'); // 'student' | 'admin'
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Login Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Registration Form State (Student only)
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMessage('');
    setSuccessMessage('');
    if (newRole === 'admin') {
      setIsRegisterMode(false); // Admin self-registration is strictly prohibited
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim()) {
      setErrorMessage(role === 'admin' ? 'Please enter your Institutional Admin Email.' : 'Please enter your College Email or Student ID.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your portal password.');
      return;
    }

    setIsSubmitting(true);
    const res = await login(role, identifier.trim(), password, rememberMe);
    if (!res.success) {
      setErrorMessage(res.message || 'Authentication failed. Please verify your credentials.');
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim() || !studentId.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Please fill in all required registration fields.');
      return;
    }

    if (regPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const res = await registerStudent({
      fullName: fullName.trim(),
      studentId: studentId.trim(),
      email: regEmail.trim(),
      password: regPassword
    });

    if (!res.success) {
      setErrorMessage(res.message || 'Registration failed.');
      setIsSubmitting(false);
    }
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
            <span className="hidden sm:inline">Official Institutional ERP Gateway</span>
          </div>
        </div>
      </header>

      {/* Main Login / Register Body */}
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
                  Unified institutional grievance and infrastructure maintenance platform for lecture halls, laboratories, hostels, electricity, internet, and campus transit.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <FileCheck2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Persistent Cloud Tracking</strong>
                    <span className="text-slate-400 text-[11px]">Real-time synchronization across devices with 5-stage SLA progression audit.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Intelligent Department Routing</strong>
                    <span className="text-slate-400 text-[11px]">Automated AI triage and technician assignment for accelerated resolution.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 relative z-10">
              <p>University IT Helpdesk: <strong className="text-slate-300 font-mono">support@campus.edu</strong> • Ext: 4100</p>
            </div>
          </div>

          {/* Right Column: Portal Login / Register Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
            
            {/* Header Text */}
            <div className="space-y-1.5 mb-5">
              <div className="lg:hidden flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                Campus ERP Portal
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {isRegisterMode ? 'Create Student ERP Account' : 'Campus Portal Sign-In'}
              </h2>
              <p className="text-xs text-slate-500">
                {isRegisterMode 
                  ? 'Register your student credentials to submit and monitor campus complaints.'
                  : (role === 'admin' 
                      ? 'Secure administrative gateway for university officials and facility heads.' 
                      : 'Enter your institutional email or enrollment number to access the student portal.')}
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Select Portal Access Level
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleRoleChange('student')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    role === 'student'
                      ? 'bg-white text-brand-700 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-brand-600" />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    role === 'admin'
                      ? 'bg-white text-amber-800 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Admin</span>
                </button>
              </div>

              {/* Admin Security Advisory Banner */}
              {role === 'admin' && (
                <div className="mt-2.5 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Restricted Administrator Access:</strong> Requires authenticated university administration credentials. Public registration for administrative accounts is strictly prohibited.
                  </span>
                </div>
              )}
            </div>

            {/* Error / Success Feedback */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form View 1: STUDENT REGISTRATION FORM */}
            {isRegisterMode && role === 'student' ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g., Rahul Verma"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800 bg-slate-50/50 hover:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Student ID / Roll No. <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g., 2024CS089"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800 bg-slate-50/50 hover:bg-white transition-colors uppercase font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      College Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="student@campus.edu"
                        className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800 bg-slate-50/50 hover:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full px-3 pr-8 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800 bg-slate-50/50 hover:bg-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800 bg-slate-50/50 hover:bg-white transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-60 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 mt-3"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isSubmitting ? 'Creating Account...' : 'Register Student Account'}</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsRegisterMode(false); setErrorMessage(''); }}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-800 hover:underline"
                  >
                    Already have an account? Sign In
                  </button>
                </div>
              </form>
            ) : (
              /* Form View 2: STANDARD LOGIN FORM (Student or Admin) */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email / ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    {role === 'admin' ? 'Institutional Admin Email' : 'Email ID / Student ID'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      {role === 'admin' ? <ShieldCheck className="w-4 h-4 text-amber-600" /> : <User className="w-4 h-4" />}
                    </div>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={role === 'admin' ? 'admin@campus.edu or provost@campus.edu' : 'Enter College Email or Enrollment No.'}
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
                      placeholder="Enter portal password"
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
                  className={`w-full py-2.5 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2 ${
                    role === 'admin'
                      ? 'bg-amber-700 hover:bg-amber-800 active:bg-amber-900 shadow-amber-600/20'
                      : 'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-brand-500/20'
                  }`}
                >
                  <span>{isSubmitting ? 'Authenticating...' : (role === 'admin' ? 'Authenticate as Administrator' : 'Login to Student Portal')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Create New Account Button for Students */}
                {role === 'student' && (
                  <div className="pt-3 text-center border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => { setIsRegisterMode(true); setErrorMessage(''); }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-800 hover:underline"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Create New Student Account</span>
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* Institutional Security Notice */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p>
                Authorized access only. All login attempts, ticket submissions, and administrative dispatches are permanently audited under the University IT Security & Governance Policy.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-500 border-t border-slate-800 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>FIXORA — Campus Complaint Management System</span>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Official College ERP Service</span>
            <span>•</span>
            <span>Protected by Role-Based Access Control</span>
          </div>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-brand-50 text-brand-700">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Credential Reset Assistance</h3>
                  <span className="text-[11px] text-slate-500">University IT Services</span>
                </div>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                To reset your institutional account password, please follow the official campus procedure:
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-brand-600">1.</span>
                  <span><strong>Student Accounts:</strong> Contact the Examination & IT Registrar cell at <code className="bg-white px-1.5 py-0.5 rounded border text-[11px]">ithelpdesk@campus.edu</code> with your College ID card.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-brand-600">2.</span>
                  <span><strong>Administrative Officers:</strong> Authorization key reset requires approval from the Office of the Registrar.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
