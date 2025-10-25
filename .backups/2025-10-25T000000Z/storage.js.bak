const DAILY_KEY = 'fittrack_ai_daily_v1';
const HISTORY_KEY = 'fittrack_ai_history_v1';

const safeParse = (str, fallback) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
};

export const loadDailyData = () => {
  const raw = localStorage.getItem(DAILY_KEY);
  if (!raw) {
    const today = new Date().toISOString().slice(0, 10);
    const initial = {
      date: today,
      meals: [],
      water_ml: 0,
      sleep_hours: 7,
      goals: { protein: 150, carbs: 300, fat: 70, calories: 2500 },
      quote_of_day: null
    };
    localStorage.setItem(DAILY_KEY, JSON.stringify(initial));
    return initial;
  }
  return safeParse(raw, null);
};

export const saveDailyData = (obj) => {
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify(obj));
  } catch (e) {
    console.error('Error saving daily data', e);
  }
};

export const loadHistory = () => {
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  return safeParse(raw, []);
};

export const appendHistory = (daySummary) => {
  const history = loadHistory();
  history.push(daySummary);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving history', e);
  }
};

export const resetIfNewDay = () => {
  const daily = loadDailyData();
  const today = new Date().toISOString().slice(0, 10);
  if (daily && daily.date && daily.date !== today) {
    // move previous day to history
    const totals = daily.meals.reduce((acc, m) => ({
      totalProtein: acc.totalProtein + (Number(m.protein) || 0),
      totalCalories: acc.totalCalories + (Number(m.calories) || 0)
    }), { totalProtein: 0, totalCalories: 0 });
    appendHistory({ date: daily.date, totalProtein: totals.totalProtein, totalCalories: totals.totalCalories, metProteinGoal: totals.totalProtein >= (daily.goals?.protein || 150) });
    // create new day preserving goals
    const next = {
      date: today,
      meals: [],
      water_ml: 0,
      sleep_hours: 7,
      goals: daily.goals || { protein: 150, carbs: 300, fat: 70, calories: 2500 },
      quote_of_day: null
    };
    saveDailyData(next);
    return next;
  }
  return daily;
};

export default {
  loadDailyData,
  saveDailyData,
  loadHistory,
  appendHistory,
  resetIfNewDay
};