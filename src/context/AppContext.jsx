import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { storageService } from '../services/storageService';
import { dbService } from '../services/dbService';
import { DEPARTMENTS } from '../data/seedData';
import { analyzeComplaintText } from '../services/aiEngine';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => storageService.getAuthUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(storageService.getAuthUser()));
  const [complaints, setComplaints] = useState(() => dbService.getLocalComplaints());
  const [notifications, setNotifications] = useState(() => storageService.getNotifications());
  const [activePage, setActivePage] = useState(() => {
    const user = storageService.getAuthUser();
    if (!user) return 'login';
    if (user.role === 'admin') return 'admin-dashboard';
    return 'student-dashboard';
  });
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const currentUserRef = useRef(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const complaintsRef = useRef(complaints);
  useEffect(() => {
    complaintsRef.current = complaints;
  }, [complaints]);

  const showToast = useCallback((message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // 1. Initial Cloud Sync on application launch
  useEffect(() => {
    let isMounted = true;
    dbService.syncComplaintsFromCloud().then(latestComplaints => {
      if (isMounted && Array.isArray(latestComplaints) && latestComplaints.length > 0) {
        setComplaints(latestComplaints);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Realtime Synchronization via BroadcastChannel (multi-tab same machine)
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel('fixora_db_sync_channel');

    channel.onmessage = (event) => {
      const { type, payload } = event.data || {};
      if (type === 'COMPLAINT_ADDED') {
        setComplaints(prev => {
          if (prev.some(c => c.id === payload.id)) return prev;
          return [payload, ...prev];
        });

        // If admin is active in another tab, alert them immediately
        if (currentUserRef.current?.role === 'admin') {
          showToast(`New Ticket Received: ${payload.id}`, 'info');
        }
      } else if (type === 'COMPLAINT_UPDATED') {
        setComplaints(prev => prev.map(c => c.id === payload.id ? payload.complaint : c));
      }
    };

    return () => {
      channel.close();
    };
  }, [showToast]);

  // 3. Periodic Background Polling Sync (Cross-Device & Cross-Browser every 6 seconds)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const cloudComplaints = await dbService.syncComplaintsFromCloud();
        if (!cloudComplaints || !Array.isArray(cloudComplaints)) return;

        const currentMap = new Map(complaintsRef.current.map(c => [c.id, c]));
        let hasNew = false;
        let hasUpdates = false;

        for (const cloudC of cloudComplaints) {
          const localC = currentMap.get(cloudC.id);
          if (!localC) {
            hasNew = true;
            // Notify Admin of newly detected ticket
            if (currentUserRef.current?.role === 'admin') {
              const newNotif = {
                id: `notif-${Date.now()}-adm-live`,
                userId: currentUserRef.current.id,
                role: 'admin',
                title: `New Ticket: ${cloudC.title.slice(0, 32)}...`,
                message: `${cloudC.reportedBy?.name || 'Student'} reported an issue in ${cloudC.location}. Priority: ${cloudC.priority}`,
                timestamp: cloudC.createdAt || new Date().toISOString(),
                complaintId: cloudC.id,
                read: false,
                type: 'new_ticket'
              };
              setNotifications(prev => [newNotif, ...prev]);
            }
          } else if (localC.status !== cloudC.status || localC.updatedAt !== cloudC.updatedAt) {
            hasUpdates = true;
            // Notify Student if their complaint changed status
            if (currentUserRef.current?.role === 'student' && cloudC.reportedBy?.id === currentUserRef.current.id) {
              const statusNotif = {
                id: `notif-${Date.now()}-stu-live`,
                userId: currentUserRef.current.id,
                role: 'student',
                title: `Update on ${cloudC.id}: ${cloudC.status}`,
                message: `Status transitioned to "${cloudC.status}".`,
                timestamp: new Date().toISOString(),
                complaintId: cloudC.id,
                read: false,
                type: 'progress'
              };
              setNotifications(prev => [statusNotif, ...prev]);
            }
          }
        }

        if (hasNew || hasUpdates) {
          setComplaints(cloudComplaints);
        }
      } catch (e) {
        // Silent sync failure
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Sync notifications to storage
  useEffect(() => {
    storageService.saveNotifications(notifications);
  }, [notifications]);

  // Authenticate user with role-based validation
  const login = async (role, identifier, password, remember = true) => {
    setIsSyncing(true);
    try {
      const res = await dbService.authenticate(role, identifier, password);
      if (!res.success) {
        setIsSyncing(false);
        return { success: false, message: res.message };
      }

      const user = res.user;
      setCurrentUser(user);
      setIsAuthenticated(true);
      storageService.setAuthUser(user, remember);

      // Route immediately based on verified role
      if (user.role === 'admin') {
        setActivePage('admin-dashboard');
      } else {
        setActivePage('student-dashboard');
      }

      showToast(`Welcome, ${user.name}`, 'success');
      setIsSyncing(false);
      return { success: true, user };
    } catch (err) {
      setIsSyncing(false);
      return { success: false, message: err.message || 'Authentication service error' };
    }
  };

  // Register a new student account
  const registerStudent = async (studentData) => {
    setIsSyncing(true);
    try {
      const newUser = await dbService.registerStudent(studentData);
      // Automatically authenticate the newly registered student
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      storageService.setAuthUser(newUser, true);
      setActivePage('student-dashboard');
      showToast(`Account created successfully! Welcome, ${newUser.name}`, 'success');
      setIsSyncing(false);
      return { success: true, user: newUser };
    } catch (err) {
      setIsSyncing(false);
      return { success: false, message: err.message };
    }
  };

  // Sign out cleanly
  const logout = () => {
    storageService.clearAuthUser();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActivePage('login');
    setSelectedComplaintId(null);
    showToast('Signed out of campus portal.', 'info');
  };

  // Role-guarded page navigation
  const navigateTo = (page, complaintId = null) => {
    if (!isAuthenticated && page !== 'login') {
      setActivePage('login');
      return;
    }

    // Role-based protection: Students CANNOT access admin views
    if (currentUser?.role === 'student') {
      if (['admin-dashboard', 'admin-complaints'].includes(page)) {
        setActivePage('student-dashboard');
        showToast('Access restricted: administrative authorization required', 'error');
        return;
      }
    } else if (currentUser?.role === 'admin') {
      // Admins should not access student submission or personal list
      if (['student-dashboard', 'my-complaints'].includes(page)) {
        setActivePage('admin-dashboard');
        return;
      }
    }

    if (complaintId) {
      setSelectedComplaintId(complaintId);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Add new complaint with GPS coordinates and Cloud Persistence
  const addComplaint = async (formData) => {
    const nextNum = complaints.length + 101;
    const year = new Date().getFullYear();
    const newId = `FX-${year}-${String(nextNum).padStart(3, '0')}`;
    const timestamp = new Date().toISOString();

    const aiAnalysis = analyzeComplaintText(formData.title, formData.description);

    const reporterObj = currentUser || {
      id: 'stu_guest',
      name: 'Registered Student',
      email: 'student@campus.edu',
      role: 'student',
      studentId: 'CS-2023-042',
      rollNumber: 'CS-2023-042'
    };

    const newComplaint = {
      id: newId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category || aiAnalysis.suggestedCategory,
      assignedDepartment: formData.assignedDepartment || aiAnalysis.suggestedDepartment || 'Maintenance',
      location: formData.location.trim() || 'Main Campus',
      // Store GPS coordinates if user permitted location access
      coordinates: formData.coordinates || null,
      priority: formData.priority || aiAnalysis.suggestedPriority,
      status: 'Submitted',
      reportedBy: {
        id: reporterObj.id,
        name: reporterObj.name,
        email: reporterObj.email,
        role: reporterObj.role === 'student' ? `Student (${reporterObj.rollNumber || reporterObj.studentId || 'Enrolled'})` : (reporterObj.designation || 'Campus Member'),
        studentId: reporterObj.studentId || reporterObj.rollNumber || 'STU'
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
          description: `Logged by ${reporterObj.name}. Queued for administrative review.${formData.coordinates ? ` (GPS Verified: ${formData.coordinates.lat.toFixed(4)}, ${formData.coordinates.lng.toFixed(4)})` : ''}`,
          timestamp,
          actor: reporterObj.name,
          actorRole: reporterObj.role === 'student' ? 'Student' : 'Campus Member'
        }
      ],
      updates: []
    };

    // Save to database
    await dbService.addComplaint(newComplaint);
    setComplaints(prev => [newComplaint, ...prev.filter(c => c.id !== newId)]);

    // Notifications
    const adminNotif = {
      id: `notif-${Date.now()}-adm`,
      userId: 'admin_central_01',
      role: 'admin',
      title: `New Ticket: ${newComplaint.title.slice(0, 32)}...`,
      message: `${reporterObj.name} reported an issue in ${newComplaint.location}. Priority: ${newComplaint.priority}`,
      timestamp,
      complaintId: newId,
      read: false,
      type: 'new_ticket'
    };

    const studentNotif = {
      id: `notif-${Date.now()}-stu`,
      userId: reporterObj.id,
      role: 'student',
      title: `Complaint Logged: ${newId}`,
      message: `Your complaint has been submitted and permanently recorded.`,
      timestamp,
      complaintId: newId,
      read: false,
      type: 'created'
    };

    setNotifications(prev => [adminNotif, studentNotif, ...prev]);
    showToast(`Complaint ${newId} recorded and saved to database!`, 'success');
    return newComplaint;
  };

  // 5. Update Status & Timeline with Cloud Persistence
  const updateComplaintStatus = async (id, newStatus, note = '', actor = currentUser) => {
    const timestamp = new Date().toISOString();
    const actorObj = actor || currentUser || { name: 'Campus Administrator', role: 'admin' };

    let updatedRecord = null;

    const newTimelineItem = {
      status: newStatus,
      title: `Status: ${newStatus}`,
      description: note || `Status transitioned to ${newStatus} by ${actorObj.name}.`,
      timestamp,
      actor: actorObj.name,
      actorRole: actorObj.role === 'admin' ? 'Admin' : (actorObj.role === 'department' ? 'Department Staff' : 'Student')
    };

    const newUpdateItem = note ? {
      id: `up-${Date.now()}`,
      sender: actorObj.name,
      role: actorObj.designation || (actorObj.role === 'admin' ? 'Campus Admin' : 'Staff'),
      message: note,
      timestamp
    } : null;

    await dbService.updateComplaint(id, c => {
      const updated = {
        ...c,
        status: newStatus,
        updatedAt: timestamp,
        timeline: [...(c.timeline || []), newTimelineItem],
        updates: newUpdateItem ? [...(c.updates || []), newUpdateItem] : (c.updates || [])
      };
      updatedRecord = updated;
      return updated;
    });

    setComplaints(prev => prev.map(c => c.id === id ? updatedRecord : c));

    // Notify Student
    if (updatedRecord?.reportedBy?.id) {
      const notif = {
        id: `notif-${Date.now()}`,
        userId: updatedRecord.reportedBy.id,
        role: 'student',
        title: `Update on ${id}: ${newStatus}`,
        message: note || `Your complaint status has been updated to "${newStatus}".`,
        timestamp,
        complaintId: id,
        read: false,
        type: newStatus === 'Resolved' ? 'resolved' : 'progress'
      };
      setNotifications(prev => [notif, ...prev]);
    }

    showToast(`Ticket ${id} status updated to "${newStatus}"`, 'success');
  };

  // 6. Assign Department with Cloud Persistence
  const assignDepartment = async (id, department, note = '') => {
    const timestamp = new Date().toISOString();
    const actorName = currentUser?.name || 'Campus Administrator';

    let updatedRecord = null;

    const newTimelineItem = {
      status: 'Assigned',
      title: `Assigned to ${department}`,
      description: note || `Dispatched to ${department} team by ${actorName}.`,
      timestamp,
      actor: actorName,
      actorRole: 'Admin'
    };

    await dbService.updateComplaint(id, c => {
      const updated = {
        ...c,
        assignedDepartment: department,
        status: c.status === 'Submitted' ? 'Assigned' : c.status,
        updatedAt: timestamp,
        timeline: [...(c.timeline || []), newTimelineItem]
      };
      updatedRecord = updated;
      return updated;
    });

    setComplaints(prev => prev.map(c => c.id === id ? updatedRecord : c));

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

  // 7. Update Priority with Cloud Persistence
  const updatePriority = async (id, newPriority) => {
    const timestamp = new Date().toISOString();
    const actorName = currentUser?.name || 'Campus Administrator';

    let updatedRecord = null;

    await dbService.updateComplaint(id, c => {
      const updated = {
        ...c,
        priority: newPriority,
        updatedAt: timestamp,
        timeline: [
          ...(c.timeline || []),
          {
            status: c.status,
            title: `Priority Changed: ${newPriority}`,
            description: `Priority modified to ${newPriority} by ${actorName}.`,
            timestamp,
            actor: actorName,
            actorRole: currentUser?.role || 'admin'
          }
        ]
      };
      updatedRecord = updated;
      return updated;
    });

    setComplaints(prev => prev.map(c => c.id === id ? updatedRecord : c));
    showToast(`Priority for ${id} adjusted to ${newPriority}`, 'info');
  };

  // 8. Add Live Support/Response Note with Cloud Persistence
  const addComplaintResponse = async (id, message) => {
    if (!message.trim()) return;
    const timestamp = new Date().toISOString();
    const senderName = currentUser?.name || 'Campus Member';
    const senderRole = currentUser?.designation || (currentUser?.role === 'admin' ? 'Campus Admin' : (currentUser?.role === 'department' ? 'Department Staff' : 'Student'));

    const updateItem = {
      id: `up-${Date.now()}`,
      sender: senderName,
      role: senderRole,
      message: message.trim(),
      timestamp
    };

    let updatedRecord = null;

    await dbService.updateComplaint(id, c => {
      const updated = {
        ...c,
        updatedAt: timestamp,
        updates: [...(c.updates || []), updateItem]
      };
      updatedRecord = updated;
      return updated;
    });

    setComplaints(prev => prev.map(c => c.id === id ? updatedRecord : c));
    showToast('Response note posted and saved', 'success');
  };

  // Satisfaction rating
  const rateSatisfaction = async (id, rating, feedback) => {
    let updatedRecord = null;
    await dbService.updateComplaint(id, c => {
      const updated = {
        ...c,
        satisfactionRating: rating,
        resolutionFeedback: feedback
      };
      updatedRecord = updated;
      return updated;
    });
    setComplaints(prev => prev.map(c => c.id === id ? updatedRecord : c));
    showToast('Thank you for your feedback!', 'success');
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const resetData = () => {
    const res = storageService.resetAllData();
    setComplaints(res.complaints);
    setNotifications(res.notifications);
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActivePage('login');
    showToast('Local cache reset to initial state', 'info');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      isAuthenticated,
      complaints,
      notifications,
      activePage,
      selectedComplaintId,
      toastMessage,
      isSyncing,
      showToast,
      login,
      registerStudent,
      logout,
      navigateTo,
      addComplaint,
      updateComplaintStatus,
      assignDepartment,
      updatePriority,
      addComplaintResponse,
      rateSatisfaction,
      markNotificationAsRead,
      markAllNotificationsRead,
      resetData
    }}>
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
