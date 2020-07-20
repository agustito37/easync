import h from 'core/h';
import Easync from 'core/easync';

const Task = () => {
  console.log('Task 1 excecuted');
};

const Condition = () => {
  return true;
};

const es = new Easync(h`
  <loop name="loop1" while="${Condition}">
    <${Task} name="task1" />
    <loop name="loop2" while="${Condition}">
      <${Task} name="task2" />
      <${Task} name="task3" />
    <//>
  <//>
`);

es.onFinish = () => {
  console.log('Finished');
};

es.start();