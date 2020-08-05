import htm from '@core/VNode';
import Do from '@components/Do';

describe("Do", () => {
  it("loops once", async () => {
    const testConditional = () => true;
  
    const currentWork = htm`
      <${Do} while=${testConditional}>
        <h1 />
      <//>
    `;
    const context = { workStack: [] };
    const doComponent = new Do(currentWork, context);

    await doComponent.execute();
    expect(context.workStack).toHaveLength(2);
  });

  it("does not loop twice when condition fails", async () => {
    const testConditional = () => false;
  
    const currentWork = htm`
      <${Do} while=${testConditional}>
        <h1 />
      <//>
    `;
    const context = { workStack: [] };
    currentWork.sibling = {};
    const doComponent = new Do(currentWork, context);

    await doComponent.execute();
    await doComponent.execute();
    expect(context.workStack).toHaveLength(2);
  });

  it("does loop twice when condition succeed", async () => {
    const testConditional = () => true;
  
    const currentWork = htm`
      <${Do} while=${testConditional}>
        <h1 />
      <//>
    `;
    const context = { workStack: [] };
    currentWork.sibling = {};
    const doComponent = new Do(currentWork, context);

    await doComponent.execute();
    await doComponent.execute();
    expect(context.workStack).toHaveLength(4);
  });
});