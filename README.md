<p align="center"><img src="resources/logo.png" /></p>

#### A declarative approach to execute asynchronous tasks in javascript

With easync.js you can define from simple to complex flows that involve loops, conditions and more. You can arrange user interactions, asynchronous server calls, process data in different steps or whatever you want to organize in a declarative way.

## How it works?

Just follow 2 steps:

1. Define your flow with inner tasks and conditions

```js
import easync, { Loop } from "easync";

const flow = () => {
  const asyncCondition = async () => {
    await sleep(1000);
    return true;
  };

  const asyncTask = async () => {
    await sleep(1000);
    return 1;
  };

  return easync.create`
    <${Loop} while=${asyncCondition}>
      <${asyncTask} />
    <//>
  `;
};
```

For learning purpose we defined a simple loop with an async task inside. In this example we added an async function `sleep` before resolving the task and the condition to expose the asynchronous capabilities. You can work with non async functions too!

2. Start the flow!

```js
easync.start(flow);
```
