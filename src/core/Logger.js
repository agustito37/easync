// TODO: maybe we can wrap tasks and conditions
// to log when start and when finish

const getLogLevel = (work) => { 
  let level = 1;

  let current = work;
  while(current.parent) {
    level += 1;
    current = current.parent;
  }

  return '-'.repeat(level);
};

const log = (tag, work) => {
  const name = work.props && work.props.name ? `: ${work.props.name}` : '';
  console.log(`${getLogLevel(work)} ${tag}${name}`);
};

export default {
  log,
};
