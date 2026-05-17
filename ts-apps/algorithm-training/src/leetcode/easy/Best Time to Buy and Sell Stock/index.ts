// You are given an array prices where prices[i] is the price of a given stock on the ith day.
//
// You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.
//
// Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.
//
//
//
// Example 1:
//
// Input: prices = [7,1,5,3,6,4,10]
// Output: 5
// Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
// Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.
// Example 2:
//
// Input: prices = [7,6,4,3,1]
// Output: 0
// Explanation: In this case, no transactions are done and the max profit = 0.
//
//
// Constraints:
//
// 1 <= prices.length <= 105
// 0 <= prices[i] <= 104

const arePricesInRange = (prices: number[]): boolean =>
  prices.every((price) => price <= 10 ** 4 && price >= 0);

const isPricesLengthValid = (prices: number[]): boolean =>
  prices.length >= 1 && prices.length <= 10 ** 5;

const isValid = (prices: number[]): boolean =>
  arePricesInRange(prices) && isPricesLengthValid(prices);

export const maxProfit1 = (prices: number[]): number | undefined => {
  if (!isValid(prices)) return;

  let result = 0;
  let minPrice = prices[0];
  let maxPrice = prices[0];

  for (let i = 1; i < prices.length; i++) {
    const currentPrice = prices[i];

    maxPrice = currentPrice;
    minPrice = minPrice > currentPrice ? currentPrice : minPrice;

    const profit = maxPrice - minPrice;

    result = profit > result ? profit : result;
  }

  return result > 0 ? result : 0;
};

// Accepted
