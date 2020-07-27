import htm from '@core/VNode';
import Evaluate from '@components/Evaluate';

describe("Evaluate", () => {
  it("evaluates to true", async () => {
    const testConditional = () => true;
  
    const currentWork = htm`
      <${Evaluate} condition=${testConditional}>
        <h1 />
        <h2 />
      <//>
    `;
    currentWork.workStack = [];
    const evaluate = new Evaluate(currentWork);

    await evaluate.execute();
    expect(currentWork.workStack[0].type).toBe('h1');
  });

  it("evaluates to false", async () => {
    const testConditional = () => false;
  
    const currentWork = htm`
      <${Evaluate} condition=${testConditional}>
        <h1 />
        <h2 />
      <//>
    `;
    currentWork.workStack = [];
    const evaluate = new Evaluate(currentWork);

    await evaluate.execute();
    expect(currentWork.workStack[0].type).toBe('h2');
  });
});