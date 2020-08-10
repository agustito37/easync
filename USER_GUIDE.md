# User guide

### Flows

```js
import easync, { Loop, Parallel, Evaluate } from "easync";

const flow = () => {
  const asyncCondition = async () => {
    await sleep(1000);
    return true;
  };

  const condition = () => {
    return false;
  };

  const asyncTask = async () => {
    await sleep(1000);
    return 1;
  };

  const task = () => {
    return 2;
  };

  return easync.create`
    <${Loop} while=${asyncCondition}>
      <${asyncTask} />
      <${Evaluate} condition=${condition}>
        <${task} />
        <${Parallel}>
          <${asyncTask} />
          <${asyncTask} />
        <//>
      <//>
    <//>
  `;
};
```

Flows are a declarative definition of how we want our tasks to execute. We can create simple to complex flows as we can see in the above example.

### Flow control

#### start

```js
easync.start(flow);

// OR

const es = easync.instance(flow);
es.start();
```

When we want to execute a flow we either use the `start()` method or create an instance with `easync.instance()` and then use that instance to start the flow later.

#### pause

```js
easync.pause();
```

When we want to pause a flow we can call the `pause()` method, this will wait until the current work finishes.

#### resume

```js
easync.resume();
```

When we want to resume a paused flow we can call the `resume()` method.

#### abort

```js
easync.abort();
```

When we want to abort a flow we can call the `abort()` method, this will wait until the current work finishes, and then will wipe the executed flow data.

### Tasks, props, context, inputs and outputs

```js
const task = (props, context) => {
  console.log(props.name);
  return context.input;
};

flow = () => easync.create`
  <${task} name="task1" />
`;
```

Tasks are simply actions that the user wants to execute; they can be synchronous or asynchronous. After they are done, the flow can continue processing other tasks.

When you finish a task you can return a value, this value will be received by the next task inside the `context`; `context` is a shared object that is persisted along all the flow.

Additionally tasks have props, they are attributes defined in the flow; as we can see we are defining a name prop in the above flow.

### Subflows

```js
import easync from "easync";

const subflow = () => easync.create`
  <>
    <${task} />
    <${task} />
    <${task} />
  <//>
`;

const flow = () => easync.create`
  <${subflow} />
`;
```

In this case we are creating a subflow, a subflow it's a modular flow that can be reused in other flows.

### Parallel

```js
import easync, { Parallel } from "easync";

const task = () => {
  return 1;
};

const mergeFn = (outputs) => {
  return outputs.reduce((acc, val) => acc + val, 0);
};

const flow = () => easync.create`
  <${Parallel} merge=${mergeFn}>
    <${task} />
    <${task} />
  <//>
`;
```

Sometimes we want to execute more than one task at the same time, this can be done with the `Parallel` component. Parallel wait until all the tasks of its flow list end. Additionally you can set a merge prop that receives all the outputs from the executed tasks.

### Evaluate and Conditions

```js
import easync, { Evaluate } from "easync";

const condition = (context) => {
  return true;
};

const flow = () => easync.create`
  <${Evaluate} condition=${condition}>
    <${task} name="first" />
    <${task} name="second" />
  <//>
`;
```

Evaluations are bifurcations, they are like Javascript `if` statements, the flow is going to execute depending on the result of the evaluated condition, in this case the `condition` function is the condition. Conditions are defined like tasks and most of the time they return boolean values, in the case of the `Evaluate` component if the value returned by the condition is `true` then it would execute the first taks, otherwise it would execute the second task.

### Switch

```js
import easync, { Switch } from "easync";

const condition = (context) => {
  return "Duke";
};

const flow = () => easync.create`
  <${Switch} condition=${condition}>
    <${task} case="John" />
    <${task} case="Marie" />
    <${task} case="Duke" />
  <//>
`;
```

Switchs are another type of bifurcations, they are like Javascript `switch` statements, the flow is going to execute depending on the result of the evaluated condition, in this case the `condition` function is the condition. Given that the condition returns `Duke` it will execute only the third task.

### Loops

```js
import easync, { Loop } from "easync";

const condition = (context) => {
  return true;
};

const flow = () => easync.create`
  <${Loop} while=${condition}>
    <${task} case="John" />
  <//>
`;
```

Loops are iterative components, they work like Javascript 'while' statement. We are going to keep iterating its inner flow while the condition is `true`.

### Do

```js
import easync, { Do } from "easync";

const condition = (context) => {
  return true;
};

const flow = () => easync.create`
  <${Do} while=${condition}>
    <${task} case="John" />
  <//>
`;
```

Do component work the same as Loop component, only that the condition is evaluated after every iteration.

### Components

```js
import { Component } from "easync";

class Do extends Component {
  constructor(work, context) {
    super(work, context);

    this.state = { counter: 0 };
  }

  async execute() {
    let shouldLoop = true;

    if (this.state.counter) {
      shouldLoop = await this.evaluate(this.props.while);
    }
    this.state.counter++;

    if (shouldLoop) {
      this.current().push();
      this.child().push();
      return;
    }

    // reset counter for next time
    this.state.counter = 0;
    this.next().push();
  }
}
```

You can create your own Components so you can have more control over your flows. In order to do that you need to extend from the `Component` class that easync provides. Inside the execute method, you can iterate over the nodes of the flow tree with the following methods: `current()`, `child()`, `next()`, `parent()`. Then you can push those nodes into the work stack with `push()`; you need to take into consideration that the flow is executed as a work stack (LIFO: last in, first out); so the last node of the flow you push will be the first to be processed in the flow. Remember to use `this.next().push()` to continue with the sibling of the component, otherwise, the flow will not continue after the component you created is proccesed. There are a couple of other methods you can use as: `skipSiblings()` to not execute the siblings of the current node; or `parallelSiblings()` to execute the current node and its siblings in parallel.

You have more examples in the repository's `components` folder.
