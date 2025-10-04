import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Calculator from './Calculator';
import React from 'react';

// Mock the calculator utilities
vi.mock('@/utils/calculator', () => ({
  add: vi.fn((a, b) => a + b),
  subtract: vi.fn((a, b) => a - b),
  multiply: vi.fn((a, b) => a * b),
  divide: vi.fn((a, b) => a / b),
}));

describe('Calculator Component', () => {
  beforeEach(() => {
    // Reset any global event listeners
    Object.defineProperty(window, 'addEventListener', {
      writable: true,
      value: vi.fn(),
    });
    Object.defineProperty(window, 'removeEventListener', {
      writable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<Calculator />);
    
    // Check that the calculator display is present (using data-testid)
    expect(screen.getByTestId('display')).toBeInTheDocument();
    
    // Check that calculator buttons are present using aria-labels
    expect(screen.getByRole('button', { name: '0' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Equals' })).toBeInTheDocument();
  });

  it('displays initial value correctly', () => {
    render(<Calculator />);
    // Select the display element by its test id
    const display = screen.getByTestId('display');
    expect(display).toHaveTextContent('0');
  });

  it('allows input of digits', () => {
    render(<Calculator />);
    
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    
    expect(screen.getByTestId('display')).toHaveTextContent('123');
  });

  it('handles decimal input correctly', () => {
    render(<Calculator />);
    
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: 'Decimal point' }));
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '4' }));
    
    expect(screen.getByTestId('display')).toHaveTextContent('3.14');
  });

  it('performs addition correctly', () => {
    render(<Calculator />);
    
    // Input first number
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    
    // Select operation
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    
    // Input second number
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    
    // Perform calculation
    fireEvent.click(screen.getByRole('button', { name: 'Equals' }));
    
    expect(screen.getByTestId('display')).toHaveTextContent('5');
  });

  it('performs subtraction correctly', () => {
    render(<Calculator />);
    
    // Input first number
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    
    // Select operation
    fireEvent.click(screen.getByRole('button', { name: 'Subtract' }));
    
    // Input second number
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    
    // Perform calculation
    fireEvent.click(screen.getByRole('button', { name: 'Equals' }));
    
    expect(screen.getByTestId('display')).toHaveTextContent('2');
  });

  it('performs multiplication correctly', () => {
    render(<Calculator />);
    
    // Input first number
    fireEvent.click(screen.getByRole('button', { name: '4' }));
    
    // Select operation
    fireEvent.click(screen.getByRole('button', { name: 'Multiply' }));
    
    // Input second number
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    
    // Perform calculation
    fireEvent.click(screen.getByRole('button', { name: 'Equals' }));
    
    expect(screen.getByTestId('display')).toHaveTextContent('20');
  });

  it('performs division correctly', () => {
    render(<Calculator />);
    
    // Input first number
    fireEvent.click(screen.getByRole('button', { name: '8' }));
    
    // Select operation
    fireEvent.click(screen.getByRole('button', { name: 'Divide' }));
    
    // Input second number
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    
    // Perform calculation
    fireEvent.click(screen.getByRole('button', { name: 'Equals' }));
    
    expect(screen.getByTestId('display')).toHaveTextContent('4');
  });

  it('handles clear all function', () => {
    render(<Calculator />);
    
    // Input some numbers
    fireEvent.click(screen.getByRole('button', { name: '9' }));
    fireEvent.click(screen.getByRole('button', { name: '9' }));
    fireEvent.click(screen.getByRole('button', { name: '9' }));
    
    expect(screen.getByTestId('display')).toHaveTextContent('999');
    
    // Clear all
    fireEvent.click(screen.getByRole('button', { name: 'All Clear' }));
    
    expect(screen.getByTestId('display')).toHaveTextContent('0');
  });

  it('handles percentage function', () => {
    render(<Calculator />);
    
    // Input number
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    
    expect(screen.getByTestId('display')).toHaveTextContent('50');
    
    // Convert to percentage
    fireEvent.click(screen.getByRole('button', { name: 'Percentage' }));
    
    expect(screen.getByTestId('display')).toHaveTextContent('0.5');
  });

  it('handles plus/minus function', () => {
    render(<Calculator />);
    
    // Input positive number
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    
    expect(screen.getByTestId('display')).toHaveTextContent('50');
    
    // Make it negative
    fireEvent.click(screen.getByRole('button', { name: 'Plus Minus' }));
    
    expect(screen.getByTestId('display')).toHaveTextContent('-50');
    
    // Make it positive again
    fireEvent.click(screen.getByRole('button', { name: 'Plus Minus' }));
    
    expect(screen.getByTestId('display')).toHaveTextContent('50');
  });
});