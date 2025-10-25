import { describe, it, expect, vi } from 'vitest';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line no-unused-vars
import WaterSleep from '../components/WaterSleep';

describe('WaterSleep', () => {
  const mockOnUpdate = vi.fn();
  const mockOnSleepChange = vi.fn();
  const mockOnWeightUpdate = vi.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
    mockOnSleepChange.mockClear();
    mockOnWeightUpdate.mockClear();
  });

  it('updates water intake correctly', async () => {
    render(<WaterSleep waterMl={500} onUpdate={mockOnUpdate} />);
    const user = userEvent.setup();

    // Add water
    await user.click(screen.getByText(`Add ${250}ml`));
    expect(mockOnUpdate).toHaveBeenCalledWith(750); // Default increment is 250ml
    
    // Subtract water (but not below 0)
    mockOnUpdate.mockClear();
    await user.click(screen.getByText(`Remove ${250}ml`));
    expect(mockOnUpdate).toHaveBeenCalledWith(250);
  });

  it('displays water intake in correct format', () => {
    render(
      <WaterSleep
        waterMl={1500}
        onUpdate={mockOnUpdate}
        onSleepChange={mockOnSleepChange}
        onWeightUpdate={mockOnWeightUpdate}
      />
    );
      expect(screen.getByText('1500ml')).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('1.5') && content.includes('L'))).toBeInTheDocument();
  });

  it('handles weight input correctly', async () => {
    render(
      <WaterSleep
        waterMl={0}
        weight={70}
        onUpdate={mockOnUpdate}
        onSleepChange={mockOnSleepChange}
        onWeightUpdate={mockOnWeightUpdate}
      />
    );
    const user = userEvent.setup();

    // Test valid weight in kg
    await user.type(screen.getByPlaceholderText(/enter weight/i), '75kg');
    await user.click(screen.getByText('Update Weight'));
    expect(mockOnWeightUpdate).toHaveBeenCalledWith(75);

    // Test valid weight in g
    await user.clear(screen.getByPlaceholderText(/enter weight/i));
    await user.type(screen.getByPlaceholderText(/enter weight/i), '75000g');
    await user.click(screen.getByText('Update Weight'));
    expect(mockOnWeightUpdate).toHaveBeenCalledWith(75);

    // Test invalid weight
    await user.clear(screen.getByPlaceholderText(/enter weight/i));
    await user.type(screen.getByPlaceholderText(/enter weight/i), 'invalid');
    await user.click(screen.getByText('Update Weight'));
    expect(screen.getByText(/please enter weight in format/i)).toBeInTheDocument();
  });

  it('handles sleep tracking correctly', async () => {
    render(
      <WaterSleep
        waterMl={0}
        onUpdate={mockOnUpdate}
        onSleepChange={mockOnSleepChange}
        onWeightUpdate={mockOnWeightUpdate}
      />
    );
    const user = userEvent.setup();

    // Initial value should be 7 hours
    expect(screen.getByText('7 hours')).toBeInTheDocument();

    // Increase sleep hours
    await user.click(screen.getByText('+'));
    expect(mockOnSleepChange).toHaveBeenCalledWith(7.5);

    // Decrease sleep hours
    await user.click(screen.getByText('-'));
    expect(mockOnSleepChange).toHaveBeenCalledWith(6.5);

    // Verify sleep insight updates
    expect(screen.getByText(/sleep routine/i)).toBeInTheDocument();
  });

  it('shows correct sleep insights', async () => {
    const { rerender } = render(
      <WaterSleep
        waterMl={0}
        onUpdate={mockOnUpdate}
        onSleepChange={mockOnSleepChange}
        onWeightUpdate={mockOnWeightUpdate}
      />
    );

    // Test different sleep durations and their insights
    const cases = [
      { hours: 5, message: /aim for more rest/i },
      { hours: 7, message: /optimal recovery/i },
      { hours: 9, message: /great sleep duration/i },
      { hours: 8, message: /good sleep routine/i },
    ];

    for (const { hours, message } of cases) {
      rerender(
        <WaterSleep
          waterMl={0}
          sleepHours={hours}
          onUpdate={mockOnUpdate}
          onSleepChange={mockOnSleepChange}
          onWeightUpdate={mockOnWeightUpdate}
        />
      );

      const decrementButton = screen.getByText('-');
      const incrementButton = screen.getByText('+');

      // Adjust to target hours (await clicks so DOM updates are processed)
      // Limit iterations to avoid infinite loops in case of unexpected behavior
      let attempts = 0;
      while (!screen.queryByText(`${hours} hours`) && attempts < 20) {
        if (hours > 7) {
          await userEvent.click(incrementButton);
        } else {
          await userEvent.click(decrementButton);
        }
        attempts += 1;
      }

      expect(screen.getByText(message)).toBeInTheDocument();
    }
  });
});