import { TreeNode } from '../../../../shared';

export const postOrderTraversalTree = new TreeNode(2);
postOrderTraversalTree.left = new TreeNode(1);
postOrderTraversalTree.right = new TreeNode(4);
postOrderTraversalTree.right.right = new TreeNode(3);

// export const postOrderTraversalTree = new TreeNode(1);
// postOrderTraversalTree.right = new TreeNode(2);
// postOrderTraversalTree.right.left = new TreeNode(3);

export const postorderTraversal = (root: TreeNode | null): number[] => {
  const resp: number[] = [];

  if (!root) return resp;

  const recursiveTraversal = (node: TreeNode): void => {
    if (node?.left) {
      recursiveTraversal(node.left);
    }

    if (node?.right) {
      recursiveTraversal(node.right);
    }

    if ((!node?.left && !node?.right) || node?.left || node?.right) {
      resp.push(node.val);
    }
  };

  recursiveTraversal(root);

  return resp;
};

// accepted
