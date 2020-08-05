import Component from "@components/Component";

class FlowWorker {
  constructor(flow) {
    this.flow = flow;
    this.context;
    this.currentWorkLoopPromise;
    this.terminate = false;

    // TODO: implement logger
    this.log = false;
  }

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

    if (work.__cache) {
      result = work.__cache;
    } else {
      result = await this.perform(work);

      // cache just for sublfows, not tasks
      if (this.isSubFlow(result)) work.__cache = result;
    }

    return result;
  }

  async executeParallel(work) {
    let parallelWork = [];
    let sibling = work;

    while (sibling) {
      // TODO: improve these propagated mutations
      sibling.__skipSiblings = true;
      sibling.__inParallel = false;
      parallelWork.push(sibling);
      sibling = sibling.sibling;
    }

    // TODO: race condition on context reference; shared between parallel work
    const outputs = await Promise.all(
      parallelWork.map((current) => this.nextWork(current, this.context.workStack))
    );
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
  async startWorkLoop(context = {}, workStack = [this.flow]) {
    this.terminate = false;
    this.context = context;
    this.context.workStack = workStack;

    while (workStack.length && !this.terminate) {
      const currentWork = workStack.pop();
      await this.nextWork(currentWork, workStack);
    }
  } 

  async nextWork(work, workStack) {
    if (!work) return;
    
    // parallel work
    if (this.isParallel(work)) {
      await this.executeParallel(work);
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
        this.context.input = output;

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

  start() {
    this.currentWorkLoopPromise = this.startWorkLoop();
    return this.currentWorkLoopPromise;
  }

  // TODO: create a pause component
  pause() {
    this.terminate = true;
    return this.currentWorkLoopPromise;
  }

  resume() {
    this.currentWorkLoopPromise = this.startWorkLoop(this.context, this.context.workStack);
    return this.currentWorkLoopPromise;
  }

  abort() {
    this.terminate = true;
    return this.currentWorkLoopPromise;
  }

  // TODO: implement save controls
  // browser: localstorage
  // node: serialized text file
  async save() {}
  async load() {}
}

export default FlowWorker;
