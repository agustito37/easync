<p align="center"><img src="resources/logo.png" /></p>

<p align="center">
  <img src="https://img.shields.io/github/license/Naereen/StrapDown.js.svg" />
<p>

#### A declarative approach to execute asynchronous tasks in javascript

With easync you can define from simple to complex flows that involve loops, conditions and more. You can arrange user interactions, asynchronous server calls, process data in different steps or whatever you want to organize in a declarative way.

## How it works?

Just follow 3 steps:

- Install easync with `npm i easync`

- Define your flow with inner tasks and conditions

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

- Start the flow!

```js
easync.start(flow);
```

If you want to learn more about all the things you can do with easync, check the [User Guide](./USER_GUIDE.md)

### License

easync is MIT licensed.
