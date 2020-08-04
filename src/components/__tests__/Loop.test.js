import htm from '@core/VNode';
import Loop from '@components/Loop';

describe("Loop", () => {
  it("loops", async () => {
    const testConditional = () => true;
  
    const currentWork = htm`
      <${Loop} while=${testConditional}>
        <h1 />
      <//>
    `;
    const context = { workStack: [] };
    const loop = new Loop(currentWork, context);

    await loop.execute();
    expect(context.workStack).toHaveLength(2);
  });

  it("does not loop", async () => {
    const testConditional = () => false;
  
    const currentWork = htm`
      <${Loop} while=${testConditional}>
        <h1 />
      <//>
    `;
    const context = { workStack: [] };
    currentWork.sibling = {};
    const loop = new Loop(currentWork, context);

    await loop.execute();
    expect(context.workStack).toHaveLength(1);
  });
});