import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WaterSleep from '../components/WaterSleep';

describe('WaterSleep', () => {
  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
  });

  it('updates water intake correctly', async () => {
    render(<WaterSleep waterMl={500} onUpdate={mockOnUpdate} />);
    const user = userEvent.setup();

    // Add water
      await user.click(screen.getByText(/add 250ml/i));
    expect(mockOnUpdate).toHaveBeenCalledWith(750); // Default increment is 250ml
    
    // Subtract water (but not below 0)
    mockOnUpdate.mockClear();
      await user.click(screen.getByText(/subtract 250ml/i));
    expect(mockOnUpdate).toHaveBeenCalledWith(250);
  });

  it('displays water intake in correct format', () => {
    render(<WaterSleep waterMl={1500} onUpdate={mockOnUpdate} />);
      expect(screen.getByText('1500ml')).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('1.5') && content.includes('L'))).toBeInTheDocument();
  });
});