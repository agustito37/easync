import htm from '@core/VNode';
import ComponentIterator from '@components/ComponentIterator';

describe("ComponentIterator", () => {
  it("push call", async () => {
    const testPush = jest.fn();
    const currentWork = htm`
      <div>
        <h1 />
        <h2 />
      <//>
    `;

    const iterator = new ComponentIterator(currentWork, testPush);

    iterator.push();
    expect(testPush).toBeCalledTimes(1);
  });

  it("skipSiblings being called", async () => {
    const testSkip = jest.fn();
    const currentWork = htm`
      <div>
        <h1 />
        <h2 />
      <//>
    `;

    const iterator = new ComponentIterator(currentWork, null, testSkip);

    iterator.child().skipSiblings();
    expect(testSkip).toBeCalledTimes(1);
  });

  it("skipSiblings not being called", async () => {
    const testSkip = jest.fn();
    const currentWork = htm`
      <div>
        <h1 />
        <h2 />
      <//>
    `;

    const iterator = new ComponentIterator(currentWork, null, testSkip);

    iterator.skipSiblings();
    expect(testSkip).toBeCalledTimes(0);
  });

  it("current", async () => {
    const currentWork = htm`
      <div>
        <h1 />
        <h2 />
      <//>
    `;

    const iterator = new ComponentIterator(currentWork);

    const current = iterator.current();
    expect(current.node.type).toBe('div');
  });

  it("child", async () => {
    const currentWork = htm`
      <div>
        <h1 />
        <h2 />
      <//>
    `;

    const iterator = new ComponentIterator(currentWork);

    const child = iterator.child();
    expect(child.node.type).toBe('h1');
  });

  it("sibling", async () => {
    const currentWork = htm`
      <div>
        <h1 />
        <h2 />
      <//>
    `;

    const iterator = new ComponentIterator(currentWork);

    const sibling = iterator.child().next();
    expect(sibling.node.type).toBe('h2');
  });
});