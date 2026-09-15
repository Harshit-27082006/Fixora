import { INITIAL_COMPLAINTS, INITIAL_NOTIFICATIONS, USERS } from '../data/seedData';

const COMPLAINTS_KEY = 'fixora_complaints_v2';
const NOTIFICATIONS_KEY = 'fixora_notifications_v2';
const AUTH_USER_KEY = 'fixora_auth_user_session';

export const storageService = {
  getComplaints() {
    try {
      const data = localStorage.getItem(COMPLAINTS_KEY);
      if (!data) {
        this.saveComplaints(INITIAL_COMPLAINTS);
        return INITIAL_COMPLAINTS;
      }
      return parsed;
    } catch (e) {
      console.error('Error loading complaints from localStorage', e);
      return INITIAL_COMPLAINTS;
    }
  },

  saveComplaints(complaints) {
    try {
      localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
    } catch (e) {
      console.error('Error saving complaints', e);
    }
  },

  getNotifications() {
    try {
      const data = localStorage.getItem(NOTIFICATIONS_KEY);
      if (!data) {
        this.saveNotifications(INITIAL_NOTIFICATIONS);
        return INITIAL_NOTIFICATIONS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error loading notifications', e);
      return INITIAL_NOTIFICATIONS;
    }
  },

  saveNotifications(notifications) {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Error saving notifications', e);
    }
  },

  getAuthUser() {
    try {
      const data = sessionStorage.getItem(AUTH_USER_KEY) || localStorage.getItem(AUTH_USER_KEY);
      if (!data) return null;
      const parsed = JSON.parse(data);
      return parsed;
    } catch (e) {
      return null;
    }
  },

  setAuthUser(user, remember = true) {
    try {
      const json = JSON.stringify(user);
      if (remember) {
        localStorage.setItem(AUTH_USER_KEY, json);
      }
      sessionStorage.setItem(AUTH_USER_KEY, json);
    } catch (e) {
      console.error('Error saving auth user', e);
    }
  },

  clearAuthUser() {
    try {
      sessionStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem('fixora_current_user_v1');
    } catch (e) {
      console.error('Error clearing auth user', e);
    }
  },

  resetAllData() {
    localStorage.removeItem(COMPLAINTS_KEY);
    localStorage.removeItem(NOTIFICATIONS_KEY);
    this.clearAuthUser();
    this.saveComplaints(INITIAL_COMPLAINTS);
    this.saveNotifications(INITIAL_NOTIFICATIONS);
    return {
      complaints: INITIAL_COMPLAINTS,
      notifications: INITIAL_NOTIFICATIONS,
      currentUser: null
    };
  }
};
