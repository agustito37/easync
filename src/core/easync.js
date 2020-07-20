export default class Easync {
  constructor(flow) {
    this.flow = flow;
  }

  // returns a promise?
  start() {
    console.log(this.flow);
    
    // create an observer maybe
    if (this.onFinish) this.onFinish();
  }
};
