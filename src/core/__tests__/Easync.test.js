import Easync from '@core/Easync';

describe("Easync", () => {
  it("starts a flow", async () => {
    const testTask = jest.fn();
    const flow =  () => Easync.create`<${testTask} />`;

    await Easync.start(flow);
    expect(testTask).toBeCalledTimes(1);
  });
});