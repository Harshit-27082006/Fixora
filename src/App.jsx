import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { LandingPage } from './pages/LandingPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { ReportComplaint } from './pages/ReportComplaint';
import { MyComplaints } from './pages/MyComplaints';
import { ComplaintDetails } from './pages/ComplaintDetails';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminComplaints } from './pages/AdminComplaints';
import { DeptDashboard } from './pages/DeptDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

function AppContent() {
  const { activePage, toastMessage, currentUser, navigateTo } = useApp();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // If on landing page, show landing page without app frame
  if (activePage === 'landing') {
    return <LandingPage />;
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'student-dashboard':
        return <StudentDashboard />;
      case 'report':
        return <ReportComplaint />;
      case 'my-complaints':
        return <MyComplaints />;
      case 'complaint-details':
        return <ComplaintDetails />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'admin-complaints':
        return <AdminComplaints />;
      case 'dept-dashboard':
        return <DeptDashboard />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Global Navbar */}
      <Navbar onOpenNotifications={() => setNotificationsOpen(true)} />

      {/* Main Content Area with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenNotifications={() => setNotificationsOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderActivePage()}
        </main>
      </div>

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold">
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 text-brand-400 shrink-0" />}
            {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 tracking-tight">FIXORA</span>
            <span>— Campus Complaint Management System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => navigateTo('landing')} className="hover:text-brand-600 transition-colors">
              Landing Page
            </button>
            <span>•</span>
            <span>Report. Track. Resolve.</span>
            <span>•</span>
            <span>SLA Engine 2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
