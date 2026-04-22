import type Treasure from "./treasure";

export default interface Chest {
  chestKindId: string;
  options: Treasure[];
  guaranteed: Treasure[];
};