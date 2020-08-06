import FlowWorker from '@core/FlowWorker';
import htm from '@core/VNode';
import Component from '@components/Component';

// TODO: add FlowWorker onFinish when all work is finished
// take into consideration when the user pauses or aborts

let worker = new FlowWorker();

export default {
  instance: (flow) => new FlowWorker(flow),
  start: (flow) => worker.start(flow),
  pause: () => worker.pause(),
  abort: () => worker.abort(),
  resume: () => worker.resume(),
  save: () => worker.save(),
  load: () => worker.load(),
  create: htm,
  Component,
};
