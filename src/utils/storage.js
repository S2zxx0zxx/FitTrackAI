export const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};

export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error reading from localStorage:', e);
    return defaultValue;
  }
};

export const clearDailyData = () => {
  const lastReset = getFromLocalStorage('lastReset');
  const today = new Date().toDateString();

  if (lastReset !== today) {
    saveToLocalStorage('meals', []);
    saveToLocalStorage('water', 0);
    saveToLocalStorage('lastReset', today);
  }
};