// not sure about an use case for this yet 
// maybe when you add an idle="true" attribute to the task or conditional
// it must be performed on the idle queue

const idleWorkQueue = [];

const workLoop = (deadline) => {
  while(deadline.timeRemaining() > 0 && idleWorkQueue.length) {
    const current = idleWorkQueue.shift();
    current();
  }

  window.requestIdleCallback(workLoop);
};

window.requestIdleCallback(workLoop);

export default {
  push: (work) => idleWorkQueue.push(work)
};
