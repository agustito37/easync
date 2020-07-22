export default class Component {
  constructor(currentWork) {
    this.currentWork = currentWork;
    this.props = currentWork.props;
  }

  // maybe we can make conditionals reactive so we only evaluate if its dependencies change
  async evaluate(condition) {
    return condition();
  }

  current() {
    this.currentWork.workStack.push(this.currentWork);
  }

  child() {
    this.currentWork.workStack.push(this.currentWork.child);
  }

  next() {
    this.currentWork.workStack.push(this.currentWork.sibling);
  }

  execute () { 
    throw new Error("Execute not implemented");
  }
};

Component.prototype.__isEasyncClass__ = true;
