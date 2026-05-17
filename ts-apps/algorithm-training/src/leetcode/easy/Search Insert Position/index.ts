// Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.
//
// You must write an algorithm with O(log n) runtime complexity.
//
//
//
// Example 1:
//
// Input: nums = [1,3,5,6], target = 5
// Output: 2
// Example 2:
//
// Input: nums = [1,3,5,6], target = 2
// Output: 1
// Example 3:
//
// Input: nums = [1,3,5,6], target = 7
// Output: 4
//
//
// Constraints:
//
// 1 <= nums.length <= 104
// -104 <= nums[i] <= 104
// nums contains distinct values sorted in ascending order.
// -104 <= target <= 104

export const searchInsert = (nums: number[], target: number): number => {
  let start = 0;
  let end = nums.length - 1;
  const first = nums[start];
  const last = nums[end];
  const isFirst = target <= first;
  const isLast = target === last;
  const isAfterLast = target > last;

  if (isFirst) {
    return start;
  }

  if (isLast) {
    return end;
  }

  if (isAfterLast) {
    return end + 1;
  }

  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    const next = mid + 1;
    const prev = mid - 1;
    const midNum = nums[mid];
    const rightNum = nums[next];
    const leftNum = nums[prev];

    if (target === midNum) {
      return mid;
    }

    if (target === leftNum) {
      return prev;
    }

    if (target === rightNum) {
      return next;
    }

    if (target > midNum && target < rightNum) {
      return next;
    }

    if (target > midNum && target < rightNum) {
      return next;
    }

    if (target < midNum) {
      end = prev;
    } else {
      start = next;
    }
  }

  return -1;
};

// Accepted
