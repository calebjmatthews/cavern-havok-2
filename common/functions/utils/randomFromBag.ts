import random from "./random";

const bags: { [stringified: string] : string[] } = {};

const randomFromBag = (anArray: string[]) => {
  let bag = bags[JSON.stringify(anArray)];
  if (!bag) {
    bag = [...anArray];
  }
  const index = Math.floor(bag.length * random());
  const value = anArray[index];
  delete bag[index];
  bags[JSON.stringify(anArray)] = bag;
  if (value === undefined) throw Error(`randomFrom error, value=undefined at index ${index}`);
  return value;
};


export default randomFromBag;