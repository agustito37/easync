import Component from './Component';

export default class Do extends Component {
  constructor(work, context) {
    super(work, context);

    this.state = { counter: 0 };
  }

  async execute() {
    let shouldLoop = true;

    if (this.state.counter) {
      shouldLoop = await this.evaluate(this.props.while);
    }
    this.state.counter++;

    if (shouldLoop) {
      this.current().push();
      this.child().push();
      return;
    } 

    // reset counter for next time
    this.state.counter = 0;
    this.next().push();
  }
};
