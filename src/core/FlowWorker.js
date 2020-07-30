import Component from '@components/Component';

class FlowWorker {
  constructor(flow) {
    this.flow = flow;
  }

  isParallel(work) {
    return !!work.props.parallel;
  }

  isSubFlow(returnedValue) {
    return returnedValue && returnedValue.__isVNode;
  }

  isClass(work) {
    return work.type.prototype && work.type.prototype.__isEasyncClass__;
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

  async executeInParallel(work) {
    const child = work.child;
    if(child) {
      const parallelProp = work.props.parallel;
      const parallelWork = [];

      while(child) {
        parallelWork.push(child);
        child = child.sibling;
      }
      const outputs = await Promise.all(parallelWork.map((childWork) => this.executeWork(childWork)));

      if (this.isFunction(parallelProp)) {
        this.context.input = parallelProp(outputs);
      }
    }
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

      // class component
      if (this.isClass(currentWork)) {
        await this.executeMemoized(currentWork, context);
        return;
      } 

      // functional component
      else if(this.isFunction(currentWork)) {
        const output = await this.performMemoized(currentWork, context);

        // subflow
        if (this.isSubFlow(output)) {
          workStack.push(output);
          return;
        }

        // task
        else {
          this.context.input = output;
          
          if (currentWork.__skipSiblings) {
            currentWork.__skipSiblings = false;
          } else {
            workStack.push(currentWork.sibling);
          }

          return output;
        }
      } 

      // fragment (tag)
      else if (this.isFragment(currentWork)) {
        workStack.push(currentWork.sibling);
        workStack.push(currentWork.child);
        return;
      }
    }
  }
}

export default FlowWorker;