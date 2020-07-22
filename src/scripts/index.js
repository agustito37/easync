import Easync from 'core/easync';
import { sleep } from 'core/utils/helpers';
import Loop from 'components/loop';
import Do from 'components/do';

const flow = () => {
  const condition = async () => {
    await sleep(1000);
    console.log(`Conditional executed: ${true}`);
    return true;
  };

  const conditionFalse = async () => {
    await sleep(1000);
    console.log(`Conditional executed: ${false}`);
    return false;
  };

  const task = (props) => {
    console.log(`Task executed: ${props.name}`);
    return 1;
  };

  return Easync.create`
    <${Loop} times=3 while=${condition}>
      <${Do} while=${conditionFalse}>
        <${task} name="task1" />
      <//>
      <${task} name="task2" />
    <//>
  `;
};

Easync.start(flow);