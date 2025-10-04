'use client';

import React, { useState, useEffect } from 'react';
import { add, subtract, multiply, divide } from '@/utils/calculator';

const Calculator = () => {
  const [display, setDisplay] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  // Format display value to handle large numbers and precision
  const formatDisplay = (value: string): string => {
    // Convert to number and back to string to handle precision issues
    const num = parseFloat(value);
    if (isNaN(num)) return '0';
    
    // Format large numbers with scientific notation if needed
    if (Math.abs(num) > 999999999) {
      return num.toExponential(6);
    }
    
    // Format with commas and handle decimals
    const [integer, decimal] = value.split('.');
    if (!decimal) return new Intl.NumberFormat().format(num);
    
    return `${new Intl.NumberFormat().format(parseFloat(integer))}.${decimal}`;
  };

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setIsError(false);
  };

  const inputDigit = (digit: string) => {
    if (isError) {
      setDisplay(digit);
      setIsError(false);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(false);
      return;
    }

    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (isError) {
      setDisplay('0.');
      setIsError(false);
      setWaitingForOperand(false);
      return;
    }

    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const performOperation = (nextOperation: string) => {
    if (isError) {
      setIsError(false);
    }

    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      let newValue: number;

      try {
        switch (operation) {
          case '+':
            newValue = add(previousValue, inputValue);
            break;
          case '-':
            newValue = subtract(previousValue, inputValue);
            break;
          case '×':
            newValue = multiply(previousValue, inputValue);
            break;
          case '÷':
            newValue = divide(previousValue, inputValue);
            break;
          default:
            newValue = inputValue;
        }

        // Check if result is finite
        if (!isFinite(newValue)) {
          setIsError(true);
          setDisplay('Error');
          return;
        }

        setPreviousValue(newValue);
        setDisplay(String(newValue));
      } catch (error) {
        setIsError(true);
        setDisplay('Error');
        return;
      }
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const performCalculation = () => {
    if (isError) {
      setIsError(false);
    }

    if (operation === null || previousValue === null) {
      return;
    }

    const inputValue = parseFloat(display);
    let newValue: number;

    try {
      switch (operation) {
        case '+':
          newValue = add(previousValue, inputValue);
          break;
        case '-':
          newValue = subtract(previousValue, inputValue);
          break;
        case '×':
          newValue = multiply(previousValue, inputValue);
          break;
        case '÷':
          newValue = divide(previousValue, inputValue);
          break;
        default:
          newValue = inputValue;
      }

      // Check if result is finite
      if (!isFinite(newValue)) {
        setIsError(true);
        setDisplay('Error');
        return;
      }

      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    } catch (error) {
      setIsError(true);
      setDisplay('Error');
    }
  };

  const handlePlusMinus = () => {
    if (isError) return;
    
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  const handlePercentage = () => {
    if (isError) return;
    
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
      } else if (e.key === '.') {
        inputDecimal();
      } else if (e.key === '+') {
        performOperation('+');
      } else if (e.key === '-') {
        performOperation('-');
      } else if (e.key === '*') {
        performOperation('×');
      } else if (e.key === '/') {
        performOperation('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        performCalculation();
      } else if (e.key === 'Escape') {
        clearAll();
      } else if (e.key === '%') {
        handlePercentage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [display, previousValue, operation, waitingForOperand, isError]);

  const Button: React.FC<{
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
    ariaLabel?: string;
  }> = ({ onClick, className = '', children, ariaLabel }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center text-xl font-medium rounded-xl transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${className}`}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-sm w-full bg-gray-100 rounded-3xl shadow-xl overflow-hidden">
      <div className="p-5 bg-gradient-to-b from-gray-800 to-gray-900 text-white">
        {/* Display */}
        <div className="text-right mb-5">
          <div className="text-gray-400 text-base min-h-[1.5rem] mb-1 text-right overflow-x-auto whitespace-nowrap">
            {previousValue !== null && operation ? `${formatDisplay(String(previousValue))} ${operation}` : ''}
          </div>
          <div 
            className={`text-4xl font-semibold overflow-x-auto whitespace-nowrap text-right ${
              isError ? 'text-red-400' : 'text-white'
            }`}
            aria-live="polite"
            aria-atomic="true"
            data-testid="display"
          >
            {formatDisplay(display)}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <Button 
            onClick={clearAll} 
            className="bg-red-500 hover:bg-red-600 h-16 text-white font-bold text-lg"
            ariaLabel="All Clear"
          >
            AC
          </Button>
          <Button 
            onClick={handlePlusMinus} 
            className="bg-gray-600 hover:bg-gray-700 h-16 text-white font-bold"
            ariaLabel="Plus Minus"
          >
            +/-
          </Button>
          <Button 
            onClick={handlePercentage} 
            className="bg-gray-600 hover:bg-gray-700 h-16 text-white font-bold"
            ariaLabel="Percentage"
          >
            %
          </Button>
          <Button 
            onClick={() => performOperation('÷')} 
            className="bg-amber-500 hover:bg-amber-600 h-16 text-white font-bold text-xl"
            ariaLabel="Divide"
          >
            ÷
          </Button>

          {/* Row 2 */}
          <Button 
            onClick={() => inputDigit('7')} 
            className="bg-gray-700 hover:bg-gray-600 h-16 text-white text-lg"
            ariaLabel="7"
          >
            7
          </Button>
          <Button 
            onClick={() => inputDigit('8')} 
            className="bg-gray-700 hover:bg-gray-600 h-16 text-white text-lg"
            ariaLabel="8"
          >
            8
          </Button>
          <Button 
            onClick={() => inputDigit('9')} 
            className="bg-gray-700 hover:bg-gray-600 h-16 text-white text-lg"
            ariaLabel="9"
          >
            9
          </Button>
          <Button 
            onClick={() => performOperation('×')} 
            className="bg-amber-500 hover:bg-amber-600 h-16 text-white font-bold text-xl"
            ariaLabel="Multiply"
          >
            ×
          </Button>

          {/* Row 3 */}
          <Button 
            onClick={() => inputDigit('4')} 
            className="bg-gray-700 hover:bg-gray-600 h-16 text-white text-lg"
            ariaLabel="4"
          >
            4
          </Button>
          <Button 
            onClick={() => inputDigit('5')} 
            className="bg-gray-700 hover:bg-gray-600 h-16 text-white text-lg"
            ariaLabel="5"
          >
            5
          </Button>
          <Button 
            onClick={() => inputDigit('6')} 
            className="bg-gray-700 hover:bg-gray-600 h-16 text-white text-lg"
            ariaLabel="6"
          >
            6
          </Button>
          <Button 
            onClick={() => performOperation('-')} 
            className="bg-amber-500 hover:bg-amber-600 h-16 text-white font-bold text-xl"
            ariaLabel="Subtract"
          >
            -
          </Button>

          {/* Row 4 */}
          <Button 
            onClick={() => inputDigit('1')} 
            className="bg-gray-700 hover:bg-gray-600 h-16 text-white text-lg"
            ariaLabel="1"
          >
            1
          </Button>
          <Button 
            onClick={() => inputDigit('2')} 
            className="bg-gray-700 hover:bg-gray-600 h-16 text-white text-lg"
            ariaLabel="2"
          >
            2
          </Button>
          <Button 
            onClick={() => inputDigit('3')} 
            className="bg-gray-700 hover:bg-gray-600 h-16 text-white text-lg"
            ariaLabel="3"
          >
            3
          </Button>
          <Button 
            onClick={() => performOperation('+')} 
            className="bg-amber-500 hover:bg-amber-600 h-16 text-white font-bold text-xl"
            ariaLabel="Add"
          >
            +
          </Button>

          {/* Row 5 */}
          <Button 
            onClick={() => inputDigit('0')} 
            className="bg-gray-700 hover:bg-gray-600 h-16 text-white text-lg col-span-2"
            ariaLabel="0"
          >
            0
          </Button>
          <Button 
            onClick={inputDecimal} 
            className="bg-gray-700 hover:bg-gray-600 h-16 text-white text-xl"
            ariaLabel="Decimal point"
          >
            .
          </Button>
          <Button 
            onClick={performCalculation} 
            className="bg-amber-500 hover:bg-amber-600 h-16 text-white font-bold text-xl"
            ariaLabel="Equals"
          >
            =
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;