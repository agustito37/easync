import VNodeIterator from '@components/VNodeIterator';

export default class Component {
  constructor(currentWork) {
    this.currentWork = currentWork;
    this.props = currentWork.props;
  }

  // maybe we can make conditionals reactive so we only evaluate if its dependencies change
  async evaluate(condition) {
    return condition();
  }

  onPush(work) {
    this.currentWork.workStack.push(work); 
  }

  onSkipSiblings(work) {
    work.__skipSiblings = true; 
  }

  current() {
    return new VNodeIterator(this.currentWork, this.onPush.bind(this), this.onSkipSiblings);
  }

  child() {
    return new VNodeIterator(this.currentWork.child, this.onPush.bind(this), this.onSkipSiblings);
  }

  next() {
    return new VNodeIterator(this.currentWork.sibling, this.onPush.bind(this), this.onSkipSiblings);
  }

  execute () { 
    throw new Error("Execute not implemented");
  }
};

Component.prototype.__isEasyncClass__ = true;
