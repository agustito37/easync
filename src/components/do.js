import Component from './component';

export default class Do extends Component {
  constructor(currentWork) {
    super(currentWork);

    this.state = { counter: 0 };
  }

  async execute() {
    let shouldLoop = true;

    if (this.state.counter) {
      shouldLoop = await this.evaluate(this.props.while);
    }
    this.state.counter++;

    if (shouldLoop) {
      this.current();
      this.child();
      return;
    } 
    this.next();
  }
};
