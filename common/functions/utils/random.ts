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

const floatToAlphanumeric = (num: number, length: number = 8): string => {
  // Use the float to seed a simple hash
  const hash = Math.abs(num * (10 ** (length * 2)));
  
  // Convert to base 36 (0-9, a-z) and take n characters
  let result = Math.floor(hash).toString(36);
  
  // Pad with additional characters if needed
  while (result.length < length) {
    // Generate more characters by squaring and using fractional part
    const fractional = (hash * hash) % 1;
    result += Math.floor(fractional * 36).toString(36);
  }
  
  return result.slice(0, length);
};

export const genId = () => (
  floatToAlphanumeric(random())
);

export default random;