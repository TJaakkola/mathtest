import { TestQuestion } from '../components/MathTest/MathTest';

type Operator = '+' | '-' | '·' | ':';

/*
interface ValidationConfig {
  maxResult?: number;
  minResult?: number;
}

const DEFAULT_CONFIG: ValidationConfig = {
  maxResult: 200,
  minResult: 0,
};
*/

export function isValidQuestion(
  firstNumber: number,
  secondNumber: number,
  operator: Operator,
): boolean {

  if (firstNumber === 0 || secondNumber === 0) return false;

  switch (operator) {
    case '-':
      // Subtraction: result must not be negative and subtractor must not be zero
      if (firstNumber === secondNumber) return false;
      return firstNumber >= secondNumber;

    case '·':
      /* Multiplication: 
       * if both numbers > 10, result must be < 200
       * no multiplication by 1 or 10
       */       
      if (firstNumber === 10 || secondNumber === 10) return false;
      if (firstNumber === 1 || secondNumber === 1) return false;
      if (firstNumber > 10 || secondNumber > 10) {
        return (firstNumber * secondNumber) < 200;
      }
      return true;

    case ':':
      // Division: result must be a whole number, no division by zero or one
      if (firstNumber === 1 || secondNumber === 1 || firstNumber === secondNumber) return false;
      return firstNumber % secondNumber === 0;

    case '+':
      // Addition: no specific restrictions
      return true;

    default:
      return false;
  }
}

export function calculateResult(first: number, second: number, operator: Operator): number {
  switch (operator) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '·':
      return first * second;
    case ':':
      if (second === 0) throw new Error('Division by zero');
      return first / second;
    default:
      throw new Error('Invalid operator');
  }
}

export function isDuplicateQuestion(
  existingQuestions: TestQuestion[],
  firstNumber: number,
  secondNumber: number,
  operator: Operator
): boolean {
  // For addition and multiplication, order doesn't matter
  const isCommutative = operator === '+' || operator === '·'
  
  return existingQuestions.some(q => {
    if (q.operator !== operator) return false;

    if (isCommutative) {
      // Check both orderings for commutative operations
      return (
        (q.firstNumber === firstNumber && q.secondNumber === secondNumber) ||
        (q.firstNumber === secondNumber && q.secondNumber === firstNumber)
      );
    }

    // For non-commutative operations (- and /), check exact match only
    return q.firstNumber === firstNumber && q.secondNumber === secondNumber;
  });
} 