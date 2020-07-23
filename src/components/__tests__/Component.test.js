import htm from '@core/VNode';
import Component from '@components/Component';

describe("Component", () => {
  it("executes", () => {
    const currentWork = htm`<${Component} />`;
    const component = new Component(currentWork);

    expect(component.execute).toThrow(Error);
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
    currentWork.workStack = [];

    const component = new Component(currentWork);

    component.child().push();
    expect(currentWork.workStack).toHaveLength(1);
  });

  it("adds its sibling to the work stack", () => {
    const currentWork = htm`<${Component} />`;
    currentWork.sibling = {};
    currentWork.workStack = [];

    const component = new Component(currentWork);

    component.next().push();
    expect(currentWork.workStack).toHaveLength(1);
  });

  it("adds itself to the work stack", () => {
    const currentWork = htm`<${Component} />`;
    currentWork.workStack = [];

    const component = new Component(currentWork);

    component.current().push();
    expect(currentWork.workStack).toHaveLength(1);
  });
});