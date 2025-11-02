// import type Terrain from "./terrain";
import type Fighter from "./fighter";
import type Command from "./command";
import type AlterationActive from "./alterationActive";

export default interface BattleState {
  battleId: string;
  size: [number, number];
  round: number;
  // terrain: { [key: string]: Terrain };
  fighters: { [key: string]: Fighter };
  commandsPending: { [id: string] : Command };
  alterationsActive: { [id: string] : AlterationActive };
  conclusion?: 'Side A wins!' | 'Side B wins...' | 'Draw!';
};

export const battleStateEmpty: BattleState = {
  battleId: '',
  size: [5, 5],
  round: 0,
  // terrain: {},
  fighters: {},
  commandsPending: {},
  alterationsActive: {}
};