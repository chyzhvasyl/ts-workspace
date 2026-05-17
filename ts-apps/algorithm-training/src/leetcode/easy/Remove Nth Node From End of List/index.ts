import { ListNode } from '../../../shared';

export const removeNthFromEndInput = new ListNode(1);
removeNthFromEndInput.next = new ListNode(2);
removeNthFromEndInput.next.next = new ListNode(3);
removeNthFromEndInput.next.next.next = new ListNode(4);
removeNthFromEndInput.next.next.next.next = new ListNode(5);

export const removeNthFromEnd = (head: ListNode, n: number): ListNode | null => {
  let length = 0;
  let currentNode: ListNode | null = head;

  while (currentNode) {
    length++;
    currentNode = currentNode.next;
  }

  if (n > length) return head;

  if (length === 1 && n === 1) return null;

  currentNode = head;

  const lastIndex = length - (n === 1 ? n : n - 1);

  for (let i = 0; i <= lastIndex; i++) {
    const next: ListNode | null = currentNode?.next ?? null;
    const range = length - n;

    if (n === 1 && range - 1 === i) {
      currentNode!.next = null;
      break;
    }

    if (range === i) {
      currentNode!.val = next!.val;
      currentNode!.next = next!.next;
    }

    if (currentNode) {
      currentNode = currentNode.next;
    }
  }

  return head;
};

// Accepted
