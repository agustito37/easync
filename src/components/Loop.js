import Component from './Component';

export default class Loop extends Component {
  async execute() {
    const shouldLoop = await this.evaluate(this.props.while);

    if (shouldLoop) {
      this.current().push();
      this.child().push();
      return;
    } 
    this.next().push();
  }
};
