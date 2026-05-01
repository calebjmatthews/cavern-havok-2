const rgbaToUint32 = (r: number, g: number, b: number, a: number): number => {
  const alpha = Math.round(a * 255);
  return ((r << 24) | (g << 16) | (b << 8) | alpha) >>> 0;
};

export default rgbaToUint32;