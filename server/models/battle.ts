import { v4 as uuid } from 'uuid';

import type BattleState from "../../common/models/battleState";
import type Command from "../../common/models/command";
import type Account from "@common/models/account";
import type AlterationActive from "@common/models/alterationActive";
import type { PayloadCommandsUpdated, PayloadFighterPlacement, PayloadRoundStart }
  from "@common/communicator/payload";
import MessageServer from "@common/communicator/message_server";
import Fighter from '@common/models/fighter';
import genAutoCommands from "@server/functions/battleLogic/genAutoCommands";
import performCommands, { performRoundJuncture }
  from "@common/functions/battleLogic/performCommands/performCommands";
import cloneBattleState from '@common/functions/cloneBattleState';
import getOccupantIdFromCoords from '@common/functions/positioning/getOccupantIdFromCoords';
import equipments from '@common/instances/equipments';
import alterations from '@common/instances/alterations';
import { battleStateEmpty } from "../../common/models/battleState";
import { FIGHTER_CONTROL_AUTO, ROUND_DURATION_DEFAULT } from "@common/constants";
import { BATTLE_STATUS, MESSAGE_KINDS } from "@common/enums";
const BAS = BATTLE_STATUS;
const MEK = MESSAGE_KINDS;

export default class Battle implements BattleInterface {
  id: string = '';
  chamberKind: string = '';
  chamberIndex: number = 0;
  status: BATTLE_STATUS = BAS.CLEAN;
  participants: { [id: string] : Account } = {};
  roundDuration: number = ROUND_DURATION_DEFAULT;
  roundTimeout?: NodeJS.Timeout;
  stateInitial: BattleState = battleStateEmpty;
  stateLast?: BattleState;
  stateCurrent: BattleState = battleStateEmpty;
  commandsHistorical: Command[][] = [];
  sendMessage?: (message: MessageServer) => void;
  concludeBattle?: (battle: Battle) => void;

  constructor(battle: BattleInterface) {
    Object.assign(this, battle);
  };

  setStateCurrent(nextState: BattleState) { this.stateCurrent = nextState; };
  setStateLast(nextStateLast: BattleState) { this.stateLast = nextStateLast; };
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
        this.initialize();
        break;

