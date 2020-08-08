import FlowWorker from "@core/FlowWorker";
import htm from "@core/VNode";

// TODO: async/await usage makes babel to include the Regenerator Runtime
// this is a heavy package, should improve this.

export * from "@components";

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
};
