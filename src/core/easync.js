import FlowWorker from './FlowWorker';
import h from 'core/h';
import Component from 'components/component';

const start = async (flow) => {
  const worker = new FlowWorker(flow());
  return worker.start();
}; 

export default {
  create: h,
  start,
  Component,
};
