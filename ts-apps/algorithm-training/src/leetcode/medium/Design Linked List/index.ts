// Design your implementation of the linked list. You can choose to use a singly or doubly linked list.
// A node in a singly linked list should have two attributes: val and next. val is the value of the current node, and next is a pointer/reference to the next node.
// If you want to use the doubly linked list, you will need one more attribute prev to indicate the previous node in the linked list. Assume all nodes in the linked list are 0-indexed.
//
// Implement the MyLinkedList class:
//
// MyLinkedList() Initializes the MyLinkedList object.
// int get(int index) Get the value of the indexth node in the linked list. If the index is invalid, return -1.
// void addAtHead(int val) Add a node of value val before the first element of the linked list. After the insertion, the new node will be the first node of the linked list.
// void addAtTail(int val) Append a node of value val as the last element of the linked list.
// void addAtIndex(int index, int val) Add a node of value val before the indexth node in the linked list. If index equals the length of the linked list, the node will be appended to the end of the linked list. If index is greater than the length, the node will not be inserted.
// void deleteAtIndex(int index) Delete the indexth node in the linked list, if the index is valid.
//
//
// Example 1:
//
// Input
// ["MyLinkedList", "addAtHead", "addAtTail", "addAtIndex", "get", "deleteAtIndex", "get"]
// [[], [1], [3], [1, 2], [1], [1], [1]]
// Output
// [null, null, null, null, 2, null, 3]
//
// Explanation
// MyLinkedList myLinkedList = new MyLinkedList();
// myLinkedList.addAtHead(1);
// myLinkedList.addAtTail(3);
// myLinkedList.addAtIndex(1, 2);    // linked list becomes 1->2->3
// myLinkedList.get(1);              // return 2
// myLinkedList.deleteAtIndex(1);    // now the linked list is 1->3
// myLinkedList.get(1);              // return 3
//
//
// Constraints:
//
// 0 <= index, val <= 1000
// Please do not use the built-in LinkedList library.
// At most 2000 calls will be made to get, addAtHead, addAtTail, addAtIndex and deleteAtIndex.

// Design
export class MyLinkedList {
  constructor(
    public val?: number,
    public next: MyLinkedList | null = null,
  ) {}

  get(index: number): number | undefined {
    let node: MyLinkedList | null = this.getHead();

    for (let i = 0; i <= index; i++) {
      if (!node) return -1;

      if (i === index) return node?.val ?? -1;

      node = node.next;
    }

    return -1;
  }

  addAtHead(val: number): void {
    if (this.hasNoHead()) {
      this.val = val;

      return;
    }

    const newHead = new MyLinkedList(this.getHead().val, this.getHead().next);

    this.val = val;
    this.next = newHead;
  }

  addAtTail(val: number): void {
    if (this.hasNoHead()) {
      this.val = val;

      return;
    }

    const tail = this.getTail();

    tail.next = new MyLinkedList(val);
  }

  addAtIndex(index: number, val: number): void {
    if (index === 0) return this.addAtHead(val);

    let node: MyLinkedList | null = this.getHead();

    for (let i = 0; i < index; i++) {
      if (!node) return;

      if (i + 1 === index) {
        node.next = new MyLinkedList(val, node.next);
      }

      node = node.next;
    }
  }

  deleteAtIndex(index: number): void {
    if (this.hasNoHead()) return;

    let node: MyLinkedList | null = this.getHead();

    if (index === 0) return this.deleteHead();

    for (let i = 0; i < index; i++) {
      if (!node) return;

      if (i + 1 === index) {
        node!.next = node.next?.next as MyLinkedList;
      }

      node = node.next;
    }
  }

  private getTail(): MyLinkedList {
    let node: MyLinkedList | null = this.getHead();

    while (node?.next) {
      node = node.next;
    }

    return node;
  }

  private getHead(): MyLinkedList {
    return this;
  }

  private hasNoHead(): boolean {
    return !this.val && typeof this.val === 'undefined' && !this.next;
  }

  private deleteHead(): void {
    this.val = this.next?.val;
    this.next = this.next?.next as MyLinkedList;
  }
}

export const getMyLinkedList = (): MyLinkedList => {
  const myLinkedList = new MyLinkedList();

  myLinkedList.addAtHead(1);
  myLinkedList.addAtTail(3);
  myLinkedList.addAtIndex(1, 2); // linked list becomes 1->2->3
  myLinkedList.get(1); // return 2
  myLinkedList.deleteAtIndex(1); // now the linked list is 1->3
  myLinkedList.get(1);

  return myLinkedList;
};

// Accepted
