import Easync from "@core/Easync";
import { sleep } from "@utils/helpers";
import Loop from "@components/Loop";
import Do from "@components/Do";
import Switch from "@components/Switch";
import Parallel from "@components/Parallel";
import Evaluate from "@components/Evaluate";

const Flow = () => {
  let flag = true;
  
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

  const Task = async (props) => {
    await sleep(props.name === 'task1' ? 1000 : 2000);
    console.log(`Task executed: ${props.name}`);
    return 1;
  };

  const merge = (outputs) => {
    console.log(outputs);
  };

  return Easync.create`
    <${Loop} while=${condition}>
      <${Task} name="task1" />
      <${Task} name="task2" />
    <//>
  `;
};

Easync.start(Flow);
window.Easync = Easync;
