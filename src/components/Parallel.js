import Component from './Component';

export default class Parallel extends Component {
  async execute() {
    this.next().push();
    this.child().parallelSiblings().push();
  }
};
