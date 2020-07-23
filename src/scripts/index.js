import Easync from '@core/Easync';
import { sleep } from '@core/utils/helpers';
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

  const ATask = (props) => {
    console.log(`Task executed: ${props.name}`);
    return 1;
  };

  const SubFlow = () => Easync.create`
    <${Do} while=${condition}>
      <${ATask} name="task1" />
    <//>
  `;

  return Easync.create`
    <${SubFlow} />
  `;
};

Easync.start(Flow);