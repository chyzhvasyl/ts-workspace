// You are given a doubly linked list, which contains nodes that have a next pointer, a previous pointer, and an additional child pointer. This child pointer may or may not point to a separate doubly linked list, also containing these special nodes. These child lists may have one or more children of their own, and so on, to produce a multilevel data structure as shown in the example below.
//
// Given the head of the first level of the list, flatten the list so that all the nodes appear in a single-level, doubly linked list. Let curr be a node with a child list. The nodes in the child list should appear after curr and before curr.next in the flattened list.
//
// Return the head of the flattened list. The nodes in the list must have all of their child pointers set to null.
//
//
//
// Example 1:
//
//
// Input: head = [1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]
// Output: [1,2,3,7,8,11,12,9,10,4,5,6]
// Explanation: The multilevel linked list in the input is shown.
// After flattening the multilevel linked list it becomes:
//
// Example 2:
//
//
// Input: head = [1,2,null,3]
// Output: [1,3,2]
// Explanation: The multilevel linked list in the input is shown.
// After flattening the multilevel linked list it becomes:
//
// Example 3:
//
// Input: head = []
// Output: []
// Explanation: There could be empty list in the input.
//
//
// Constraints:
//
// The number of Nodes will not exceed 1000.
// 1 <= Node.val <= 105
//
//
// How the multilevel linked list is represented in test cases:
//
// We use the multilevel linked list from Example 1 above:
//
//  1---2---3---4---5---6--NULL
//          |
//          7---8---9---10--NULL
//              |
//              11--12--NULL
// The serialization of each level is as follows:
//
// [1,2,3,4,5,6,null]
// [7,8,9,10,null]
// [11,12,null]
// To serialize all levels together, we will add nulls in each level to signify no node connects to the upper node of the previous level. The serialization becomes:
//
// [1,    2,    3, 4, 5, 6, null]
//              |
// [null, null, 7,    8, 9, 10, null]
//                    |
// [            null, 11, 12, null]
// Merging the serialization of each level and removing trailing nulls we obtain:
//
// [1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]

class _Node {
  val: number;

  prev: _Node | null;

  next: _Node | null;

  child: _Node | null;

  constructor(val?: number, prev?: _Node, next?: _Node, child?: _Node) {
    this.val = val === undefined ? 0 : val;
    this.prev = prev === undefined ? null : prev;
    this.next = next === undefined ? null : next;
    this.child = child === undefined ? null : child;
  }
}

const flattenList = new _Node(1);

flattenList.next = new _Node(2);
flattenList.next.prev = flattenList;
flattenList.next.next = new _Node(3);
flattenList.next.next.prev = flattenList.next;

flattenList.next.child = new _Node(4);
flattenList.next.next.next = new _Node(5);
flattenList.next.next.next.prev = flattenList.next.next;

export const flatten = (head: _Node | null): _Node | null => {
  const restNodes: _Node[] = [];
  let newHead: _Node | null = head;

  while (newHead) {
    if (newHead.child) {
      if (newHead.next) {
        newHead.next.prev = null;
        restNodes.unshift(newHead.next);
      }

      newHead.next = newHead.child;
      newHead.next.prev = newHead;
      newHead.child = null;
    }

    if (newHead.next) {
      newHead = newHead.next;
    } else {
      break;
    }
  }

  for (let i = 0; i < restNodes.length; i++) {
    const restNode = restNodes[i];

    if (newHead) {
      newHead.next = restNode;
      restNode.prev = newHead;
    }

    // causes infinite loop
    while (newHead?.next) {
      newHead = newHead?.next;
    }
  }

  return head;
};

// Accepted
