import Component from './Component';

export default class Evaluate extends Component {
  async execute() {
    const evaluation = await this.evaluate(this.props.condition);

    let child = this.child();
    if (!evaluation) {
      child = child.next();
    }

    // skip propagation over siblings
    child.skipSiblings().push();
  }
};
