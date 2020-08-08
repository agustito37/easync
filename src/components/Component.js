import ComponentIterator from '@components/ComponentIterator';
import NotImplementedError from '@utils/NotImplementedError';

export default class Component {
  constructor(currentWork, context) {
    this.currentWork = currentWork;
    this.props = currentWork.props;
    this.context = context;
  }
  
  async evaluate(condition) {
    // TODO: add cache to output of condition
    // maybe an attribute cache=true on the component
    return condition(this.context);
  }

  // TODO: create a queue and reverse it, so developers don't end up
  // dealing with stacks that seem less natural as queues when using
  onPush(work) {
    this.context.workStack.push(work); 
  }

  onSkipSiblings(work) {
    work.__skipSiblings = true; 
  }

  onParallelSiblings(work) {
    work.__inParallel = true;
  }

  current() {
    return new ComponentIterator(
      this.currentWork, 
      this.onPush.bind(this), 
      this.onSkipSiblings, 
      this.onParallelSiblings
    );
  }

  // TODO: add parent test
  parent() {
    return new ComponentIterator(
      this.currentWork.parent, 
      this.onPush.bind(this), 
      this.onSkipSiblings, 
      this.onParallelSiblings
    );
  }

  child() {
    return new ComponentIterator(
      this.currentWork.child, 
      this.onPush.bind(this), 
      this.onSkipSiblings, 
      this.onParallelSiblings
    );
  }

  next() {
    return new ComponentIterator(
      this.currentWork.sibling, 
      this.onPush.bind(this), 
      this.onSkipSiblings, 
      this.onParallelSiblings, 
      this.currentWork.__skipSiblings
    );
  }

  execute () { 
    throw new NotImplementedError("Execute not implemented");
  }
};

// FIX: must end with '__' cause a potential bug on the Regenerator Runtime (?)
Component.prototype.__isEasyncClass__ = true;
