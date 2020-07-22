import htm from '@core/VNode';
import Loop from '@components/Loop';

describe("Loop", () => {
  it("loops", async () => {
    const testConditional = jest.fn(() => true);
  
    const currentWork = htm`
      <${Loop} while=${testConditional}>
        <h1 />
      <//>
    `;
    currentWork.workStack = [];
    const loop = new Loop(currentWork);

    await loop.execute();
    expect(currentWork.workStack).toHaveLength(2);
  });

  it("does not loop", async () => {
    const testConditional = jest.fn(() => false);
  
    const currentWork = htm`
      <${Loop} while=${testConditional}>
        <h1 />
      <//>
    `;
    currentWork.workStack = [];
    currentWork.sibling = {};
    const loop = new Loop(currentWork);

    await loop.execute();
    expect(currentWork.workStack).toHaveLength(1);
  });
});