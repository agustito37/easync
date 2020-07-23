export default class VNodeIterator {
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
    return new VNodeIterator(this.node.child, this.onPush, this.onSkipSiblings);
  }

  next() {
    return new VNodeIterator(this.node.sibling, this.onPush, this.onSkipSiblings);
  }
}