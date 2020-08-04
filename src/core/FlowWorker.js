import Component from "@components/Component";

class FlowWorker {
  constructor(flow) {
    this.flow = flow;

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

  async start() {
    return this.traverse();
  }

  async execute(component) {
    component.execute();
  }

  async executeMemoized(work, context) {
    let component;

    if (work.__instance) {
      component = work.__instance;
    } else {
      component = new work.type(work, context);
      work.__instance = component;
    }

    this.execute(component);
  }

  async perform(work, context) {
    return work.type(work.props, context);
  }

  async performMemoized(work, context) {
    let result;

    if (work.__cache) {
      result = work.__cache;
    } else {
      result = await this.perform(work, context);

      // cache just for sublfows, not tasks
      if (this.isSubFlow(result)) work.__cache = result;
    }

    return result;
  }

  async executeParallel(work, workStack, context) {
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
      parallelWork.map((current) => this.nextWork(current, workStack, context))
    );
    const mergeFn = work.parent.props && work.parent.props.merge;
    if (mergeFn) context.output = mergeFn(outputs);
  }

  async traverse() {
    const workStack = [this.flow];
    const context = {};

    while (workStack.length) {
      const currentWork = workStack.pop();
      if (!currentWork) return;

      currentWork.workStack = workStack;

      await this.nextWork(currentWork, workStack, context);
    }
  }

  async nextWork(work, workStack, context) {
    // parallel work
    if (this.isParallel(work)) {
      this.executeParallel(work, workStack, context);
      return;
    }

    // class component
    else if (this.isClass(work)) {
      await this.executeMemoized(work, context);
      return;
    }

    // functional component
    else if (this.isFunction(work)) {
      const output = await this.performMemoized(work, context);

      // subflow
      if (this.isSubFlow(output)) {
        workStack.push(output);
        return;
      }

      // task
      else {
        context.input = output;

        if (work.__skipSiblings) {
          work.__skipSiblings = false;
        } else {
          workStack.push(work.sibling);
        }
        return output;
      }
    }

    // fragment (tag)
    else if (this.isFragment(work)) {
      workStack.push(work.sibling);
      workStack.push(work.child);
      return;
    }
  }

  // TODO: implement flow controls
  async pause() {}
  async resume() {}
  async abort() {}
  async save() {}
  async load() {}
}

export default FlowWorker;
