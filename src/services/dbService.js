import { INITIAL_COMPLAINTS } from '../data/seedData.js';

// Local storage cache keys for zero-latency initial rendering
const LOCAL_COMPLAINTS_KEY = 'fixora_complaints';
const LOCAL_USERS_KEY = 'fixora_registered_users';

// Cross-tab broadcast channel for real-time same-machine updates
let broadcastChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('fixora_db_sync_channel');
  }
} catch (e) {
  console.warn('BroadcastChannel not supported');
}

// Safe storage wrapper
const safeStorage = {
  getItem(key) {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (e) {}
    return null;
  },
  setItem(key, val) {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(key, val);
      }
    } catch (e) {}
  }
};

export const dbService = {
  // Broadcast change event to other tabs
  broadcastChange(type, payload) {
    try {
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type, payload, timestamp: Date.now() });
      }
    } catch (e) {
      console.warn('Broadcast failed', e);
    }
  },

  // 1. Get cached complaints immediately (0ms latency for smooth UI initial paint)
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
    // Default fallback
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

  // 2. Fetch latest complaints from persistent backend API
  async syncComplaintsFromCloud() {
    try {
      const res = await fetch('/api/complaints', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });

      if (res.ok) {
        const cloudData = await res.json();
        if (Array.isArray(cloudData)) {
          this.setLocalComplaints(cloudData);
          return cloudData;
        }
      }
    } catch (err) {
      console.warn('Could not sync complaints from backend API, using local cache:', err.message);
    }
    return this.getLocalComplaints();
  },

  // 3. Persist new complaint permanently to backend database
  async addComplaint(newComplaint) {
    // Save to local cache immediately for responsive UI
    const current = this.getLocalComplaints();
    const updated = [newComplaint, ...current.filter(c => c.id !== newComplaint.id)];
    this.setLocalComplaints(updated);
    this.broadcastChange('COMPLAINT_ADDED', newComplaint);

    // Save asynchronously to backend API
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComplaint)
      });
      if (res.ok) {
        const saved = await res.json();
        return saved;
      }
    } catch (err) {
      console.error('Error persisting complaint to backend:', err);
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

    // Send update to backend API
    try {
      await fetch('/api/complaints', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates: targetComplaint })
      });
    } catch (err) {
      console.error('Error updating complaint in backend:', err);
    }

    return targetComplaint;
  },

  // 5. User Account Registration (Students only)
  async registerStudent({ fullName, studentId, email, password }) {
    if (!fullName?.trim() || !studentId?.trim() || !email?.trim() || !password) {
      throw new Error('All registration fields are required.');
    }

    const res = await fetch('/api/auth?action=register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: fullName.trim(),
        studentId: studentId.trim(),
        email: email.trim(),
        password: password
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Registration failed.');
    }

    this.broadcastChange('USER_REGISTERED', { email: email.trim() });
    return data.user;
  },

  // 6. Authenticate user with backend role-based verification
  async authenticate(role, identifier, password) {
    if (!identifier?.trim() || !password) {
      return { success: false, message: 'Please enter both User ID/Email and password.' };
    }

    try {
      const res = await fetch('/api/auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          identifier: identifier.trim(),
          password
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.error || 'Authentication failed. Please verify your credentials.'
        };
      }

      return {
        success: true,
        user: data.user
      };
    } catch (err) {
      return {
        success: false,
        message: 'Could not connect to authentication service. Please check your connection.'
      };
    }
  }
};
