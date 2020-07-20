/*
  queue tree traversal mutation
  input  node : { children, ...otherProps }
  output node : { child, sibling, parent, ...otherProps }
*/
export const toLinkedTree = (rootNode) => {
  const queue = [rootNode];

  while(queue.length) {
    const current = queue.shift();
    
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

      delete current.children;
    }
  }

  return rootNode;
};
