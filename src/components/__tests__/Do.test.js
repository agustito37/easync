import htm from '@core/VNode';
import Do from '@components/Do';

describe("Do", () => {
  it("loops once", async () => {
    const testConditional = jest.fn(() => true);
  
    const currentWork = htm`
      <${Do} while=${testConditional}>
        <h1 />
      <//>
    `;
    currentWork.workStack = [];
    const doComponent = new Do(currentWork);

    await doComponent.execute();
    expect(currentWork.workStack).toHaveLength(2);
  });

  it("does not loop twice when condition fails", async () => {
    const testConditional = jest.fn(() => false);
  
    const currentWork = htm`
      <${Do} while=${testConditional}>
        <h1 />
      <//>
    `;
    currentWork.workStack = [];
    currentWork.sibling = {};
    const doComponent = new Do(currentWork);

    await doComponent.execute();
    await doComponent.execute();
    expect(currentWork.workStack).toHaveLength(3);
  });

  it("does loop twice when condition succeed", async () => {
    const testConditional = jest.fn(() => true);
  
    const currentWork = htm`
      <${Do} while=${testConditional}>
        <h1 />
      <//>
    `;
    currentWork.workStack = [];
    currentWork.sibling = {};
    const doComponent = new Do(currentWork);

    await doComponent.execute();
    await doComponent.execute();
    expect(currentWork.workStack).toHaveLength(4);
  });
});