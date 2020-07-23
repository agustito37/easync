import Component from '@components/Component';

class FlowWorker {
  constructor(flow) {
    this.flow = flow;

    // TODO: implement context for tasks and evaluations (?)
    // also, we have a pending implementation of inputs and outputs of tasks
    this.context = {};
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

  async start() {
    return this.traverse();
  }

  async execute(component) {
    return component.execute();
  }

  async executeMemoized(work) {
    let component;

    if (work.__instance) {
      component = work.__instance;
    } else {
      component = new work.type(work);
      work.__instance = component;
    }

    return this.execute(component);
  }

  async perform(work) {
    return work.type(work.props);
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

  async traverse() {
    const workStack = [this.flow];
    while(workStack.length) {
      const currentWork = workStack.pop();
      if (!currentWork) continue;

      currentWork.workStack = workStack;

      // class component
      if (this.isClass(currentWork)) {
        await this.executeMemoized(currentWork);
      } 

      // functional component
      else if(this.isFunction(currentWork)) {
        const result = await this.performMemoized(currentWork);

        // subflow
        if (this.isSubFlow(result)) {
          workStack.push(result);
        } 

        // task
        else {
          if (currentWork.__skipSiblings) {
            currentWork.__skipSiblings = false;
          } else {
            workStack.push(currentWork.sibling);
          }
        }
      } 
    }
  }
}

export default FlowWorker;