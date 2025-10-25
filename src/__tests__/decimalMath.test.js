import { describe, it, expect } from 'vitest';
import decimal from '../utils/decimalMath';

describe('decimalMath', () => {
  it('multiplies and rounds correctly', () => {
    const result = decimal.mul(10, 1.5);
    expect(decimal.round(result,1)).toBe(15.0);
  });

  it('adds correctly', () => {
    const s = decimal.add(1.2, 3.3);
    expect(decimal.round(s,1)).toBe(4.5);
  });
});
