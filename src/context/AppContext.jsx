import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { USERS, DEPARTMENTS } from '../data/seedData';
import { analyzeComplaintText } from '../services/aiEngine';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => storageService.getAuthUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(storageService.getAuthUser()));
  const [complaints, setComplaints] = useState(() => storageService.getComplaints());
  const [notifications, setNotifications] = useState(() => storageService.getNotifications());
  const [activePage, setActivePage] = useState(() => {
    const user = storageService.getAuthUser();
    if (!user) return 'login';
    if (user.role === 'admin') return 'admin-dashboard';
    if (user.role === 'department') return 'dept-dashboard';
    return 'student-dashboard';
  });
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync with localStorage on state changes
  useEffect(() => {
    storageService.saveComplaints(complaints);
  }, [complaints]);

  useEffect(() => {
    storageService.saveNotifications(notifications);
  }, [notifications]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const login = (userId, password, remember = true) => {
    if (!userId || !password) {
      return { success: false, message: 'Please enter both User ID and password.' };
    }

    const lowerId = userId.toLowerCase().trim();
    let userToAuth = null;
    let targetPage = 'student-dashboard';

    // Role-based authentication lookup
    if (lowerId.includes('admin') || lowerId === 'dean') {
      userToAuth = USERS.find(u => u.role === 'admin') || USERS[1];
      targetPage = 'admin-dashboard';
    } else if (lowerId.includes('elec') || lowerId === 'electrical') {
      userToAuth = USERS.find(u => u.departmentId === 'Electrical') || USERS[2];
      targetPage = 'dept-dashboard';
    } else if (lowerId.includes('net') || lowerId.includes('it')) {
      userToAuth = USERS.find(u => u.departmentId === 'IT / Internet') || USERS[3];
      targetPage = 'dept-dashboard';
    } else if (lowerId.includes('hostel') || lowerId.includes('warden')) {
      userToAuth = USERS.find(u => u.departmentId === 'Hostel') || USERS[4];
      targetPage = 'dept-dashboard';
    } else if (lowerId.includes('dept') || lowerId.includes('staff')) {
      userToAuth = USERS.find(u => u.role === 'department') || USERS[2];
      targetPage = 'dept-dashboard';
    } else {
      // Default: Student with enrollment verification
      userToAuth = USERS.find(u => u.role === 'student') || USERS[0];
      targetPage = 'student-dashboard';
    }

    setCurrentUser(userToAuth);
    setIsAuthenticated(true);
    storageService.setAuthUser(userToAuth, remember);
    setActivePage(targetPage);
    showToast(`Welcome back, ${userToAuth.name}`, 'success');

    return { success: true, user: userToAuth };
  };

  const logout = () => {
    storageService.clearAuthUser();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActivePage('login');
    setSelectedComplaintId(null);
    showToast('Signed out of campus portal.', 'info');
  };

  const navigateTo = (page, complaintId = null) => {
    // If not authenticated, always route to login
    if (!isAuthenticated && page !== 'login') {
      setActivePage('login');
      return;
    }

    // Role-based routing protection
    if (currentUser?.role === 'student') {
      if (['admin-dashboard', 'admin-complaints', 'dept-dashboard'].includes(page)) {
        setActivePage('student-dashboard');
        showToast('Access restricted: administrative credentials required', 'error');
        return;
      }
    } else if (currentUser?.role === 'department') {
      if (['admin-dashboard'].includes(page)) {
        setActivePage('dept-dashboard');
        return;
      }
    }

    if (complaintId) {
      setSelectedComplaintId(complaintId);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add new complaint
  const addComplaint = (formData) => {
    const nextNum = complaints.length + 101;
    const newId = `FX-2026-${String(nextNum).padStart(3, '0')}`;
    const timestamp = new Date().toISOString();

    const aiAnalysis = analyzeComplaintText(formData.title, formData.description);

    const reporterObj = currentUser || {
      id: 'student_portal',
      name: 'Registered Student',
      email: 'student@campus.edu',
      role: 'Student'
    };

    const newComplaint = {
      id: newId,
      title: formData.title,
      description: formData.description,
      category: formData.category || aiAnalysis.suggestedCategory,
      assignedDepartment: formData.assignedDepartment || aiAnalysis.suggestedDepartment || 'Maintenance',
      location: formData.location || 'Main Campus',
      priority: formData.priority || aiAnalysis.suggestedPriority,
      status: 'Submitted',
      reportedBy: {
        id: reporterObj.id,
        name: reporterObj.name,
        email: reporterObj.email,
        role: reporterObj.rollNumber ? `Student (${reporterObj.rollNumber})` : (reporterObj.designation || 'Campus Member')
      },
      createdAt: timestamp,
      updatedAt: timestamp,
      imageUrl: formData.imageUrl || null,
      aiSummary: formData.aiSummary || aiAnalysis.shortSummary,
      aiConfidence: aiAnalysis.confidence / 100,
      riskExplanation: aiAnalysis.riskExplanation,
      timeline: [
        {
          status: 'Submitted',
          title: 'Complaint Logged',
          description: `Logged by ${reporterObj.name}. Queued for administrative triage.`,
          timestamp,
          actor: reporterObj.name,
          actorRole: reporterObj.role === 'student' ? 'Student' : 'Campus Member'
        }
      ],
      updates: []
    };

    setComplaints(prev => [newComplaint, ...prev]);

    // Notification for Admin
    const adminNotif = {
      id: `notif-${Date.now()}-adm`,
      userId: 'user_admin_1',
      role: 'admin',
      title: `New Ticket: ${newComplaint.title.slice(0, 35)}...`,
      message: `${reporterObj.name} reported an issue in ${newComplaint.location}. Priority: ${newComplaint.priority}`,
      timestamp,
      complaintId: newId,
      read: false,
      type: 'new_ticket'
    };

    // Notification for Student
    const studentNotif = {
      id: `notif-${Date.now()}-stu`,
      userId: reporterObj.id,
      role: 'student',
      title: `Complaint Logged: ${newId}`,
      message: `Your complaint "${newComplaint.title.slice(0, 35)}..." has been recorded successfully.`,
      timestamp,
      complaintId: newId,
      read: false,
      type: 'created'
    };

    setNotifications(prev => [adminNotif, studentNotif, ...prev]);
    showToast(`Complaint ${newId} created successfully!`, 'success');
    return newComplaint;
  };

  // Update Status & Audit Timeline
  const updateComplaintStatus = (id, newStatus, note = '', actor = currentUser) => {
    const timestamp = new Date().toISOString();
    let updatedComplaint = null;
    const actorObj = actor || { name: 'Campus Administrator', role: 'admin' };

    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c;

      const newTimelineItem = {
        status: newStatus,
        title: `Status: ${newStatus}`,
        description: note || `Status transitioned to ${newStatus} by ${actorObj.name}.`,
        timestamp,
        actor: actorObj.name,
        actorRole: actorObj.role === 'admin' ? 'Admin' : (actorObj.role === 'department' ? 'Department' : 'Student')
      };

      const newUpdateItem = note ? {
        id: `up-${Date.now()}`,
        sender: actorObj.name,
        role: actorObj.designation || (actorObj.role === 'admin' ? 'Admin' : 'Staff'),
        message: note,
        timestamp
      } : null;

      const updated = {
        ...c,
        status: newStatus,
        updatedAt: timestamp,
        timeline: [...c.timeline, newTimelineItem],
        updates: newUpdateItem ? [...c.updates, newUpdateItem] : c.updates
      };
      updatedComplaint = updated;
      return updated;
    }));

    // Notify Reporter
    if (updatedComplaint) {
      const notif = {
        id: `notif-${Date.now()}`,
        userId: updatedComplaint.reportedBy.id,
        role: 'student',
        title: `Update on ${id}: ${newStatus}`,
        message: note || `Your complaint is now marked as "${newStatus}".`,
        timestamp,
        complaintId: id,
        read: false,
        type: newStatus === 'Resolved' ? 'resolved' : 'progress'
      };
      setNotifications(prev => [notif, ...prev]);
    }

    showToast(`Ticket ${id} status updated to "${newStatus}"`, 'success');
  };

  // Assign Department
  const assignDepartment = (id, department, note = '') => {
    const timestamp = new Date().toISOString();
    const actorName = currentUser?.name || 'Campus Administrator';

    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c;

      const newTimelineItem = {
        status: 'Assigned',
        title: `Assigned to ${department}`,
        description: note || `Dispatched to ${department} team by ${actorName}.`,
        timestamp,
        actor: actorName,
        actorRole: 'Admin'
      };

      return {
        ...c,
        assignedDepartment: department,
        status: c.status === 'Submitted' ? 'Assigned' : c.status,
        updatedAt: timestamp,
        timeline: [...c.timeline, newTimelineItem]
      };
    }));

    // Notification to Department
    const deptNotif = {
      id: `notif-${Date.now()}-dept`,
      role: 'department',
      title: `New Assignment: ${id}`,
      message: `Ticket ${id} has been routed to ${department}.`,
      timestamp,
      complaintId: id,
      read: false,
      type: 'assignment'
    };

    setNotifications(prev => [deptNotif, ...prev]);
    showToast(`Assigned ticket ${id} to ${department}`, 'success');
  };

  // Update Priority
  const updatePriority = (id, newPriority) => {
    const timestamp = new Date().toISOString();
    const actorName = currentUser?.name || 'Campus Administrator';
    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        priority: newPriority,
        updatedAt: timestamp,
        timeline: [
          ...c.timeline,
          {
            status: c.status,
            title: `Priority Changed: ${newPriority}`,
            description: `Priority updated to ${newPriority} by ${actorName}.`,
            timestamp,
            actor: actorName,
            actorRole: currentUser?.role || 'admin'
          }
        ]
      };
    }));
    showToast(`Priority for ${id} set to ${newPriority}`, 'info');
  };

  // Add Comment/Update
  const addComplaintResponse = (id, message) => {
    if (!message.trim()) return;
    const timestamp = new Date().toISOString();
    const senderName = currentUser?.name || 'Campus Member';
    const senderRole = currentUser?.designation || (currentUser?.role === 'admin' ? 'Campus Admin' : (currentUser?.role === 'department' ? 'Department Staff' : 'Student'));

    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c;
      const updateItem = {
        id: `up-${Date.now()}`,
        sender: senderName,
        role: senderRole,
        message: message.trim(),
        timestamp
      };
      return {
        ...c,
        updatedAt: timestamp,
        updates: [...c.updates, updateItem]
      };
    }));

    showToast('Response note posted', 'success');
  };

  // Rate Satisfaction
  const rateSatisfaction = (id, rating, feedback) => {
    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        satisfactionRating: rating,
        resolutionFeedback: feedback
      };
    }));
    showToast('Thank you for your feedback!', 'success');
  };

  // Mark Notifications
  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  // Reset local cache cleanly
  const resetData = () => {
    const res = storageService.resetAllData();
    setComplaints(res.complaints);
    setNotifications(res.notifications);
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActivePage('login');
    showToast('Workspace data restored to initial state', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        complaints,
        notifications,
        activePage,
        setActivePage,
        selectedComplaintId,
        setSelectedComplaintId,
        navigateTo,
        addComplaint,
        updateComplaintStatus,
        assignDepartment,
        updatePriority,
        addComplaintResponse,
        rateSatisfaction,
        markNotificationAsRead,
        markAllNotificationsRead,
        resetData,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
