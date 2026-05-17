// Given the head of a singly linked list, return true if it is a palindrome or false otherwise.
//
// Example 1: Input: head = [1,2,2,1] Output: true
// Example 2: Input: head = [1,2] Output: false
//
// Constraints: 1 <= list length <= 10^5, 0 <= Node.val <= 9
// Follow up: Could you do it in O(n) time and O(1) space?

import { ListNode } from '../../../shared';

export const isPalindromeList = new ListNode(1);
isPalindromeList.next = new ListNode(2);
isPalindromeList.next.next = new ListNode(2);
isPalindromeList.next.next.next = new ListNode(1);

// time complexity O(n), space complexity O(n)
export const isPalindrome = (head: ListNode | null): boolean => {
  if (!head?.next) return true;

  const list: number[] = [];
  let node: ListNode | null = head;

  while (node) {
    list.push(node.val);
    node = node.next;
  }

  // two pointers
  for (let i = 0, j = list.length - 1; i < j; i++, j--) {
    if (list[i] !== list[j]) return false;
  }

  return true;
};

// Accepted

// O(n), O(1)
export const isPalindrome2 = (head: ListNode | null): boolean => {
  if (!head?.next) return true;

  let length = 0;
  let node: ListNode | null = head;

  while (node) {
    node = node.next;
    length++;
  }

  node = head;

  while (node) {
    // TODO implement comparing the first and last node
    node = node.next;
  }

  return true;
};
