import { describe, it, expect } from 'vitest';
import { add, roundString } from '../utils/decimalMath';

describe('decimalFormat', () => {
  it('produces fixed decimal strings for UI', () => {
    const proteinValue = '25.5';
    const caloriesValue = '165.7';
    const total = add(proteinValue, caloriesValue);
    expect(roundString(total, 2)).toBe('191.20');
  });
});
