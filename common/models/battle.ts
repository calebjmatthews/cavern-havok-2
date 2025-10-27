import type BattleState from "./battleState";
import type Delta from "./delta";
import { battleStateEmpty } from "./battleState";
import { BATTLE_STATUS } from "@common/enums";
import genAutoCommands from "@common/functions/battleLogic/genAutoCommands";
const BAS = BATTLE_STATUS;

export default class Battle implements BattleInterface {
  id: string = '';
  status: BATTLE_STATUS = BAS.INITIALIZING;
  stateInitial: BattleState = battleStateEmpty;
  stateCurrent: BattleState = battleStateEmpty;
  deltasHistorical: Delta[] = [];

  constructor(battle: BattleInterface) {
    Object.assign(this, battle);
  };

  setStateCurrent(nextState: BattleState) { this.stateCurrent = nextState; }

  shiftStatus(nextStatus: BATTLE_STATUS) {
    switch(nextStatus) {
      case BAS.GEN_AUTO_COMMANDS:
        genAutoCommands(this.stateCurrent);
    };
  };
};

interface BattleInterface {
  id: string;
  stateInitial: BattleState;
  stateCurrent: BattleState;
  deltasHistorical: Delta[];
};