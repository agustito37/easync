import h from 'core/h';
import Easync from 'core/easync';

const Task = () => {
  console.log('Task 1 excecuted');
};

const Condition = () => {
  return true;
};

const es = new Easync(h`
  <loop while="${Condition}">
    <${Task} name="task1" />
    <loop while="${Condition}">
      <${Task} name="task2" />
      <${Task} name="task3" />
    <//>
  <//>
`);

es.start();

es.onFinish = () => {
  console.log('Finished');
};