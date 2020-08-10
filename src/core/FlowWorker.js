import Component from "@components/Component";

// TODO: define a default value for the context input
// TODO: async/await usage makes babel to include the Regenerator Runtime
// this is a heavy package, should improve this.
// TODO: add FlowWorker onFinish when all work is finished
// take into consideration when the user pauses or aborts

class FlowWorker {
  constructor(flow) {
    this.flow = flow;
    this.context;
    this.currentWorkLoopPromise;
    this.terminate = false;

    // TODO: implement logger
    this.log = false;
  }

  // TODO: create a parallel prop (parallel=true) instead of using a component
  // something as: if work.props.parallel should work the same as current __inParallel
  isParallel(work) {
    return !!(work && work.__inParallel);
  }

  isSubFlow(returnedValue) {
    return !!(returnedValue && returnedValue.__isVNode);
  }

  isClass(work) {
    return !!(work.type.prototype && work.type.prototype.__isEasyncClass__);
  }

  isFunction(work) {
    return typeof work.type === "function";
  }

  isFragment(work) {
    return typeof work.type === "string";
  }

  async execute(component) {
    return component.execute();
  }

  executeMemoized(work) {
    let component;

    if (work.__instance) {
      component = work.__instance;
    } else {
      component = new work.type(work, this.context);
      work.__instance = component;
    }

    return this.execute(component);
  }

  async perform(work) {
    return work.type(work.props, this.context);
  }

  async performMemoized(work) {
    let result;

    // TODO: add cache prop for tasks too
    if (work.__cache) {
      result = work.__cache;
    } else {
      result = await this.perform(work);

      // cache just for sublfows, not tasks
      if (this.isSubFlow(result)) work.__cache = result;
    }

    return result;
  }

  async executeInParallel(work) {
    let parallelWork = [];
    let sibling = work;

    while (sibling) {
      // TODO: improve these propagated mutations
      sibling.__skipSiblings = true;
      parallelWork.push(sibling);
      sibling = sibling.sibling;
    }

    // remove parallel property momentarily to avoid an infinite loop
    work.__inParallel = false;

    // TODO: race condition on context reference; shared between parallel work
    const outputs = await Promise.all(
      parallelWork.map((current) => this.nextWork(current))
    );
    work.__inParallel = true;

    const mergeFn = work.parent.props && work.parent.props.merge;
    if (mergeFn) this.context.output = mergeFn(outputs);
  }

  /*
    traverse linked list tree nodes of form:
    {
      parent
      child
      sibling
      __inParallel: execute all siblings in parallel
      __skipSiblings: don't execute next sibling
      __instance: instance of the class component { __isEasyncClass__ }
      __isVNode: determine if is a virtual node
      __cache: to memoize subflows
    }
  */
  async startWorkLoop(context = { workStack: [this.flow()] }) {
    this.context = context;

    this.terminate = false;
    while (context.workStack.length && !this.terminate) {
      const work = context.workStack.pop();
      await this.nextWork(work);
    }
  }

  async nextWork(work) {
    if (!work) return;

    const workStack = this.context.workStack;

    // parallel work
    if (this.isParallel(work)) {
      await this.executeInParallel(work);
      return;
    }

    // class component
    if (this.isClass(work)) {
      await this.executeMemoized(work);
      return;
    }

    // functional component
    if (this.isFunction(work)) {
      const output = await this.performMemoized(work);

      // subflow
      if (this.isSubFlow(output)) {
        workStack.push(output);
        return;
      }

      // task
      else {
        // TODO: create input/output tests
        this.context.input = output !== undefined ? output : this.context.input;

        if (work.__skipSiblings) {
          work.__skipSiblings = false;
        } else {
          workStack.push(work.sibling);
        }
        return output;
      }
    }

    // fragment (tag)
    if (this.isFragment(work)) {
      workStack.push(work.sibling);
      workStack.push(work.child);
      return;
    }
  }

  start(flow) {
    if (flow) this.flow = flow;
    this.currentWorkLoopPromise = this.startWorkLoop();
    return this.currentWorkLoopPromise;
  }

  // TODO: create a pause component (?)
  pause() {
    this.terminate = true;
    return this.currentWorkLoopPromise;
  }

  resume() {
    this.currentWorkLoopPromise = this.startWorkLoop(this.context);
    return this.currentWorkLoopPromise;
  }

  async abort() {
    this.terminate = true;
    await this.currentWorkLoopPromise;

    // FIX: resume after abort should restart the flow
    this.context = undefined;
  }

  // TODO: implement save controls
  // browser: localstorage
  // node: serialized text file
  async save() {}
  async load() {}
}

export default FlowWorker;
