import FlowWorker from '@core/FlowWorker';
import htm from '@core/VNode';
import Component from '@components/Component';

describe("FlowWorker", () => {
  it("starts a flow", () => {
    const testTask = jest.fn();
    const node = htm`<${testTask} />`;

    const worker = new FlowWorker(node);

    worker.start();
    expect(testTask).toBeCalledTimes(1);
  });

  it("executes a component", () => {
    const node = htm`<${Component} />`;

    const component = new node.type(node);
    const worker = new FlowWorker(node);

    expect(() => worker.execute(component)).rejects.toThrow(Error);
  });

  it("performs a task", () => {
    const testTask = jest.fn();
    const node = htm`<${testTask} />`;

    const worker = new FlowWorker(node);

    worker.perform(node);
    expect(testTask).toBeCalledTimes(1);
  });
});