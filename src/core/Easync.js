import FlowWorker from '@core/FlowWorker';
import htm from '@core/VNode';
import Component from '@components/Component';

const start = async (flow) => {
  const worker = new FlowWorker(flow());
  return worker.start();
}; 

export default {
  create: htm,
  start,
  Component,
};
