import Easync from '@core/Easync';
import { sleep } from '@utils/helpers';
import Loop from '@components/Loop';
import Do from '@components/Do';

const Flow = () => {
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

  const Task = (props) => {
    console.log(`Task executed: ${props.name}`);
    return 1;
  };

  const SubFlow = () => Easync.create`
    <${Do} while=${condition}>
      <${Task} name="task1" />
    <//>
  `;

  return Easync.create`
    <${SubFlow} />
  `;
};

Easync.start(Flow);