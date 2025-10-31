import type BattleState from "../../common/models/battleState";
import type MessageServer from "@common/communicator/message_server";
import { battleStateEmpty } from "../../common/models/battleState";
import { ROUND_DURATION_DEFAULT } from "@common/constants";
import { BATTLE_STATUS } from "@common/enums";
import genAutoCommands from "@common/functions/battleLogic/genAutoCommands";
import type Command from "../../common/models/command";
import performCommands from "@common/functions/battleLogic/performCommands/performCommands";
const BAS = BATTLE_STATUS;

export default class Battle implements BattleInterface {
  id: string = '';
  status: BATTLE_STATUS = BAS.CLEAN;
  roundDuration: number = ROUND_DURATION_DEFAULT;
  roundTimeout?: NodeJS.Timeout;
  stateInitial: BattleState = battleStateEmpty;
  stateCurrent: BattleState = battleStateEmpty;
  commandsHistorical: Command[][] = [];
  conclusion?: 'A wins'|'B wins'|'draw';
  sendMessage?: (message: MessageServer) => void;

  constructor(battle: BattleInterface) {
    Object.assign(this, battle);
  };

  setStateCurrent(nextState: BattleState) { this.stateCurrent = nextState; }
  setRoundTimeout(nextTimeout: NodeJS.Timeout) { this.roundTimeout = nextTimeout; }
  addCommandsToHistory(newCommandsHistorical: Command[]) {
    this.commandsHistorical.push([...newCommandsHistorical]);
  }
  setConclusion(newConclusion: 'A wins'|'B wins'|'draw') { this.conclusion = newConclusion; }

  shiftStatus(nextStatus: BATTLE_STATUS) {
    const lastStatus = this.status;
    this.status = nextStatus;
    console.log(`Shifting from ${lastStatus} to ${this.status}`);
    if (this.roundTimeout) clearTimeout(this.roundTimeout);
    
    switch(this.status) {
      case BAS.INITIALIZING:
        console.log(`JSON.stringify(this)`, JSON.stringify(this));
        this.shiftStatus(BAS.ROUND_START);
        break;

      case BAS.ROUND_START:
        const autoCommands = genAutoCommands(this.stateCurrent);
        this.setStateCurrent({ ...this.stateCurrent, commandsPending: autoCommands });
        this.shiftStatus(BAS.WAITING_FOR_COMMANDS);
        break;

      case BAS.WAITING_FOR_COMMANDS:
        const timeout = setTimeout(() => {
          console.log(`Battle ID${this.id} round ${this.stateCurrent.round} timed out.`);
          this.shiftStatus(BAS.ROUND_END);
        }, ROUND_DURATION_DEFAULT);
        this.setRoundTimeout(timeout);
        break;

      case BAS.ROUND_END:
        const roundResult = performCommands(this.stateCurrent);
        console.log(`roundResult`, JSON.stringify(roundResult));
        this.addCommandsToHistory(Object.values(this.stateCurrent.commandsPending));
        this.setStateCurrent(roundResult.battleState);
        this.stateCurrent.round += 1;
        this.stateCurrent.commandsPending = {};
        const sideDowned = this.getSideDowned();
        if (sideDowned === null){
          this.shiftStatus(BAS.ROUND_START); return;
        }
        if (sideDowned === 'A') this.setConclusion('B wins');
        if (sideDowned === 'B') this.setConclusion('A wins');
        if (sideDowned === 'both') this.setConclusion('draw');
        this.shiftStatus(BAS.CONCLUSION);
        break;

      case BAS.CONCLUSION:
        console.log(`Battle over! Conclusion: ${this.conclusion}`);
    };
  };

  // acceptComand

  getSideDowned() {
    const sideA = Object.values(this.stateCurrent.fighters).filter((f) => f.side === 'A');
    const sideB = Object.values(this.stateCurrent.fighters).filter((f) => f.side === 'B');
    const sideADowned = sideA.every((f) => f.health <= 0);
    const sideBDowned = sideB.every((f) => f.health <= 0);
    if (sideADowned && sideBDowned) return 'both';
    else if (sideADowned) return 'A';
    else if (sideBDowned) return 'B';
    return null;
  };

  attachSendMessage(sendMessageFunction: (message: MessageServer) => void) {
    this.sendMessage = sendMessageFunction;
  };
};

export interface BattleInterface {
  id: string;
  status: BATTLE_STATUS
  roundDuration: number;
  roundTimeout?: NodeJS.Timeout;
  stateInitial: BattleState;
  stateCurrent: BattleState;
  commandsHistorical: Command[][];
  conclusion?: 'A wins'|'B wins'|'draw';
};