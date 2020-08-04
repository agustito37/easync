import Easync from "@core/Easync";
import { sleep } from "@utils/helpers";
import Loop from "@components/Loop";
import Do from "@components/Do";
import Switch from "@components/Switch";
import Parallel from "@components/Parallel";

let flag = true;

const Flow = () => {
  const condition = async () => {
    await sleep(2000);
    console.log(`Conditional executed: ${true}`);
    return true;
  };

  const conditionFalse = async () => {
    await sleep(2000);
    console.log(`Conditional executed: ${false}`);
    return false;
  };

  const conditionSwitch = async () => {
    await sleep(2000);
    console.log(`Conditional executed: ${flag ? 2 : 3}`);
    if (flag) {
      flag = !flag;
      return "2";
    } else {
      flag = !flag;
      return "3";
    }
  };

  const Task = (props) => {
    console.log(`Task executed: ${props.name}`);
    return 1;
  };

  const merge = (outputs) => {
    console.log(outputs);
  };

  return Easync.create`
    <${Parallel} merge=${merge}>
      <${Task} name="task1" />
      <${Task} name="task2" />
    <//>
  `;
};

Easync.start(Flow);
