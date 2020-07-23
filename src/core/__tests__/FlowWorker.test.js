import FlowWorker from '@core/FlowWorker';
import htm from '@core/VNode';
import Component from '@components/Component';
import NotImplementedError from '@utils/NotImplementedError';

describe("FlowWorker", () => {
  it("starts a flow", async () => {
    const testTask = jest.fn();
    const node = htm`<${testTask} />`;

    const worker = new FlowWorker(node);

    await worker.start();
    expect(testTask).toBeCalledTimes(1);
  });

  it("executes a component", () => {
    const node = htm`<${Component} />`;

    const worker = new FlowWorker(node);

    expect(() => worker.executeMemoized(node)).rejects.toThrow(NotImplementedError);
  });

  it("performs a task", async () => {
    const testTask = jest.fn();
    const node = htm`<${testTask} />`;

    const worker = new FlowWorker(node);

    await worker.performMemoized(node);
    expect(testTask).toBeCalledTimes(1);
  });

  it("performs a subflow", async () => {
    const testTask = jest.fn();
    const testSubFlow = () => htm`<${testTask} />`;
    const node = htm`<${testSubFlow} />`;

    const worker = new FlowWorker(node);

    const innerWork = await worker.performMemoized(node);
    await worker.performMemoized(innerWork);
    expect(testTask).toBeCalledTimes(1);
  });
});