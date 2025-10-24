const range = (start: number, end: number, step = 1) => (
  Array.from({
    length: Math.floor((end - start) / step) + 1
  }, (_, i) => start + i * step)
);

export default range;