import easync, { Loop } from "../../index.js";
import { sleep } from "@utils/helpers";

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

easync.start(flow);

// for test purposes
window.easync = easync;
