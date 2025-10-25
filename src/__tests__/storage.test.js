import { describe, it, expect, vi } from 'vitest';
import storage from '../utils/storage';

describe('storage', () => {
  beforeEach(() => {
    // mock localStorage
    const store = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key]);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      store[key] = value;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads empty daily data with defaults', () => {
    const data = storage.loadDailyData();
    expect(data.meals).toEqual([]);
    expect(data.water_ml).toBe(0);
    expect(data.goals.protein).toBe(150);
  });

  it('saves and loads history', () => {
    const item = { date: '2025-10-25', totalProtein: 120, totalCalories: 2000, metProteinGoal: false };
    storage.appendHistory(item);
    const history = storage.loadHistory();
    expect(history).toContainEqual(item);
  });
});