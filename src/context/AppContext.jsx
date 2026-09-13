import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { USERS, DEPARTMENTS } from '../data/seedData';
import { analyzeComplaintText } from '../services/aiEngine';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => storageService.getCurrentUser());
  const [complaints, setComplaints] = useState(() => storageService.getComplaints());
  const [notifications, setNotifications] = useState(() => storageService.getNotifications());
  const [activePage, setActivePage] = useState('student-dashboard');
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync with localStorage on state changes
  useEffect(() => {
    storageService.saveComplaints(complaints);
  }, [complaints]);

  useEffect(() => {
    storageService.saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    storageService.setCurrentUser(currentUser);
  }, [currentUser]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const navigateTo = (page, complaintId = null) => {
    if (complaintId) {
      setSelectedComplaintId(complaintId);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchUser = (userId) => {
    const user = USERS.find(u => u.id === userId) || USERS[0];
    setCurrentUser(user);
    
    // Automatically steer to the appropriate dashboard
    if (user.role === 'admin') {
      setActivePage('admin-dashboard');
    } else if (user.role === 'department') {
      setActivePage('dept-dashboard');
    } else {
      setActivePage('student-dashboard');
    }
    showToast(`Switched view to ${user.name} (${user.role.toUpperCase()})`, 'info');
  };

  const switchRole = (role, departmentId = 'Electrical') => {
    if (role === 'admin') {
      const adminUser = USERS.find(u => u.role === 'admin') || USERS[1];
      setCurrentUser(adminUser);
      setActivePage('admin-dashboard');
      showToast('Switched to Admin Portal', 'info');
    } else if (role === 'department') {
      const deptUser = USERS.find(u => u.departmentId === departmentId) || USERS[2];
      setCurrentUser(deptUser);
      setActivePage('dept-dashboard');
      showToast(`Switched to Department Staff (${deptUser.departmentId})`, 'info');
    } else {
      const studentUser = USERS.find(u => u.role === 'student') || USERS[0];
      setCurrentUser(studentUser);
      setActivePage('student-dashboard');
      showToast('Switched to Student/Staff Portal', 'info');
    }
  };

  // Add new complaint
  const addComplaint = (formData) => {
    const nextNum = complaints.length + 101;
    const newId = `FX-2026-${String(nextNum).padStart(3, '0')}`;
    const timestamp = new Date().toISOString();

    const aiAnalysis = analyzeComplaintText(formData.title, formData.description);

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
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.rollNumber ? `Student (${currentUser.rollNumber})` : (currentUser.designation || 'Staff')
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
          description: `Logged by ${currentUser.name}. Queued for administrative triage.`,
          timestamp,
          actor: currentUser.name,
          actorRole: currentUser.role === 'student' ? 'Student' : 'Staff'
        }
      ],
      updates: []
    };

    setComplaints(prev => [newComplaint, ...prev]);

    // Create Notification for Admin
    const adminNotif = {
      id: `notif-${Date.now()}-adm`,
      userId: 'user_admin_1',
      role: 'admin',
      title: `New Ticket: ${newComplaint.title.slice(0, 35)}...`,
      message: `${currentUser.name} reported an issue in ${newComplaint.location}. Priority: ${newComplaint.priority}`,
      timestamp,
      complaintId: newId,
      read: false,
      type: 'new_ticket'
    };

    // Create Notification for Student
    const studentNotif = {
      id: `notif-${Date.now()}-stu`,
      userId: currentUser.id,
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

    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c;

      const newTimelineItem = {
        status: newStatus,
        title: `Status: ${newStatus}`,
        description: note || `Status transitioned to ${newStatus} by ${actor.name}.`,
        timestamp,
        actor: actor.name,
        actorRole: actor.role === 'admin' ? 'Admin' : (actor.role === 'department' ? 'Department' : 'Student')
      };

      const newUpdateItem = note ? {
        id: `up-${Date.now()}`,
        sender: actor.name,
        role: actor.designation || (actor.role === 'admin' ? 'Admin' : 'Staff'),
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

    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c;

      const newTimelineItem = {
        status: 'Assigned',
        title: `Assigned to ${department}`,
        description: note || `Dispatched to ${department} team by ${currentUser.name}.`,
        timestamp,
        actor: currentUser.name,
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
            description: `Priority updated to ${newPriority} by ${currentUser.name}.`,
            timestamp,
            actor: currentUser.name,
            actorRole: currentUser.role
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

    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c;
      const updateItem = {
        id: `up-${Date.now()}`,
        sender: currentUser.name,
        role: currentUser.designation || (currentUser.role === 'admin' ? 'Campus Admin' : (currentUser.role === 'department' ? `${c.assignedDepartment} Staff` : 'Student')),
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

  // Reset to seed data
  const resetData = () => {
    const res = storageService.resetAllData();
    setComplaints(res.complaints);
    setNotifications(res.notifications);
    setCurrentUser(res.currentUser);
    showToast('Demo data restored to initial state', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        switchRole,
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
