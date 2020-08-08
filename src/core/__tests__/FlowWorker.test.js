import FlowWorker from '@core/FlowWorker';
import htm from '@core/VNode';
import Component from '@components/Component';
import NotImplementedError from '@utils/NotImplementedError';

describe("FlowWorker", () => {
  let worker;

  it("starts a flow", async () => {
    const testTask = jest.fn();
    const flow = () => htm`<${testTask} />`;

    worker = new FlowWorker(flow);

    await worker.start();
    expect(testTask).toBeCalledTimes(1);
  });

  it("pauses a flow", async () => {
    const testTask = jest.fn(async () => {
      worker.pause();
    });
    const flow = () => htm`
      <>
        <${testTask} />
        <${testTask} />
      <//>
    `;

    worker = new FlowWorker(flow);

    await worker.start();
    expect(testTask).toBeCalledTimes(1);
  });

  it("resumes the flow", async () => {
    const testTask = jest.fn(async () => {
      worker.pause();
    });
    const flow = () => htm`
      <>
        <${testTask} />
        <${testTask} />
      <//>
    `;

    worker = new FlowWorker(flow);

    await worker.start();
    await worker.resume();
    expect(testTask).toBeCalledTimes(2);
  });

  it("aborts a flow", async () => {
    const testTask = jest.fn(async () => {
      worker.abort();
    });
    const flow = () => htm`
      <>
        <${testTask} />
        <${testTask} />
      <//>
    `;

    worker = new FlowWorker(flow);

    await worker.start();
    expect(testTask).toBeCalledTimes(1);
  });

  it("executes a component", () => {
    const flow = () => htm`<${Component} />`;
    const firstNode = flow();

    worker = new FlowWorker(flow);

    expect(() => worker.executeMemoized(firstNode)).rejects.toThrow(NotImplementedError);
  });

  it("performs a task", async () => {
    const testTask = jest.fn();
    const flow = () => htm`<${testTask} />`;
    const firstNode = flow();

    worker = new FlowWorker(flow);

    await worker.performMemoized(firstNode);
    expect(testTask).toBeCalledTimes(1);
  });

  it("performs a subflow", async () => {
    const testTask = jest.fn();
    const testSubFlow = () => htm`<${testTask} />`;
    const flow = () => htm`<${testSubFlow} />`;
    const firstNode = flow();

    worker = new FlowWorker(flow);

    const innerWork = await worker.performMemoized(firstNode);
    await worker.performMemoized(innerWork);
    expect(testTask).toBeCalledTimes(1);
  });

  it("works over a fragment", async () => {
    const testTask = jest.fn();
    const flow = () => htm`
      <>
        <${testTask} />
      <//>
    `;

    worker = new FlowWorker(flow);

    await worker.start();
    expect(testTask).toBeCalledTimes(1);
  });

  it("skips siblings if set", async () => {
    const testTask = jest.fn();
    const flow = () => htm`
      <>
        <${testTask} />
        <${testTask} />
      <//>
    `;
    const firstNode = flow();
    firstNode.child.__skipSiblings = true;
    const context = { workStack: [firstNode] };

    worker = new FlowWorker(flow);

    await worker.startWorkLoop(context);
    expect(testTask).toBeCalledTimes(1);
  });

  it("does not skip siblings by default", async () => {
    const testTask = jest.fn();
    const node = () => htm`
      <>
        <${testTask} />
        <${testTask} />
      <//>
    `;

    worker = new FlowWorker(node);

    await worker.start();
    expect(testTask).toBeCalledTimes(2);
  });

  it("executes in parallel", async () => {
    const testTask = jest.fn();
    const flow = () => htm`
      <>
        <${testTask} />
        <${testTask} />
      <//>
    `;
    const firstNode = flow();
    firstNode.child.__skipSiblings = true;
    const context = { workStack: [firstNode] };
    firstNode.child.__inParallel = true;

    worker = new FlowWorker(flow);

    await worker.startWorkLoop(context);
    expect(testTask).toBeCalledTimes(2);
  });
});