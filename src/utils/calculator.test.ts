import { describe, it, expect } from 'vitest';
import { add, subtract, multiply, divide } from './calculator';

describe('Calculator Functions', () => {
  describe('add', () => {
    it('should add two positive numbers correctly', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should add negative numbers correctly', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    it('should add positive and negative numbers correctly', () => {
      expect(add(5, -3)).toBe(2);
      expect(add(-5, 3)).toBe(-2);
    });
  });

  describe('subtract', () => {
    it('should subtract two positive numbers correctly', () => {
      expect(subtract(5, 3)).toBe(2);
    });

    it('should subtract negative numbers correctly', () => {
      expect(subtract(-2, -3)).toBe(1);
    });

    it('should subtract positive and negative numbers correctly', () => {
      expect(subtract(5, -3)).toBe(8);
      expect(subtract(-5, 3)).toBe(-8);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers correctly', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it('should multiply negative numbers correctly', () => {
      expect(multiply(-3, -4)).toBe(12);
      expect(multiply(-3, 4)).toBe(-12);
    });

    it('should multiply by zero correctly', () => {
      expect(multiply(5, 0)).toBe(0);
      expect(multiply(0, 5)).toBe(0);
    });
  });

  describe('divide', () => {
    it('should divide two positive numbers correctly', () => {
      expect(divide(12, 4)).toBe(3);
    });

    it('should divide negative numbers correctly', () => {
      expect(divide(-12, -4)).toBe(3);
      expect(divide(-12, 4)).toBe(-3);
    });

    it('should handle decimal results correctly', () => {
      expect(divide(7, 2)).toBe(3.5);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
    });
  });
});