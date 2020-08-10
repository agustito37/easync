import easync, { Loop, Parallel, Evaluate } from "../../index";
import { sleep } from "@utils/helpers";

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
      <${asyncTask} name="First Task" />
      <${Evaluate} condition=${condition}>
        <${task} name="second Task" />
        <${Parallel}>
          <${asyncTask} name="Third Task" />
          <${asyncTask} name="Fourth Task" />
        <//>
      <//>
    <//>
  `;
};

easync.start(flow);

// for test purposes
window.easync = easync;
