
/*
  child
  sibling
  parent
*/
export const toLinkedListTree = (flow) => {
  const rootNode = flow;
  traverseTree(rootNode, null);
  return rootNode;
};

const traverseTree = (node, parent) => {
  if (node == null) return;
  node.parent = parent;

  // we need to link siblings
  if (Array.isArray(node.children)) {
    node.child = node.children[0] || null;

    let previousSibling = null;
    node.children.forEach(current => {
      traverseTree(current, node);
      if (previousSibling) previousSibling.sibling = current;
      previousSibling = current;
    });

    delete node.children;
  }
  else if (node.children) {
    node.child = node.children;
    traverseTree(node.child);
  }
};
