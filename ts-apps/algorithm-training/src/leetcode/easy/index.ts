import { logger } from '../../shared';

import { maxProfit1 } from './Best Time to Buy and Sell Stock';
import { maxProfit2 } from './Best Time to Buy and Sell Stock II';
import { climbStairs } from './Climbing Stairs';
import { containsDuplicate } from './Contains Duplicate';
import { countPrimes } from './Count Primes';
import { deleteNode } from './Delete Node in a Linked List';
import { fibonacci } from './Fibonacci';
import { solution } from './First Bad Version';
import { firstUniqChar } from './First Unique Character in a String';
import { rob } from './House Robber';
import { strStr } from './Implement strStr()';
import { intersect } from './Intersection of Two Arrays II';
import { findWords } from './Keyboard Row';
import { lengthOfLastWord } from './Length of Last Word';
import { longestCommonPrefix } from './Longest Common Prefix';
import { maxSubArray } from './Maximum Subarray';
import {
  mergeTwoLists,
  mergeTwoListsInput1,
  mergeTwoListsInput2,
} from './Merge Two Sorted Lists';
import { moveZeroes } from './Move Zeroes  ';
import {
  isPalindrome as isPalindromeLinkedList,
  isPalindromeList,
} from './Palindrome Linked List';
import { plusOne } from './Plus One';
import { isPowerOfThree } from './Power of Three';
import { removeDuplicates } from './Remove Duplicates from Sorted Array';
import { removeElements, removeElementsLinkedList } from './Remove Linked List Elements';
import {
  removeNthFromEnd,
  removeNthFromEndInput,
} from './Remove Nth Node From End of List';
import { reverse } from './Reverse Integer';
import { reverseList, reverseListInput } from './Reverse Linked List';
import { reverseString } from './Reverse String';
import { romanToInt } from './Roman to Integer';
import { rotate } from './Rotate Array';
import { rotate as rotateImage } from './Rotate Image';
import { searchInsert } from './Search Insert Position';
import { singleNumber } from './Single Number';
import { mySqrt } from './Sqrt(x)';
import { sumNumbers } from './sum numbers';
import { twoSum } from './Two Sum';
import { isAnagram } from './Valid Anagram';
import { isPalindrome } from './Valid Palindrome';
import { isValidSudoku } from './Valid Sudoku';

export const main = (): void => {
  logger(removeDuplicates, [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2]);

  logger(maxProfit2, [7, 6, 4, 3, 1, 11, 12]);

  logger(rotate, [1, 2, 3, 4, 5, 6, 7], 3);

  logger(containsDuplicate, [1, 2, 3, 4, 5, 6]);

  logger(singleNumber, [1]);

  logger(intersect, [1, 2, 2, 1], [2, 2]);

  logger(twoSum, [3, 3], 6);

  logger(isValidSudoku, [
    ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
    ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
    ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
    ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
    ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
    ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
    ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
    ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
    ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
  ]);

  logger(sumNumbers(1)(2), 3);

  logger(fibonacci, 10);

  logger(climbStairs, 10);

  logger(maxProfit1, [7, 1, 5, 3, 6, 4]);

  logger(isPowerOfThree, 27);

  logger(isAnagram, 'rat', 'car');

  logger(longestCommonPrefix, ['flower']);

  logger(strStr, 'mississippi', 'issip');

  logger(isPalindrome, ' ');

  logger(
    solution((n) => n === 1),
    1,
  );

  logger(plusOne, [6, 1, 4, 5, 3, 9, 0, 1, 9, 5, 1, 8, 6, 7, 0, 5, 5, 4, 3]);

  logger(moveZeroes, [0, 1, 0, 3, 2]);

  logger(reverseString, ['1', '2', '3', '4', '5', '6', '7', '8', '9']);

  logger(reverse, 12030000);

  logger(firstUniqChar, 'aabb');

  logger(romanToInt, 'MCMXCIV');

  logger(countPrimes, 10000);

  logger(maxSubArray, [-2, 1]);

  logger(rob, [8, 2, 8, 9, 2]);

  logger(findWords, ['Hello', 'Alaska', 'Dad', 'Peace']);

  logger(deleteNode);

  logger(removeNthFromEnd, removeNthFromEndInput, 1);

  logger(reverseList, reverseListInput);

  logger(rotateImage, [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);

  logger(mergeTwoLists, mergeTwoListsInput1, mergeTwoListsInput2);

  logger(isPalindromeLinkedList, isPalindromeList);

  console.log('removeElements', removeElements(removeElementsLinkedList, 1));

  logger(searchInsert, [1, 3, 5, 6], 5);

  logger(lengthOfLastWord, 'luffy is still joyboy');

  logger(mySqrt, 900);
};
