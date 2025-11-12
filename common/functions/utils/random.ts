const hash = (seed: string) => {
  for(var i = 0, h = 1779033703 ^ seed.length; i < seed.length; i++)
      h = Math.imul(h ^ seed.charCodeAt(i), 3432918353),
      h = h << 13 | h >>> 19;
  return () => {
      h = Math.imul(h ^ h >>> 16, 2246822507);
      h = Math.imul(h ^ h >>> 13, 3266489909);
      return (h ^= h >>> 16) >>> 0;
  }
}

const mulberry32 = (a: number) => {
  return () => {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

let seedFunction = hash(new Date(Date.now()).valueOf().toString());
const random = mulberry32(seedFunction());

export const randomGaussian = () => {
  const a = random();
  const b = random();
  return (Math.abs(a - 0.5) < Math.abs(b - 0.5)) ? a : b;
}

export default random;