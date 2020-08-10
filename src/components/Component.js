import ComponentIterator from "@components/ComponentIterator";
import NotImplementedError from "@utils/NotImplementedError";
import Logger from "@core/Logger";
import WorkTag from "@core/WorkTag";

export default class Component {
  constructor(work, context) {
    this.work = work;
    this.props = work.props;
    this.context = context;
  }

  async evaluate(condition) {
    this.context.worker.log && Logger.log(WorkTag.Condition, this.work);

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
      this.work,
      this.onPush.bind(this),
      this.onSkipSiblings,
      this.onParallelSiblings
    );
  }

  // TODO: add parent test
  parent() {
    return new ComponentIterator(
      this.work.parent,
      this.onPush.bind(this),
      this.onSkipSiblings,
      this.onParallelSiblings
    );
  }

  child() {
    return new ComponentIterator(
      this.work.child,
      this.onPush.bind(this),
      this.onSkipSiblings,
      this.onParallelSiblings
    );
  }

  next() {
    return new ComponentIterator(
      this.work.sibling,
      this.onPush.bind(this),
      this.onSkipSiblings,
      this.onParallelSiblings,
      this.work.__skipSiblings
    );
  }

  execute() {
    throw new NotImplementedError("Execute not implemented");
  }
}

// FIX: must end with '__' cause a potential bug on the Regenerator Runtime (?)
Component.prototype.__isEasyncClass__ = true;
