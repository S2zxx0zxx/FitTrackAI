import { describe, it, expect, vi } from 'vitest';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { add, round } from '../utils/decimalMath';
import MealInput from '../components/MealInput';

describe('MealInput', () => {
  const mockOnAdd = vi.fn();

  beforeEach(() => {
    mockOnAdd.mockClear();
  });

  it('handles input validation correctly', async () => {
  render(<MealInput onAddMeal={mockOnAdd} />);
    const user = userEvent.setup();
    
    // Enable manual mode
    await user.click(screen.getByRole('checkbox'));
    
  // Invalid inputs
  await user.type(screen.getByPlaceholderText('Protein (g)'), '-5');
  await user.type(screen.getByPlaceholderText('Calories'), '0');
    await user.click(screen.getByRole('button', { name: /add/i }));
    expect(mockOnAdd).not.toHaveBeenCalled();
    
    // Valid inputs
  await user.clear(screen.getByPlaceholderText('Protein (g)'));
  await user.type(screen.getByPlaceholderText('Protein (g)'), '25');
  await user.clear(screen.getByPlaceholderText('Calories'));
  await user.type(screen.getByPlaceholderText('Calories'), '165');
  await user.type(screen.getByPlaceholderText('Food name'), 'Chicken');
    
    await user.click(screen.getByRole('button', { name: /add/i }));
    // component converts inputs to numbers when building the meal object
    expect(mockOnAdd).toHaveBeenCalledWith({
      name: 'Chicken',
      quantity: 1,
      protein: 25,
      carbs: 0,
      fat: 0,
      calories: 165
    });
  });

  it('uses decimal math for calculations', () => {
    const proteinValue = '25.5';
    const caloriesValue = '165.7';
    
    const total = add(proteinValue, caloriesValue);
    // round now returns a Number (e.g. 191.2)
    expect(round(total, 2)).toBe(191.2);
  });
});