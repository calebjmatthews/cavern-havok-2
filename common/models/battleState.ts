// import type Terrain from "./terrain";
import type Fighter from "./fighter";
import type Command from "./command";
import type AlterationActive from "./alterationActive";
import type Obstacle from "./obstacle";
import type Creation from "./creation";

export default interface BattleState {
  battleId: string;
  size: [number, number];
  round: number;
  // terrain: { [key: string]: Terrain };
  fighters: { [key: string]: Fighter };
  obstacles: { [key: string]: Obstacle };
  creations: { [key: string]: Creation };
  commandsPending: { [id: string] : Command };
  alterationsActive: { [id: string] : AlterationActive };
  texts: { introText: string; victoryText: string; defeatText: string };
  conclusion?: 'Side A wins!' | 'Side B wins...' | 'Draw!';
};

export const battleStateEmpty: BattleState = {
  battleId: '',
  size: [5, 5],
  round: 0,
  // terrain: {},
  fighters: {},
  obstacles: {},
  creations: {},
  commandsPending: {},
  alterationsActive: {},
  texts: { introText: '', victoryText: '', defeatText: '' }
};