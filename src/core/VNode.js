import htm from 'htm';

// create test for this: given an input x expects the output y
// output node: { child, sibling, parent, props }
const h = (type, props, ...children) => {
  const node = { type, props };

  if (children.length) {
    node.child = children[0];

    let previousSibling;
    children.forEach((child) => {
      if (previousSibling) previousSibling.sibling = child;
      previousSibling = child;
      node.child.parent = node;
    });
  }

  node.__isVNode__ = true;
  return node;
};

export default htm.bind(h);
