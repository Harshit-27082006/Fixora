import { INITIAL_COMPLAINTS, INITIAL_NOTIFICATIONS, USERS } from '../data/seedData';

const COMPLAINTS_KEY = 'fixora_complaints_v1';
const NOTIFICATIONS_KEY = 'fixora_notifications_v1';
const CURRENT_USER_KEY = 'fixora_current_user_v1';

export const storageService = {
  getComplaints() {
    try {
      const data = localStorage.getItem(COMPLAINTS_KEY);
      if (!data) {
        this.saveComplaints(INITIAL_COMPLAINTS);
        return INITIAL_COMPLAINTS;
      }
      return JSON.parse(data);
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

  getCurrentUser() {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      if (!data) {
        this.setCurrentUser(USERS[0]);
        return USERS[0];
      }
      return JSON.parse(data);
    } catch (e) {
      return USERS[0];
    }
  },

  setCurrentUser(user) {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Error saving current user', e);
    }
  },

  resetAllData() {
    localStorage.removeItem(COMPLAINTS_KEY);
    localStorage.removeItem(NOTIFICATIONS_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    this.saveComplaints(INITIAL_COMPLAINTS);
    this.saveNotifications(INITIAL_NOTIFICATIONS);
    this.setCurrentUser(USERS[0]);
    return {
      complaints: INITIAL_COMPLAINTS,
      notifications: INITIAL_NOTIFICATIONS,
      currentUser: USERS[0]
    };
  }
};
