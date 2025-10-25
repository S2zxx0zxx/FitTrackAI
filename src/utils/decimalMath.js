import Decimal from 'decimal.js';

export const add = (a, b) => new Decimal(a || 0).plus(b || 0).toNumber();
export const sub = (a, b) => new Decimal(a || 0).minus(b || 0).toNumber();
export const mul = (a, b) => new Decimal(a || 0).times(b || 0).toNumber();
export const div = (a, b) => {
  if (b === 0 || b === '0' || b === undefined) return 0;
  return new Decimal(a || 0).div(b).toNumber();
};
export const round = (a, decimals = 1) => {
  // Return as Number rounded to `decimals` places. Decimal.toDecimalPlaces
  // ensures correct rounding and toNumber returns a JS number.
  return new Decimal(a || 0).toDecimalPlaces(decimals).toNumber();
};

export default { add, sub, mul, div, round };
