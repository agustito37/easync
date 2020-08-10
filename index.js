import FlowWorker from "@core/FlowWorker";
import htm from "@core/VNode";

export * from "@components";

let worker = new FlowWorker();
export const easync = {
  instance: (flow) => new FlowWorker(flow),
  start: (flow) => worker.start(flow),
  pause: () => worker.pause(),
  abort: () => worker.abort(),
  resume: () => worker.resume(),
  save: () => worker.save(),
  load: () => worker.load(),
  create: htm,
};;

export default easync;
