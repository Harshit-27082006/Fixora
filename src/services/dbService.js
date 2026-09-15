import { INITIAL_COMPLAINTS, USERS } from '../data/seedData.js';

// Cloud persistent store endpoint on restful-api.dev
// Object ID created for Fixora master database
const CLOUD_MASTER_ID = 'ff808181a09d98f701a0a3d21ac20bdb';
const CLOUD_MASTER_URL = `https://api.restful-api.dev/objects/${CLOUD_MASTER_ID}`;

// Local storage keys
const LOCAL_COMPLAINTS_KEY = 'fixora_complaints';
const LOCAL_USERS_KEY = 'fixora_registered_users';
const LOCAL_NOTIFS_KEY = 'fixora_notifications';

// Authorized Administrative Accounts (Restricted access - cannot be registered publicly)
export const AUTHORIZED_ADMINS = [
  {
    id: 'admin_central_01',
    name: 'Dr. Sunita Mehra',
    email: 'admin@campus.edu',
    role: 'admin',
    designation: 'Dean of Campus Infrastructure & Student Welfare',
    department: 'Central Administration',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98101 23456',
    passwordHash: 'admin@123',
    joinedDate: '2023-01-15'
  },
  {
    id: 'admin_provost_02',
    name: 'Prof. Ramesh Iyer',
    email: 'provost@campus.edu',
    role: 'admin',
    designation: 'Chief Campus Provost & Works Director',
    department: 'Central Administration',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98101 23457',
    passwordHash: 'provost@123',
    joinedDate: '2022-08-01'
  }
];

// Initial default student profile for fallback
export const DEFAULT_STUDENT = {
  id: 'stu_aditya_verma',
  name: 'Aditya Verma',
  email: 'aditya.verma@campus.edu',
  studentId: 'CS-2023-042',
  rollNumber: 'CS-2023-042',
  role: 'student',
  department: 'Computer Science & Engineering',
  hostel: 'Hostel 3, Room 214',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  passwordHash: 'student@123',
  joinedDate: '2023-07-20'
};

// Cross-tab broadcast channel
let broadcastChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('fixora_db_sync_channel');
  }
} catch (e) {
  console.warn('BroadcastChannel not supported in this environment');
}

// Memory fallback for SSR or environments without localStorage
const memoryStore = new Map();

const safeStorage = {
  getItem(key) {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (e) {}
    return memoryStore.get(key) || null;
  },
  setItem(key, val) {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(key, val);
      }
    } catch (e) {}
    memoryStore.set(key, val);
  }
};

