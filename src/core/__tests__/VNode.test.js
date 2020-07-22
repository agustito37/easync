import htm from '@core/VNode';

describe("VNode", () => {
  it("creates a VNode when using htm", () => {
    const actualNode = htm`
      <h1 name='title'>
        <h2 />
        <h3 />
      <//>
    `;

    const expectedNode = {
      type: 'h1',
      props: { name: 'title' },
      child: { 
        type: 'h2', 
        sibling: { type: 'h3'}
      },
    };

    expect(actualNode).toMatchObject(expectedNode);
  });
});