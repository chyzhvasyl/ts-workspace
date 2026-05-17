// You are given an array prices where prices[i] is the price of a given stock on the ith day.
//
// Find the maximum profit you can achieve. You may complete as many transactions as you like (i.e., buy one and sell one share of the stock multiple times).
//
// Note: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).
//
//
//
// Example 1:
//
// Input: prices = [7,1,5,3,6,4]
// Output: 7
// Explanation: Buy on day 2 (price = 1) and sell on day 3 (price = 5), profit = 5-1 = 4.
// Then buy on day 4 (price = 3) and sell on day 5 (price = 6), profit = 6-3 = 3.
// Example 2:
//
// Input: prices = [1,2,3,4,5]
// Output: 4
// Explanation: Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.
// Note that you cannot buy on day 1, buy on day 2 and sell them later, as you are engaging multiple transactions at the same time. You must sell before buying again.
// Example 3:
//
// Input: prices = [7,6,4,3,1]
// Output: 0
// Explanation: In this case, no transaction is done, i.e., max profit = 0.
//
//
// Constraints:
//
// 1 <= prices.length <= 3 * 104
// 0 <= prices[i] <= 104

// thoughts
// Input: prices = [7,1,5,3,6,4]
// 0 day: 7-7 = 0
// 1 day:

const arePricesInRange = (prices: number[]): boolean =>
  prices.every((price) => price <= 10 ** 4 && price >= 0);

const isPricesLengthValid = (prices: number[]): boolean =>
  prices.length >= 1 && prices.length <= 3 * 10 ** 4;

const areWithinConstraints = (prices: number[]): boolean =>
  arePricesInRange(prices) && isPricesLengthValid(prices);

const sumProfit = (stocks: number[] = []): number =>
  stocks.reduce((prev: number, cur: number) => prev + cur, 0);

export const maxProfit2 = (prices: number[]): number | undefined => {
  if (!areWithinConstraints(prices)) return;

  const transactions: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i === prices.length - 1) {
      break;
    }

    const revenue = prices[i + 1] - prices[i];

    if (revenue > 0) {
      transactions.push(revenue);
    }
  }

  return sumProfit(transactions);
};

// Accepted.
