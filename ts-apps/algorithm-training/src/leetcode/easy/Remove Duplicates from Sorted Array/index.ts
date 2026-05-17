const areNumbersInRange = (nums: number[]): boolean =>
  nums.some((num) => num <= 100 && num >= -100);

const isNumbersLengthValid = (nums: number[]): boolean =>
  nums.length >= 0 && nums.length <= 3 * 10 ** 4;

const areWithinConstraints = (nums: number[]): boolean =>
  areNumbersInRange(nums) && isNumbersLengthValid(nums);

export const removeDuplicates = (nums: number[] = []): number | undefined => {
  if (!areWithinConstraints(nums)) return;

  for (let i = nums.length - 1; i >= 0; i--) {
    if (nums.filter((foundingNumber) => nums[i] === foundingNumber).length > 1) {
      nums.splice(i, 1);
    }
  }

  return nums.length;
};

// approved
