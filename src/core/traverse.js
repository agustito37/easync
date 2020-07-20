/*
  queue tree traversal mutation
  input  node : { children, props }
  output node : { child, sibling, parent, ...props }
*/
export const jsxToLinkedTree = (rootNode) => {
  const queue = [rootNode];

  while(queue.length) {
    const current = queue.shift();
    
    // relations mutations
    if (current.children) {
      const isArray = Array.isArray(current.children);

      if (isArray && current.children.length) {
        current.child = current.children[0];

        let previousSibling;
        current.children.forEach((child) => {
          if (previousSibling) previousSibling.sibling = child;
          previousSibling = child;
          child.parent = current;
          queue.push(child);
        });
      } else if (!isArray) {
        current.child = current.children;
        current.child.parent = current;
        queue.push(current.children);
      }
    }

    // properties mutation
    Object.assign(current, current.props);
    delete current.props;
    delete current.children;
  }

  return rootNode;
};