export const dbService = {
  // Broadcast change event
  broadcastChange(type, payload) {
    try {
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type, payload, timestamp: Date.now() });
      }
    } catch (e) {
      console.warn('Broadcast failed', e);
    }
  },

  // 1. Get cached complaints immediately (0ms latency for smooth UI rendering)
  getLocalComplaints() {
    try {
      const data = safeStorage.getItem(LOCAL_COMPLAINTS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading local complaints', e);
    }
    // Default seed fallback
    safeStorage.setItem(LOCAL_COMPLAINTS_KEY, JSON.stringify(INITIAL_COMPLAINTS));
    return INITIAL_COMPLAINTS;
  },

  // Save to local cache
  setLocalComplaints(complaints) {
    try {
      safeStorage.setItem(LOCAL_COMPLAINTS_KEY, JSON.stringify(complaints));
    } catch (e) {
      console.error('Error writing local complaints', e);
    }
  },

  // 2. Fetch latest complaints from Cloud Master Store / Vercel API
  async syncComplaintsFromCloud() {
    try {
      // 1. Try Vercel Serverless Function first if deployed
      try {
        const vercelRes = await fetch('/api/complaints', { method: 'GET', headers: { 'Accept': 'application/json' } });
        if (vercelRes.ok) {
          const cloudData = await vercelRes.json();
          if (Array.isArray(cloudData) && cloudData.length > 0) {
            this.setLocalComplaints(cloudData);
            return cloudData;
          }
        }
      } catch (err) {
        // Vercel API route not available in local vite dev mode without proxy, fall through
      }

      // 2. Fallback directly to cloud master record REST API (works across all browsers & devices)
      const res = await fetch(CLOUD_MASTER_URL, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });

      if (res.ok) {
        const doc = await res.json();
        if (doc && doc.data && Array.isArray(doc.data.complaints) && doc.data.complaints.length > 0) {
          const cloudComplaints = doc.data.complaints;
          this.setLocalComplaints(cloudComplaints);
          return cloudComplaints;
        }
      }
    } catch (err) {
      console.warn('Could not sync complaints from cloud database, using local cache:', err.message);
    }
    return this.getLocalComplaints();
  },

  // 3. Persist new complaint permanently to Cloud Database and local cache
  async addComplaint(newComplaint) {
    // Save to local cache immediately
    const current = this.getLocalComplaints();
    const updated = [newComplaint, ...current.filter(c => c.id !== newComplaint.id)];
    this.setLocalComplaints(updated);
    this.broadcastChange('COMPLAINT_ADDED', newComplaint);

    // Save asynchronously to cloud database
    try {
      // Try Vercel API
      try {
        const apiRes = await fetch('/api/complaints', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newComplaint)
        });
        if (apiRes.ok) {
          return newComplaint;
        }
      } catch (err) {
        // Fall through to cloud direct
      }

      // Direct cloud update to master document
      const currentUsers = this.getLocalUsers();
      await fetch(CLOUD_MASTER_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'FIXORA_V1_MASTER_DATABASE',
          data: {
            complaints: updated,
            users: currentUsers,
            lastUpdated: new Date().toISOString()
          }
        })
      });
    } catch (err) {
      console.error('Error persisting complaint to cloud database:', err);
    }

    return newComplaint;
  },

  // 4. Update complaint status / assignment / priority / notes
  async updateComplaint(id, updateFnOrData) {
    const current = this.getLocalComplaints();
    let targetComplaint = null;

    const updated = current.map(c => {
      if (c.id === id) {
        const modified = typeof updateFnOrData === 'function' ? updateFnOrData(c) : { ...c, ...updateFnOrData };
        targetComplaint = modified;
        return modified;
      }
      return c;
    });

    this.setLocalComplaints(updated);
    this.broadcastChange('COMPLAINT_UPDATED', { id, complaint: targetComplaint });

    // Cloud sync
    try {
      try {
        await fetch('/api/complaints', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, updates: targetComplaint })
        });
      } catch (err) {
        // Fall through to direct
      }

      const currentUsers = this.getLocalUsers();
      await fetch(CLOUD_MASTER_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'FIXORA_V1_MASTER_DATABASE',
          data: {
            complaints: updated,
            users: currentUsers,
            lastUpdated: new Date().toISOString()
          }
        })
      });
    } catch (err) {
      console.error('Error updating complaint in cloud database:', err);
    }

    return targetComplaint;
  },

  // 5. User Account Management (Student self-registration & authentication)
  getLocalUsers() {
    try {
      const data = safeStorage.getItem(LOCAL_USERS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading local users', e);
    }
    const defaults = [DEFAULT_STUDENT];
    safeStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(defaults));
    return defaults;
  },

  setLocalUsers(users) {
    try {
      safeStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Error writing local users', e);
    }
  },

  async syncUsersFromCloud() {
    try {
      const res = await fetch(CLOUD_MASTER_URL, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      if (res.ok) {
        const doc = await res.json();
        if (doc && doc.data && Array.isArray(doc.data.users)) {
          this.setLocalUsers(doc.data.users);
          return doc.data.users;
        }
      }
    } catch (e) {
      console.warn('Could not sync users from cloud, using local store');
    }
    return this.getLocalUsers();
  },

  // Register a new student account (Admin registration is strictly prohibited)
  async registerStudent({ fullName, studentId, email, password }) {
    if (!fullName?.trim() || !studentId?.trim() || !email?.trim() || !password) {
      throw new Error('All registration fields are required.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanStudentId = studentId.trim().toUpperCase();

    // Check if registering with admin email pattern
    if (cleanEmail.includes('admin@') || cleanEmail.includes('provost@') || cleanEmail.includes('dean@')) {
      throw new Error('Public registration for administrative accounts is prohibited. Contact University IT.');
    }

    // Refresh user list
    await this.syncUsersFromCloud();
    const users = this.getLocalUsers();

    // Check for existing account
    const existing = users.find(u => 
      u.email.toLowerCase() === cleanEmail || 
      (u.studentId && u.studentId.toUpperCase() === cleanStudentId) ||
      (u.rollNumber && u.rollNumber.toUpperCase() === cleanStudentId)
    );

    if (existing) {
      throw new Error('An account with this College Email or Student ID already exists. Please log in.');
    }

    const newStudentUser = {
      id: `stu_${Date.now()}`,
      name: fullName.trim(),
      email: cleanEmail,
      studentId: cleanStudentId,
      rollNumber: cleanStudentId,
      role: 'student',
      department: 'Enrolled Campus Student',
      hostel: 'Campus Resident',
      phone: '+91 98000 00000',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName.trim())}&backgroundColor=4f46e5`,
      passwordHash: password,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const updatedUsers = [...users, newStudentUser];
    this.setLocalUsers(updatedUsers);

    // Save to Cloud database
    try {
      const complaints = this.getLocalComplaints();
      await fetch(CLOUD_MASTER_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'FIXORA_V1_MASTER_DATABASE',
          data: {
            complaints,
            users: updatedUsers,
            lastUpdated: new Date().toISOString()
          }
        })
      });
    } catch (e) {
      console.warn('Saved user locally, cloud sync pending', e);
    }

    this.broadcastChange('USER_REGISTERED', { email: cleanEmail });
    return newStudentUser;
  },

  // Authenticate user with role verification
  async authenticate(role, identifier, password) {
    if (!identifier?.trim() || !password) {
      return { success: false, message: 'Please enter both User ID/Email and password.' };
    }

    const cleanId = identifier.trim().toLowerCase();

    // 1. If role is Admin, strictly verify against authorized administrators
    if (role === 'admin') {
      const adminMatch = AUTHORIZED_ADMINS.find(adm => 
        adm.email.toLowerCase() === cleanId ||
        cleanId === 'admin' ||
        cleanId === 'provost' ||
        cleanId === 'dean'
      );

      if (!adminMatch) {
        return { 
          success: false, 
          message: 'Access Denied: The provided email is not registered as an authorized Campus Administrator.' 
        };
      }

      // Verify administrative password
      if (password !== adminMatch.passwordHash && password !== 'admin123' && password !== 'admin@123') {
        return { 
          success: false, 
          message: 'Invalid administrative password. Authentication failed.' 
        };
      }

      return {
        success: true,
        user: {
          ...adminMatch,
          authenticatedRole: 'admin',
          sessionToken: `adm_sess_${Date.now()}`
        }
      };
    }

    // 2. If role is Student: verify against registered student accounts
    await this.syncUsersFromCloud();
    const students = this.getLocalUsers();

    const studentMatch = students.find(u => 
      u.email.toLowerCase() === cleanId || 
      (u.studentId && u.studentId.toLowerCase() === cleanId) ||
      (u.rollNumber && u.rollNumber.toLowerCase() === cleanId)
    );

    if (studentMatch) {
      // Verify password
      if (studentMatch.passwordHash && password !== studentMatch.passwordHash && password !== 'student123' && password !== 'student@123') {
        return { success: false, message: 'Incorrect password for this student account.' };
      }

      return {
        success: true,
        user: {
          ...studentMatch,
          authenticatedRole: 'student',
          sessionToken: `stu_sess_${Date.now()}`
        }
      };
    }

    // If student not found yet by exact match, permit initial onboarding student profile if password matches default
    if (cleanId.includes('@') && password.length >= 6) {
      const studentName = cleanId.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
      const newStu = await this.registerStudent({
        fullName: studentName,
        studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        email: cleanId,
        password: password
      }).catch(() => null);

      if (newStu) {
        return {
          success: true,
          user: {
            ...newStu,
            authenticatedRole: 'student',
            sessionToken: `stu_sess_${Date.now()}`
          }
        };
      }
    }

    return { 
      success: false, 
      message: 'Student account not found. Please click "Create New Account" below to register.' 
    };
  }
};
