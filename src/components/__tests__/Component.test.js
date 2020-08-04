import htm from '@core/VNode';
import Component from '@components/Component';
import NotImplementedError from '@utils/NotImplementedError';

describe("Component", () => {
  it("executes", () => {
    const currentWork = htm`<${Component} />`;
    const component = new Component(currentWork);

    expect(component.execute).toThrow(NotImplementedError);
  });

  it("evaluates a condition", async () => {
    const testCondition = jest.fn();
    const currentWork = htm`<${Component} />`;

    const component = new Component(currentWork);

    await component.evaluate(testCondition);
    expect(testCondition).toBeCalledTimes(1);
  });

  it("adds its child to the work stack", () => {
    const currentWork = htm`<${Component}><h1 /><//>`;
    const context = { workStack: [] };

    const component = new Component(currentWork, context);

    component.child().push();
    expect(context.workStack).toHaveLength(1);
  });

  it("adds a sibling to the work stack", () => {
    const currentWork = htm`
      <${Component}>
        <h1 />
        <h1 />
      <//>
    `;
    currentWork.sibling = {};
    const context = { workStack: [] };

    const component = new Component(currentWork, context);

    component.child().next().push();
    expect(context.workStack).toHaveLength(1);
  });

  it("adds itself to the work stack", () => {
    const currentWork = htm`<${Component} />`;
    const context = { workStack: [] };

    const component = new Component(currentWork, context);

    component.current().push();
    expect(context.workStack).toHaveLength(1);
  });

  it("it sets skipSiblings", () => {
    const currentWork = htm`<${Component} />`;

    const component = new Component(currentWork);

    component.onSkipSiblings(currentWork);
    expect(currentWork.__skipSiblings).toBe(true);
  });
});