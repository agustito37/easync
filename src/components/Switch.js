import Component from './Component';

export default class Switch extends Component {
  async execute() {
    this.next().push();
    
    const evaluation = await this.evaluate(this.props.condition);

    let child = this.child();
    while(child.node.props.case !== evaluation) {
      child = child.next();
    }

    // skip propagation over siblings
    child.skipSiblings().push();
  }
};
