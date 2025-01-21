import { TestParametersData } from '../components/TestParameters/TestParameters';
import { TestQuestion } from '../components/MathTest/MathTest';
import { isValidQuestion, findValidDivisor, isDuplicateQuestion } from '../utils/testValidation';

type Operator = '+' | '-' | '*' | '/';

export function generateMathTest(parameters: TestParametersData): TestQuestion[] {
  const generateNumbers = (): number[] => {
    if (parameters.numberConfig.type === 'specific') {
      return parameters.numberConfig.specificNumbers;
    }

    const [start, end] = parameters.numberConfig.range;
    return Array.from({ length: end - start + 1 }, (_, i) => i + start);
  };

  const getRandomElement = <T>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const generateValidQuestion = (
    numbers: number[],
    operator: Operator,
    existingQuestions: TestQuestion[],
    maxAttempts = 100
  ): { firstNumber: number; secondNumber: number } | null => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (operator === '/') {
        const dividend = getRandomElement(numbers);
        const divisor = findValidDivisor(numbers, dividend);
        
        if (divisor && !isDuplicateQuestion(existingQuestions, dividend, divisor, operator)) {
          return { firstNumber: dividend, secondNumber: divisor };
        }
      } else {
        const firstNumber = getRandomElement(numbers);
        const secondNumber = getRandomElement(numbers);

        if (
          isValidQuestion(firstNumber, secondNumber, operator) && 
          !isDuplicateQuestion(existingQuestions, firstNumber, secondNumber, operator)
        ) {
          return { firstNumber, secondNumber };
        }
      }
    }
    return null;
  };

  const numbers = generateNumbers();
  const questions: TestQuestion[] = [];

  for (let i = 0; i < parameters.questionCount; i++) {
    let operator = getRandomElement(parameters.operators) as Operator;
    let question = generateValidQuestion(numbers, operator, questions);

    // If we can't generate a valid question with current operator, try another one
    if (!question) {
      const remainingOperators = parameters.operators
        .filter(op => op !== operator) as Operator[];
      
      for (const altOperator of remainingOperators) {
        operator = altOperator;
        question = generateValidQuestion(numbers, operator, questions);
        if (question) break;
      }
    }

    // If we still don't have a valid question, skip this iteration
    if (!question) continue;

    const { firstNumber, secondNumber } = question;
    const answer = firstNumber / secondNumber;

    questions.push({
      id: i + 1,
      firstNumber,
      secondNumber,
      operator,
      answer,
    });
  }

  return questions;
}
