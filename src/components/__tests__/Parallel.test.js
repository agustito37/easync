import htm from '@core/VNode';
import Parallel from '@components/Parallel';

describe("Parallel", () => {
  it("adds in parallel", async () => {
    const testConditional = () => true;
  
    const currentWork = htm`
      <${Parallel} condition=${testConditional}>
        <h1 />
        <h2 />
      <//>
    `;
    const context = { workStack: [] };
    const parallel = new Parallel(currentWork, context);

    await parallel.execute();
    expect(context.workStack[0].__inParallel).toBe(true);
  });
});