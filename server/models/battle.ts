import type BattleState from "../../common/models/battleState";
import MessageServer, { type PayloadServer } from "@common/communicator/message_server";
import type Command from "../../common/models/command";
import type Account from "@common/models/account";
import genAutoCommands from "@common/functions/battleLogic/genAutoCommands";
import performCommands from "@common/functions/battleLogic/performCommands/performCommands";
import { battleStateEmpty } from "../../common/models/battleState";
import { FIGHTER_CONTROL_AUTO, ROUND_DURATION_DEFAULT } from "@common/constants";
import { BATTLE_STATUS, MESSAGE_KINDS } from "@common/enums";
import type { PayloadConclusion, PayloadRoundStart } from "@common/communicator/payload";
const BAS = BATTLE_STATUS;
const MEK = MESSAGE_KINDS;

export default class Battle implements BattleInterface {
  id: string = '';
  status: BATTLE_STATUS = BAS.CLEAN;
  participants: { [id: string] : Account } = {};
  roundDuration: number = ROUND_DURATION_DEFAULT;
  roundTimeout?: NodeJS.Timeout;
  stateInitial: BattleState = battleStateEmpty;
  stateLast?: BattleState;
  stateCurrent: BattleState = battleStateEmpty;
  commandsHistorical: Command[][] = [];
  sendMessage?: (message: MessageServer) => void;

  constructor(battle: BattleInterface) {
    Object.assign(this, battle);
  };

  setStateCurrent(nextState: BattleState) { this.stateCurrent = nextState; };
  setRoundTimeout(nextTimeout: NodeJS.Timeout) { this.roundTimeout = nextTimeout; };
  addCommandsToHistory(newCommandsHistorical: Command[]) {
    this.commandsHistorical.push([...newCommandsHistorical]);
  };

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
        this.roundEnd();
        break;

      case BAS.CONCLUSION:
        console.log(`Battle over! Conclusion: ${this.stateCurrent.conclusion}`);
        const payload: PayloadConclusion = {
          kind: MEK.BATTLE_CONCLUSION, battleState: this.stateCurrent
        };
        this.sendPayloadToParticipants(payload);
    };
  };

  isCommandValid(command: Command) {
    const commandsExisting: { [id: string] : Command } = { ...this.stateCurrent.commandsPending };
    this.commandsHistorical.forEach((commandSet) => commandSet.forEach((command) => (
      commandsExisting[command.id] = command
    )));
    return (!commandsExisting[command.id]);

    // ToDo: validate that the command isn't hacky
  };

  acceptComand(command: Command) {
    if (!this.isCommandValid(command)) return;
    this.stateCurrent.commandsPending[command.fromId] = command;
    const allControlledHaveActed =  Object.values(this.stateCurrent.fighters)
    .every((f) => (
      f.controlledBy === FIGHTER_CONTROL_AUTO || this.stateCurrent.commandsPending[f.id]
    ));
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
        kind: MEK.ROUND_START,
        battleState: this.stateCurrent,
        battleStateLast: this.stateLast,
        toCommand
      };
      messages.push(new MessageServer({ accountId: participant.id, payload }));
    });
    messages.forEach((message) => this.sendMessage?.(message));
    
    this.shiftStatus(BAS.WAITING_FOR_COMMANDS);
  };

  roundEnd() {
    this.stateLast = { ...this.stateCurrent };
    const roundResult = performCommands(this.stateCurrent);
    const nextBattleState = roundResult.battleState;
    this.addCommandsToHistory(Object.values(this.stateCurrent.commandsPending));
    Object.values(nextBattleState.fighters).forEach((f) => {
      if (f.health > 0) f.charge += 1;
      f.defense = 0;
    });

    this.stateCurrent.round += 1;
    this.stateCurrent.commandsPending = {};

    const sideDowned = this.getSideDowned();
    if (sideDowned === null) {
      this.setStateCurrent(nextBattleState);
      this.shiftStatus(BAS.ROUND_START);
      return;
    }

    if (sideDowned === 'A') nextBattleState.conclusion = 'Side B wins...';
    if (sideDowned === 'B') nextBattleState.conclusion = 'Side A wins!';
    if (sideDowned === 'both') nextBattleState.conclusion = 'Draw!';
    this.setStateCurrent(nextBattleState);
    this.shiftStatus(BAS.CONCLUSION);
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
  stateLast?: BattleState;
  stateCurrent: BattleState;
  commandsHistorical: Command[][];
};