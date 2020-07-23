import Component from '@components/Component';
class FlowWorker {
  constructor(flow) {
    this.flow = flow;

    // TODO: implement context for tasks and evaluations (?)
    this.context = {};
  }

  async start() {
    return this.traverse();
  }

  async execute(component) {
    return component.execute();
  }

  async perform(work) {
    return work.type(work.props);
  }

  async traverse() {
    const workStack = [this.flow];
    while(workStack.length) {
      const currentWork = workStack.pop();
      if (!currentWork) continue;
      currentWork.workStack = workStack;

      // class component
      if (currentWork.type.prototype.__isEasyncClass__) {
        let component;
        if (currentWork.__component__) {
          component = currentWork.__component__;
        } else {
          component = new currentWork.type(currentWork);
          currentWork.__component__ = component;
        }
        await this.execute(component);
      } 

      // functional component
      else if (typeof(currentWork.type) === 'function') {
        const result = await this.perform(currentWork);

        // subflow
        if (result && result.__isVNode__) {
          workStack.push(result);
        } 

        // task
        else {
          workStack.push(currentWork.sibling);
        }
      } 
    }
  }
}

export default FlowWorker;