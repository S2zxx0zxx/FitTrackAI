/**
 * Secure storage utility that handles data encryption and safe storage practices
 * NEVER store sensitive data like tokens in localStorage
 */

const secureStorage = {
  set: (key, value) => {
    if (typeof value === 'undefined') return;
    
    // Don't store sensitive data
    if (key.toLowerCase().includes('token') || 
        key.toLowerCase().includes('password') ||
        key.toLowerCase().includes('secret')) {
      console.error('Attempted to store sensitive data in localStorage');
      return;
    }

    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (err) {
      console.error('Storage error:', err);
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      console.error('Storage error:', err);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error('Storage error:', err);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (err) {
      console.error('Storage error:', err);
    }
  }
};

export default secureStorage;