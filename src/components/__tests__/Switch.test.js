import htm from '@core/VNode';
import Switch from '@components/Switch';

describe("Switch", () => {
  it("evaluates", async () => {
    const testConditional = () => "2";
  
    const currentWork = htm`
      <${Switch} condition=${testConditional}>
        <h1 case="1" />
        <h2 case="2" />
        <h3 case="3" />
      <//>
    `;
    currentWork.workStack = [];
    const switchComponent = new Switch(currentWork);

    await switchComponent.execute();
    expect(currentWork.workStack[0].type).toBe('h2');
  });
});