// not sure about an use case for this yet 
// maybe if you add an idle="true" attribute to the task or conditional

const workQueue = [];

const workLoop = (deadline) => {
  while(deadline.timeRemaining() > 0 && workQueue.length) {
    const current = workQueue.shift();
    current();
  }

  window.requestIdleCallback(workLoop);
};

window.requestIdleCallback(workLoop);

export default workQueue;