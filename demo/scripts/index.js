import Easync from '@core/Easync';
import { sleep } from '@utils/helpers';
import Loop from '@components/Loop';
import Do from '@components/Do';
import Switch from '@components/Switch';

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
    console.log(`Conditional executed: ${flag?2:3}`);
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

  const SubFlow = () => Easync.create`
    <${Do} while=${condition}>
      <${Switch} condition=${conditionSwitch}>
        <${Task} case="1" name="task1" />
        <${Task} case="2" name="task2" />
        <${Task} case="3" name="task3" />
      <//>
    <//>
  `;

  return Easync.create`
    <${SubFlow} />
  `;
};

Easync.start(Flow);