import type BattleState from "./battleState";
import { battleStateEmpty } from "./battleState";
import type Delta from "./delta";

export default class Battle implements BattleInterface {
  id: string = '';
  round: number = 0;
  size: [number, number] = [5, 5];
  stateInitial: BattleState = battleStateEmpty;
  stateCurrent: BattleState = battleStateEmpty;
  deltasHistorical: Delta[] = [];

  constructor(battle: BattleInterface) {
    Object.assign(this, battle);
  }
};

interface BattleInterface {
  id: string;
  round: number;
  size: [number, number];
  stateInitial: BattleState;
  stateCurrent: BattleState;
  deltasHistorical: Delta[];
};