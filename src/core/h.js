import htm from 'htm';

const h = (type, props, ...children) => {
  return { type, props, children };
};

export default htm.bind(h);
