const { easync, Loop } = require("../dist/easync");

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const flow = () => {
  const asyncCondition = async () => {
    await sleep(1000);
    console.log("condition");
    return true;
  };

  const asyncTask = async () => {
    await sleep(1000);
    console.log("task");
    return 1;
  };

  return easync.create`
    <${Loop} while=${asyncCondition}>
      <${asyncTask} />
    <//>
  `;
};

easync.start(flow);
