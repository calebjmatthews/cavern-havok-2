import type BattleState from "./battleState";
import type Delta from "./delta";
import { battleStateEmpty } from "./battleState";
import { BATTLE_STATUS } from "@common/enums";
import genAutoCommands from "@common/functions/battleLogic/genAutoCommands";
const BAS = BATTLE_STATUS;

export default class Battle implements BattleInterface {
  id: string = '';
  status: BATTLE_STATUS = BAS.CLEAN;
  stateInitial: BattleState = battleStateEmpty;
  stateCurrent: BattleState = battleStateEmpty;
  deltasHistorical: Delta[] = [];

  constructor(battle: BattleInterface) {
    Object.assign(this, battle);
  };

  setStateCurrent(nextState: BattleState) { this.stateCurrent = nextState; }

  shiftStatus(nextStatus: BATTLE_STATUS) {
    const lastStatus = this.status;
    this.status = nextStatus;
    console.log(`Shifting from ${lastStatus} to ${this.status}`);
    switch(this.status) {
      case BAS.INITIALIZING:
        console.log(`JSON.stringify(this)`, JSON.stringify(this));
        this.shiftStatus(BATTLE_STATUS.GEN_AUTO_COMMANDS);
        break;

      case BAS.GEN_AUTO_COMMANDS:
        const autoCommands = genAutoCommands(this.stateCurrent);
        this.setStateCurrent({ ...this.stateCurrent, commandsPending: autoCommands });
        break;
    };
    
  };
};

interface BattleInterface {
  id: string;
  stateInitial: BattleState;
  stateCurrent: BattleState;
  deltasHistorical: Delta[];
};