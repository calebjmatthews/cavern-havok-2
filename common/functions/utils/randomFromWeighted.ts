import random from "./random";

const randomFromWeighted = (anArray: any[], weightName: string = 'weight') => {
  if (anArray.length == 0) { return null; }

  let weightSum = 0;
  let buckets: number[] = [];
  anArray.map((aMember) => {
    weightSum += aMember[weightName];
    buckets.push(weightSum);
  });
  let roll = random() * weightSum;
  for (let index = 0; index < anArray.length; index++) {
    if (roll < (buckets[index] || -1)) {
      return index;
    }
  }
  return 0;
};

export default randomFromWeighted;