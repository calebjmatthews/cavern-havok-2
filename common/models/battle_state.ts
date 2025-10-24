import type Terrain from "./terrain";
import type Fighter from "./fighter";
import type Command from "./command";
import type Delta from "./delta";

export default interface BattleState {
  battleId: string;
  round: number;
  terrain: { [key: string]: Terrain };
  fighters: { [key: string]: Fighter };
  commandsPending: { [id: string] : Command };
  deltas: Delta[];
};

export const battleStateEmpty: BattleState = {
  battleId: '',
  round: 0,
  terrain: {},
  fighters: {},
  commandsPending: {},
  deltas: []
};