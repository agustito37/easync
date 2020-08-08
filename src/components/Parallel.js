import Component from './Component';

export default class Parallel extends Component {
  execute() {
    this.next().push();
    this.child().parallelSiblings().push();
  }
};