      case BAS.FIGHTER_PLACEMENT:
        this.fighterPlacement();
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
        this.concludeBattle?.(this);
    };
  };

  initialize() {
    const nextAlterationsActive: { [id: string] : AlterationActive } = {
      ...this.stateInitial.alterationsActive
    };
    Object.values(this.stateCurrent.fighters).forEach((fighter) => {
      fighter.equipped.forEach((piece) => {
        const equipment = equipments[piece.equipmentId];
        const alteration = equipment?.alteration;
        if (!alteration) return;
        const alterationActive: AlterationActive = {
          id: uuid(),
          alterationId: alteration.id,
          ownedBy: fighter.id,
          extent: 1
        };
        nextAlterationsActive[alterationActive.id] = alterationActive;
      });
    });
    // stateCurrent should account for Battle start and Round start alterations
    const nextStateLast = { ...this.stateCurrent, alterationsActive: nextAlterationsActive };
    this.setStateLast(nextStateLast);
    const { battleState: nextStateCurrent } = performRoundJuncture({
      battleState: nextStateLast,
      subCommandsResolved: [],
      delayFromRoot: 0,
      roundTimings: ['battleStart', 'roundStart']
    })
    this.setStateCurrent(nextStateCurrent);
    this.shiftStatus(BAS.FIGHTER_PLACEMENT);
  };

  fighterPlacement() {
    const messages: MessageServer[] = [];
    Object.values(this.participants).forEach((participant) => {
      const fighter = Object.values(this.stateCurrent.fighters).find((f) => f.ownedBy === participant.id);
      const toCommand = fighter?.id;
      if (!toCommand) return;
      const payload: PayloadFighterPlacement = {
        kind: MEK.FIGHTER_PLACEMENT,
        battleState: this.stateCurrent,
        toCommand
      };
      messages.push(new MessageServer({ accountId: participant.id, payload }));
    });
    messages.forEach((message) => this.sendMessage?.(message));
  };

  acceptFighterPlacement(args: { toCommand: string, coords: [number, number] }) {
    const { toCommand, coords } = args;
    const spotOpen = !getOccupantIdFromCoords({ battleState: this.stateCurrent, coords });
    if (!spotOpen) return;

    const state = this.stateCurrent;
    const fighter = state.fighters[toCommand];
    if (!fighter) throw Error(`acceptFighterPlacement error: fighter ${toCommand} not found.`);
    const stateAfterPlacement = cloneBattleState({ ...state, fighters: { ...state.fighters, ...{
      [toCommand]: new Fighter({ ...fighter, coords })
    } } });
    this.setStateCurrent(stateAfterPlacement);

    const allFightersPlaced = Object.values(this.stateCurrent.fighters).every((fighter) => (
      fighter.coords[1] !== -1
    ));
    if (allFightersPlaced) this.shiftStatus(BAS.ROUND_START);
    else this.fighterPlacement(); // To update each client with the newly placed fighter
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
      || f.health <= 0
    ));
    if (allControlledHaveActed) {
      this.shiftStatus(BAS.ROUND_END);
    }
    else {
      const messages: MessageServer[] = [];
      Object.values(this.participants).forEach((participant) => {
        const payload: PayloadCommandsUpdated = {
          kind: MEK.COMMANDS_UPDATED,
          battleState: this.stateCurrent
        };
        messages.push(new MessageServer({ accountId: participant.id, payload }));
      });
      messages.forEach((message) => this.sendMessage?.(message));
    };
  };

  roundEnd() {
    this.setStateLast(cloneBattleState(this.stateCurrent));
    const roundResult = performCommands(this.stateCurrent);
    const nextBattleState = cloneBattleState(roundResult.battleState);
    this.addCommandsToHistory(Object.values(this.stateCurrent.commandsPending));
    Object.values(nextBattleState.fighters).forEach((f) => {
      if (f.health > 0) f.charge += 1;
      f.defense = 0;
    });
    Object.values({ ...nextBattleState.obstacles, ...nextBattleState.creations }).forEach((oc) => {
      oc.defense = 0;
    });
    Object.values(nextBattleState.alterationsActive).forEach((aa) => {
      const alteration = alterations[aa.alterationId];
      if (alteration?.declinesAtEndOfRound) aa.extent -= 1;
      if (aa.extent <= 0) delete nextBattleState.alterationsActive[aa.id];
    });

    this.stateCurrent.round += 1;
    this.stateCurrent.commandsPending = {};
    this.setStateCurrent(nextBattleState);
    
    const sideDowned = this.getSideDowned();
    if (sideDowned === null) {
      this.shiftStatus(BAS.ROUND_START);
      return;
    }

    if (sideDowned === 'A') nextBattleState.conclusion = 'Side B wins...';
    if (sideDowned === 'B') nextBattleState.conclusion = 'Side A wins!';
    if (sideDowned === 'both') nextBattleState.conclusion = 'Draw!';
    this.setStateCurrent(nextBattleState);
    this.shiftStatus(BAS.CONCLUSION);
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

  attachSendMessage(sendMessageFunction: (message: MessageServer) => void) {
    this.sendMessage = sendMessageFunction;
  };

  attachConcludeBattle(concludeBattleFunction: (battle: Battle) => void) {
    this.concludeBattle = concludeBattleFunction;
  };
};

export interface BattleInterface {
  id: string;
  chamberKind: string;
  chamberIndex: number;
  status: BATTLE_STATUS;
  participants: { [id: string] : Account };
  roundDuration: number;
  roundTimeout?: NodeJS.Timeout;
  stateInitial: BattleState;
  stateLast?: BattleState;
  stateCurrent: BattleState;
  commandsHistorical: Command[][];
  sendMessage?: (message: MessageServer) => void;
  concludeBattle?: (battle: Battle) => void;
};