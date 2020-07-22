class FlowWorker {
  constructor(flow) {
    this.flow = flow;
    this.context = {};
  }

  async perform(work) {
    const workFn = work.type;
    return workFn(work.props, this.context);
  }

  async evaluate(condition) {
    return condition(this.context);
  }

  async traverse() {
    const workStack = [this.flow];
    while(workStack.length) {
      const current = workStack.pop();
      const child = current.child;
      const sibling = current.sibling;

      // task
      if (typeof(current.type) === 'function') {
        const result = await this.perform(current);
        if (sibling) workStack.push(sibling);
      } 

      // loop while
      else if (current.type === 'loop') {
        if (child){
          // maybe we can make conditionals reactive so we only evaluate if its dependencies change
          const evaluationResult = await this.evaluate(current.props.while);
          if (evaluationResult) {
            workStack.push(current);
            workStack.push(child);
          }
        }
      }

      // do while
      else if (current.type === 'do') {
        if (child){
          // we can store a counter inside a context for this particular type of node
          // so the conditional is not executed the first time it processes this node
          // this mutation is safe when resuing the same flow in different workers
          // given you are creating a new Virtual Tree every time you call Easync.start
          let shouldContinue = true;
          if (!current.context) current.context = { counter: 0 };
          if (current.context.counter) {
            const shouldContinue = await this.evaluate(current.props.while);
          }
          if (shouldContinue) {
            workStack.push(current);
            workStack.push(child);
            current.context.counter++;
          }
        }
      }
    }
  }

  async start() {
    return this.traverse();
  }
}

export default FlowWorker;