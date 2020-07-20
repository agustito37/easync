import { toLinkedTree } from 'core/traverse';

export default class Easync {
  constructor(flow) {
    this.flow = toLinkedTree(flow);
  }

  start() {
    console.log(this.flow);
  }
};
