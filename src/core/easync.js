import { toLinkedListTree } from 'core/traverse';

export default class Easync {
  constructor(flow) {
    this.flow = toLinkedListTree(flow);
  }

  start() {
    console.log(this.flow);
  }
};
