import Easync from 'core/easync';
import { sleep } from 'core/utils/helpers';

const flow = () => {
  const condition = async (context) => {
    await sleep(3000);
    console.log(`conditional excecuted: ${true}`);
    return true;
  };

  const task = (props, context) => {
    console.log(`${props.name} excecuted`);
    return 1;
  };

  return Easync.create`
    <loop while="${condition}">
      <${task} name="task1" />
      <do while="${condition}">
        <${task} name="task2" />
        <${task} name="task3" />
      <//>
    <//>
  `;
};

Easync.start(flow);