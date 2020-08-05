import FlowWorker from '@core/FlowWorker';
import htm from '@core/VNode';
import Component from '@components/Component';

// TODO: create a class to enable multiple workers
// maybe we can return the worker instance
// TODO: add FlowWorker onFinish when all work is finished
// take into consideration when the user pauses or aborts

let worker;

const start = (flow) => {
  worker = new FlowWorker(flow());
  return worker.start();
}; 

export default {
  create: htm,
  start,
  pause: () => worker.pause(),
  abort: () => worker.abort(),
  resume: () => worker.resume(),
  save: () => worker.save(),
  load: () => worker.load(),
  Component,
};
