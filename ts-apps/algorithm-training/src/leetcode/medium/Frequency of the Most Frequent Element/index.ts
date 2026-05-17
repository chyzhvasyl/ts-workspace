// The frequency of an element is the number of times it occurs in an array.
//
// You are given an integer array nums and an integer k. In one operation, you can choose an index.ts of nums and increment the element at that index.ts by 1.
//
// Return the maximum possible frequency of an element after performing at most k operations.
//
//
//
// Example 1:
//
// Input: nums = [1,2,4], k = 5
// Output: 3
// Explanation: Increment the first element three times and the second element two times to make nums = [4,4,4].
// 4 has a frequency of 3.
// Example 2:
//
// Input: nums = [1,4,8,13], k = 5
// Output: 2
// Explanation: There are multiple optimal solutions:
// - Increment the first element three times to make nums = [4,4,8,13]. 4 has a frequency of 2.
// - Increment the second element four times to make nums = [1,8,8,13]. 8 has a frequency of 2.
// - Increment the third element five times to make nums = [1,4,13,13]. 13 has a frequency of 2.
// Example 3:
//
// Input: nums = [3,9,6], k = 2
// Output: 1
//
//
// Constraints:
//
// 1 <= nums.length <= 105
// 1 <= nums[i] <= 105
// 1 <= k <= 105

const canAlignPrevious = (diff: number, length: number, portion: number): boolean =>
  getDiffPortion(diff, length, portion) >= 0;

const getDiffPortion = (diff: number, length: number, portion: number): number =>
  portion - diff * length;

export const maxFrequency = (nums: number[], k: number): number => {
  nums.sort((a, b) => a - b);

  let combination = 0;
  let count: number = k;
  let result = 1;

  const resetValues = (): void => {
    count = k;
    result = 1;
  };

  for (let i = 0; i < nums.length - 1; i++) {
    for (let j: number = i; j < nums.length - 1; j++) {
      const _: number = nums[j];
      const next: number = nums[j + 1];
      const diffNextAndCurrent: number = next - _;
      const leftLength: number = j - i;
      const portion: number = count - diffNextAndCurrent;

      if (
        diffNextAndCurrent <= count &&
        canAlignPrevious(diffNextAndCurrent, leftLength, portion)
      ) {
        result++;
        count = getDiffPortion(diffNextAndCurrent, leftLength, portion);
      } else break;
    }

    if (combination < result) {
      combination = result;
    }

    resetValues();
  }

  return combination;
};

// Slide-window technique
export const maxFrequency2 = (nums: number[], k: number): number => {
  nums.sort((a, b) => a - b);
  let maxCount = 0;
  let left = 0;
  let sum = 0;

  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];

    while (nums[right] * (right - left + 1) > sum + k) {
      sum -= nums[left];
      left++;
    }

    maxCount = Math.max(maxCount, right - left + 1);
  }

  return maxCount;
};

export * from './data';
// Approved
