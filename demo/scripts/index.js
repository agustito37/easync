import easync, { Loop, Switch } from "../../index";
import { sleep } from "@utils/helpers";

const flow = () => {
  const asyncCondition = async () => {
    const output = true;
    console.log(`Loop condition: ${output}`);
    await sleep(1000);
    return output;
  };

  const condition = () => {
    const output = "Luke";
    console.log(`- Switch condition: ${output}`);
    return output;
  };

  const asyncTask = async () => {
    await sleep(1000);
    return 1;
  };

  const task = (props, context) => {
    const output = (context.input || 0) + 1;
    console.log(`-- Task: ${props.case}`);
    console.log(`--- Output: ${output}`);
    return output;
  };

  return easync.create`
    <${Loop} while=${asyncCondition}>
      <${Switch} condition=${condition}>
        <${asyncTask} case="Ash" />
        <${task} case="Luke" />
      <//>
    <//>
  `;
};

easync.start(flow);

// for test purposes
window.easync = easync;
