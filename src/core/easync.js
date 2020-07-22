import FlowWorker from './FlowWorker';
import h from 'core/h';

const start = async (flow) => {
  const flowVTree = flow();
  const worker = new FlowWorker(flowVTree);
  return worker.start();
}; 

export default {
  start,
  create: h,
};
