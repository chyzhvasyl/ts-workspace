// You are climbing a staircase. It takes n steps to reach the top.
//
// Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?
//
//
//
// Example 1:
//
// Input: n = 2
// Output: 2
// Explanation: There are two ways to climb to the top.
// 1. 1 step + 1 step
// 2. 2 steps
// Example 2:
//
// Input: n = 3
// Output: 3
// Explanation: There are three ways to climb to the top.
// 1. 1 step + 1 step + 1 step
// 2. 1 step + 2 steps
// 3. 2 steps + 1 step
//
//
// Constraints:
//
// 1 <= n <= 45
//
// https://leetcode.com/explore/interview/card/top-interview-questions-easy/97/dynamic-programming/569/
//

export const climbStairs = (stairsLength: number): number | void => {
  const shortStep = 1;
  const longStep = 2;

  const computeFactorial = (n: number, memo: Record<string, number> = {}): number => {
    if (n === 0 || n === 1) {
      return 1;
    }

    if (typeof memo[n] !== 'undefined') {
      return memo[n];
    }

    memo[n] = n * computeFactorial(n - 1);

    return memo[n];
  };

  const computeCombinations = (combinations: number[][]): number => {
    const memo: Record<string, number> = {};
    let result = 0;

    for (let longSteps = 0; longSteps < combinations.length; longSteps++) {
      const comb = combinations[longSteps];

      result +=
        computeFactorial(comb.length, memo) /
        (computeFactorial(comb.length - longSteps, memo) *
          computeFactorial(longSteps, memo));
    }

    return result;
  };

  const computeLongSteps = (stairsLength: number) =>
    stairsLength % longStep === 0 ? stairsLength / longStep : stairsLength / longStep - 1;

  const isValid = (n: number) => n && n >= 1 && n <= 45;

  if (!isValid(stairsLength)) return;

  const longSteps = computeLongSteps(stairsLength);
  const defaultCombination = new Array(stairsLength).fill(shortStep);
  const combinations: number[][] = [defaultCombination];
  let currentCombination: number[] = [];

  for (let i = 0; i < longSteps; i++) {
    currentCombination = [...combinations[combinations.length - 1]];

    currentCombination[i] = longStep;
    currentCombination.pop();

    combinations.push(currentCombination);
  }

  return computeCombinations(combinations);
};

// Accepted.

// 1 = 1

// 2 = 1 + 1
//
// 2 = 2

// 3 = 1 + 1 + 1

// 3 = 2 + 1
// 3 = 1 + 2

// 4 = 1 + 1 + 1 + 1

// 4 = 2 + 1 + 1
// 4 = 1 + 2 + 1
// 4 = 1 + 1 + 2

// 4 = 2 + 2
//
// 5 = 1 + 1 + 1 + 1 + 1

// 5 = 2 + 1 + 1 + 1
// 5 = 1 + 2 + 1 + 1
// 5 = 1 + 1 + 2 + 1
// 5 = 1 + 1 + 1 + 2

// 5 = 2 + 2 + 1
// 5 = 1 + 2 + 2
// 5 = 2 + 1 + 2

// 6 = 1 + 1 + 1 + 1 + 1 + 1

// 6 = 2 + 1 + 1 + 1 + 1
// 6 = 1 + 2 + 1 + 1 + 1
// 6 = 1 + 1 + 2 + 1 + 1
// 6 = 1 + 1 + 1 + 2 + 1
// 6 = 1 + 1 + 1 + 1 + 2

// 6 = 2 + 2 + 1 + 1
// 6 = 2 + 1 + 2 + 1
// 6 = 2 + 1 + 1 + 2
// 6 = 1 + 2 + 1 + 2
// 6 = 1 + 2 + 2 + 1
// 6 = 1 + 1 + 2 + 2

// 6 = 2 + 2 + 2

// 7 = 1 + 1 + 1 + 1 + 1 + 1 + 1

// 7 = 2 + 1 + 1 + 1 + 1 + 1
// 7 = 1 + 2 + 1 + 1 + 1 + 1
// 7 = 1 + 1 + 2 + 1 + 1 + 1
// 7 = 1 + 1 + 1 + 2 + 1 + 1
// 7 = 1 + 1 + 1 + 1 + 2 + 1
// 7 = 1 + 1 + 1 + 1 + 1 + 2

// 7 = 2 + 2 + 1 + 1 + 1
// 7 = 2 + 1 + 2 + 1 + 1
// 7 = 2 + 1 + 1 + 2 + 1
// 7 = 2 + 1 + 1 + 1 + 2
// 7 = 1 + 2 + 1 + 1 + 2
// 7 = 1 + 1 + 2 + 1 + 2
// 7 = 1 + 1 + 1 + 2 + 2
// 7 = 1 + 2 + 2 + 1 + 1
// 7 = 1 + 1 + 2 + 2 + 1

// 7 = 2 + 2 + 2 + 1
// 7 = 2 + 2 + 1 + 2
// 7 = 2 + 1 + 2 + 2
// 7 = 1 + 2 + 2 + 2
// ...
