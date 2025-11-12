import random from "./random";

const randomFrom = <T>(anArray: T[]): T => {
  const index = Math.floor(anArray.length * random());
  const value = anArray[index];
  if (value === undefined) throw Error(`randomFrom error, value=undefined at index ${index}`);
  return value;
};

export default randomFrom;