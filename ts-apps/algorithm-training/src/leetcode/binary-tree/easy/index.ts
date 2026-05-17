import { logger } from '../../../shared';

import { inorderTraversal, inorderTraversalTree } from './Binary Tree Inorder Traversal';
import { levelOrder } from './Binary Tree Level Order Traversal';
import {
  postorderTraversal,
  postOrderTraversalTree,
} from './Binary Tree Postorder Traversal';
import {
  preorderTraversal,
  preorderTraversalTree,
} from './Binary Tree Preorder Traversal';
import { maxDepth } from './Maximum Depth of Binary Tree';
import { isSymmetric, symmetricTree } from './Symmetric Tree';

export const main = (): void => {
  logger(preorderTraversal, preorderTraversalTree);

  logger(inorderTraversal, inorderTraversalTree);

  logger(postorderTraversal, postOrderTraversalTree);

  logger(levelOrder, postOrderTraversalTree);

  logger(maxDepth, postOrderTraversalTree);

  logger(isSymmetric, symmetricTree);
};
