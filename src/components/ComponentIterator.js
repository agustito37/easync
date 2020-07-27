export default class ComponentIterator {
  constructor(node = {}, onPush, onSkipSiblings) {
    this.node = node;
    this.onPush = onPush;
    this.onSkipSiblings = onSkipSiblings;
  }

  push() {
    this.onPush(this.node);
    return this;
  }

  skipSiblings() {
    this.node.sibling && this.onSkipSiblings(this.node);
    return this;
  }

  current() {
    return this;
  }

  child() {
    return new ComponentIterator(this.node.child, this.onPush, this.onSkipSiblings);
  }

  next() {
    return new ComponentIterator(this.node.sibling, this.onPush, this.onSkipSiblings);
  }
}