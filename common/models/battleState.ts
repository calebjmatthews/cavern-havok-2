// import type Terrain from "./terrain";
import type Fighter from "./fighter";
import type Command from "./command";

export default interface BattleState {
  battleId: string;
  size: [number, number];
  round: number;
  // terrain: { [key: string]: Terrain };
  fighters: { [key: string]: Fighter };
  commandsPending: { [id: string] : Command };
};

export const battleStateEmpty: BattleState = {
  battleId: '',
  size: [5, 5],
  round: 0,
  // terrain: {},
  fighters: {},
  commandsPending: {}
};