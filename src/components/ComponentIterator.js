export default class ComponentIterator {
  constructor(node = {}, onPush, onSkipSiblings, onParallelSiblings, isSkipped = false) {
    this.node = node;
    this.onPush = onPush;
    this.onSkipSiblings = onSkipSiblings;
    this.onParallelSiblings = onParallelSiblings;
    this.isSkipped = isSkipped;
  }

  push() {
    this.node.__isVNode && !this.isSkipped && this.onPush(this.node);
    return this;
  }

  skipSiblings() {
    this.node.sibling && this.onSkipSiblings(this.node);
    return this;
  }

  parallelSiblings() {
    this.onParallelSiblings(this.node);
    return this;
  }

  current() {
    return this;
  }

  parent() {
    return new ComponentIterator(this.node.parent, this.onPush, this.onSkipSiblings, this.isSkipped);
  }

  child() {
    return new ComponentIterator(this.node.child, this.onPush, this.onSkipSiblings, this.isSkipped);
  }

  next() {
    return new ComponentIterator(this.node.sibling, this.onPush, this.onSkipSiblings, this.isSkipped);
  }
}