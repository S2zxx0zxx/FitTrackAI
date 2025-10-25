import { describe, it, expect } from 'vitest';
import React from 'react';
import { screen, render } from '@testing-library/react';
import MealList from '../components/MealList';

describe('MealList', () => {
  const mockMeals = [
    { id: 1, name: 'Chicken', protein: 25, calories: 165 },
    { id: 2, name: 'Eggs', protein: 12, calories: 140 }
  ];

  it('renders meals correctly', () => {
    render(<MealList meals={mockMeals} />);
    
    expect(screen.getByText('Chicken')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Protein: 25') && content.includes('g'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Cal: 165'))).toBeInTheDocument();
    
    expect(screen.getByText('Eggs')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Protein: 12') && content.includes('g'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Cal: 140'))).toBeInTheDocument();
  });

  it('shows empty state when no meals', () => {
    render(<MealList meals={[]} />);
    expect(screen.getByText(/no meals/i)).toBeInTheDocument();
  });
});