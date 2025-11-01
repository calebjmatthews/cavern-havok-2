import type BattleState from "../../common/models/battleState";
import MessageServer, { type PayloadServer } from "@common/communicator/message_server";
import genAutoCommands from "@common/functions/battleLogic/genAutoCommands";
import type Command from "../../common/models/command";
import performCommands from "@common/functions/battleLogic/performCommands/performCommands";
import type Account from "@common/models/account";
import { battleStateEmpty } from "../../common/models/battleState";
import { FIGHTER_CONTROL_AUTO, ROUND_DURATION_DEFAULT } from "@common/constants";
import { BATTLE_STATUS, MESSAGE_KINDS } from "@common/enums";
import type { PayloadRoundStart } from "@common/communicator/payload";
const BAS = BATTLE_STATUS;
const MEK = MESSAGE_KINDS;

export default class Battle implements BattleInterface {
  id: string = '';
  status: BATTLE_STATUS = BAS.CLEAN;
  participants: { [id: string] : Account } = {};
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
        this.shiftStatus(BAS.ROUND_START);
        break;

      case BAS.ROUND_START:
        this.roundStart();
        break;

      case BAS.WAITING_FOR_COMMANDS:
        const timeout = setTimeout(() => {
          console.log(`Battle ID${this.id} round ${this.stateCurrent.round} timed out.`);
          this.shiftStatus(BAS.ROUND_END);
        }, this.roundDuration);
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

  isCommandValid(command: Command) {
    return true; // ToDo: validate commands
  };

  acceptComand(command: Command) {
    console.log(`inside acceptComand`, command);
    if (!this.isCommandValid(command)) return;
    this.stateCurrent.commandsPending[command.fromId] = command;
    const allControlledHaveActed =  Object.values(this.stateCurrent.fighters)
    .every((f) => (
      f.controlledBy === FIGHTER_CONTROL_AUTO || this.stateCurrent.commandsPending[f.id]
    ));
    console.log(`allControlledHaveActed`, allControlledHaveActed);
    if (allControlledHaveActed) {
      this.shiftStatus(BAS.ROUND_END);
    }
  };

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

  sendPayloadToParticipants(payload: PayloadServer) {
    const messages = Object.values(this.participants).map((participant) => (
      new MessageServer({ accountId: participant.id, payload })
    ));
    messages.forEach((message) => this.sendMessage?.(message));
  };

  roundStart() {
    const autoCommands = genAutoCommands(this.stateCurrent);
    this.setStateCurrent({ ...this.stateCurrent, commandsPending: autoCommands });

    const messages: MessageServer[] = [];
    Object.values(this.participants).forEach((participant) => {
      // ToDo: Sort for speed before selecting fighter
      const fighter = Object.values(this.stateCurrent.fighters).find((f) => f.ownedBy === participant.id);
      const toCommand = fighter?.id;
      const payload: PayloadRoundStart = {
        kind: MEK.ROUND_START, battleState: this.stateCurrent, toCommand
      };
      messages.push(new MessageServer({ accountId: participant.id, payload }));
    });
    messages.forEach((message) => this.sendMessage?.(message));
    
    this.shiftStatus(BAS.WAITING_FOR_COMMANDS);
  };

  attachSendMessage(sendMessageFunction: (message: MessageServer) => void) {
    this.sendMessage = sendMessageFunction;
  };
};

export interface BattleInterface {
  id: string;
  status: BATTLE_STATUS
  participants: { [id: string] : Account };
  roundDuration: number;
  roundTimeout?: NodeJS.Timeout;
  stateInitial: BattleState;
  stateCurrent: BattleState;
  commandsHistorical: Command[][];
  conclusion?: 'A wins'|'B wins'|'draw';
};