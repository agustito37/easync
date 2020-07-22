import Component from './component';

export default class Loop extends Component {
  async execute() {
    const shouldLoop = await this.evaluate(this.props.while);

    if (shouldLoop) {
      this.current();
      this.child();
      return;
    } 
    this.next();
  }
};
