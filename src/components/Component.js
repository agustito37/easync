import ComponentIterator from '@components/ComponentIterator';
import NotImplementedError from '@utils/NotImplementedError';

export default class Component {
  constructor(currentWork, context) {
    this.currentWork = currentWork;
    this.props = currentWork.props;
    this.context = context;
  }
  
  async evaluate(condition) {
    return condition(this.context);
  }

  onPush(work) {
    this.currentWork.workStack.push(work); 
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

Component.prototype.__isEasyncClass__ = true;
