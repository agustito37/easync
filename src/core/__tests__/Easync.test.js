import Easync from '@core/Easync';
import FlowWorker from '../FlowWorker';

describe("Easync", () => {
  it("starts a flow", async () => {
    const testTask = jest.fn();
    const flow = () => Easync.create`<${testTask} />`;

    await Easync.start(flow);
    expect(testTask).toBeCalledTimes(1);
  });

  it("gets an instance of a worker", async () => {
    const flow = () => Easync.create`<div />`;

    const easync = Easync.instance(flow);
    expect(easync).toBeInstanceOf(FlowWorker);
  });
});