Passing FANG interviews, especially for arrays and strings, involves mastering several techniques and tricks. Here are the major ones:

1. **Two-Pointer Technique**:
   - Useful for problems involving sorted arrays, like finding pairs or triplets that sum to a specific value.
   - Examples: Two Sum, Three Sum, Container with Most Water.

2. **Sliding Window**:
   - Ideal for problems involving subarrays or substrings, often with fixed or dynamic lengths.
   - Examples: Maximum Subarray, Longest Substring Without Repeating Characters.

3. **Hashing**:
   - Utilize hash maps to store and retrieve values quickly, particularly useful for problems involving frequency counts or checking for duplicates.
   - Examples: Two Sum, Longest Substring Without Repeating Characters.

4. **Prefix Sum**:
   - Helps in efficiently calculating the sum of subarrays.
   - Examples: Subarray Sum Equals K, Range Sum Query.

5. **Sorting**:
   - Simplifies problems by imposing an order, making it easier to find patterns or compare elements.
   - Examples: Meeting Rooms, Merge Intervals.

6. **Binary Search**:
   - Useful for finding elements in sorted arrays or solving optimization problems.
   - Examples: Find Minimum in Rotated Sorted Array, Search in Rotated Sorted Array.

7. **Dynamic Programming**:
   - Applies to problems where you need to make decisions based on previous results, often involving subsequences or substrings.
   - Examples: Longest Increasing Subsequence, Edit Distance.

8. **String Matching Algorithms**:
   - Techniques like KMP or Rabin-Karp for efficient substring searches.
   - Examples: Implement strStr(), Find All Anagrams in a String.

9. **Trie Data Structure**:
   - Use a trie to store and search for prefixes or substrings efficiently.
   - Useful for problems involving word search, autocomplete, or dictionary operations.

### Example Problems and Patterns:

1. **Two-Pointer Technique**:

   ```typescript
   function twoSum(nums: number[], target: number): number[] {
     let left = 0;
     let right = nums.length - 1;
     while (left < right) {
       const sum = nums[left] + nums[right];
       if (sum === target) return [left, right];
       if (sum < target) left++;
       else right--;
     }
     return [];
   }
   ```

2. **Sliding Window**:

   ```typescript
   function maxSubArray(nums: number[]): number {
     let maxSoFar = nums[0];
     let maxEndingHere = nums[0];
     for (let i = 1; i < nums.length; i++) {
       maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
       maxSoFar = Math.max(maxSoFar, maxEndingHere);
     }
     return maxSoFar;
   }
   ```

3. **Hashing**:

   ```typescript
   function twoSum(nums: number[], target: number): number[] {
     const map = new Map<number, number>();
     for (let i = 0; i < nums.length; i++) {
       const complement = target - nums[i];
       if (map.has(complement)) return [map.get(complement)!, i];
       map.set(nums[i], i);
     }
     return [];
   }
   ```

4. **Prefix Sum**:
   ```typescript
   function subarraySum(nums: number[], k: number): number {
     const map = new Map<number, number>();
     map.set(0, 1);
     let sum = 0,
       count = 0;
     for (let num of nums) {
       sum += num;
       if (map.has(sum - k)) count += map.get(sum - k)!;
       map.set(sum, (map.get(sum) || 0) + 1);
     }
     return count;
   }
   ```

By mastering these techniques and practicing relevant problems, you will be better prepared for FANG interviews focused on arrays and strings.
