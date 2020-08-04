import FlowWorker from '@core/FlowWorker';
import htm from '@core/VNode';
import Component from '@components/Component';

let worker;

const start = (flow) => {
  worker = new FlowWorker(flow());
  return worker.start();
}; 

// TODO: add FlowWorker onFinish all work
// take into consideration when the use pauses or aborts

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
