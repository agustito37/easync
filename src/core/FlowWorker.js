import Component from '@components/Component';

class FlowWorker {
  constructor(flow) {
    this.flow = flow;
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
    return typeof(work.type) === 'function';
  }

  isFragment(work) {
    return typeof(work.type) === 'string';
  }

  async start() {
    return this.traverse();
  }

  async execute(component) {
    return component.execute();
  }

  async executeMemoized(work, context) {
    let component;

    if (work.__instance) {
      component = work.__instance;
    } else {
      component = new work.type(work, context);
      work.__instance = component;
    }

    return this.execute(component);
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

  async traverse() {
    const workStack = [this.flow];
    const context = { };

    while(workStack.length) {
      const currentWork = workStack.pop();
      if (!currentWork) return;

      currentWork.workStack = workStack;

      await this.nextWork(currentWork, workStack, context);
    }
  }

  async nextWork(work, workStack, context) {
    // parallel work
    if (this.isParallel(work)) {
      let parallelWork = [];
      let sibling = work;

      while(sibling) {
        sibling.__skipSiblings = true;
        parallelWork.push(sibling);
        sibling = work.sibling;
      }

      const outputs = await Promise.all(parallelWork.map((current) => this.nextWork(current, workStack, context)));
      const mergeFn = work.parent.props.merge;
      if (mergeFn) context.output = mergeFn(outputs);
    }

    // class component
    else if (this.isClass(work)) {
      await this.executeMemoized(work, context);
    } 

    // functional component
    else if(this.isFunction(work)) {
      const output = await this.performMemoized(work, context);

      // subflow
      if (this.isSubFlow(output)) {
        workStack.push(output);
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
    else if (this.isFragment(work)) {
      workStack.push(work.sibling);
      workStack.push(work.child);
    }
  }
}

export default FlowWorker;