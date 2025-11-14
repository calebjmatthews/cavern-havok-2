import { v4 as uuid } from "uuid";

import type Account from "@common/models/account";
import type Fighter from "@common/models/fighter";
import type Encounter from "./encounter";
import type EncounterPeaceful from "./encounterPeaceful";
import type Treasure from "@common/models/treasure";
import type { PayloadConclusion } from "@common/communicator/payload";
import type { BattleInterface } from "./battle";
import MessageServer from "@common/communicator/message_server";
import Battle from "./battle";
import encounterEmpty from "@server/instances/encounters/encounterEmpty";
import getChamberMaker from '@server/instances/adventures/chamberMakers';
import getTreasureMaker from '@server/instances/adventures/treasureMakers';
import cloneBattleState from "@common/functions/cloneBattleState";
import getAdventureLength from "@server/instances/adventures/adventureLength";
import { battleStateEmpty } from "@common/models/battleState";
import { ADVENTURE_KINDS, BATTLE_STATUS, MESSAGE_KINDS } from "@common/enums";
const MEK = MESSAGE_KINDS;

export default class Adventure implements AdventureInterface {
  id: string = '';
  kindId: ADVENTURE_KINDS = ADVENTURE_KINDS.KIND_MISSING;
  accounts: { [id: string] : Account } = {};
  accountIdsReadyForNew: { [id: string] : boolean } = {};
  fighters: { [id: string] : Fighter } = {};
  chamberCurrent: Encounter | EncounterPeaceful = encounterEmpty;
  chamberIdsFinished: string[] = [];
  chamberMaker: (adventure: Adventure) => Encounter | EncounterPeaceful = () => encounterEmpty;
  treasureMaker: (args: { adventure: Adventure, fighter: Fighter }) => Treasure[] = () => ([]);

  sendMessage?: (message: MessageServer) => void;
  setAdventure?: (adventure: Adventure) => void;
  deleteAdventure?: (adventureId: string) => void;
  setAccountInAdventure?: (accountId: string, adventureId: string) => void;
  deleteAccountInAdventure?: (accountId: string) => void;
  setBattle?: (battle: Battle) => void;
  deleteBattle?: (battleId: string) => void;
  setAccountInBattle?: (accountId: string, battleId: string) => void;
  deleteAccountInBattle?: (accountId: string) => void;
  setAccount?: (account: Account) => void;

  constructor(adventure: AdventureInterface) {
    Object.assign(this, adventure);
  };

  initialize() {
    Object.values(this.accounts).forEach((account) => {
      this.setAccountInAdventure?.(account.id, this.id);
    });
    const encounter = this.chamberMaker(this);
    if (encounter.type === 'peaceful') throw Error("Unexpected peaceful encounter in initialize.");
    this.chamberCurrent = encounter;
    this.setAdventure?.(this);
    const battleArgs = encounter.toBattleArgs({
      chamberKind: encounter.id,
      chamberIndex: this.chamberIdsFinished.length,
      battleState: battleStateEmpty,
      difficulty: 1,
      accounts: this.accounts
    });
    this.createBattle(battleArgs);
  };

  createBattle(battleInterface: BattleInterface) {
    const battleNew = new Battle(battleInterface);
    battleNew.attachSendMessage((messageToSend: MessageServer) => {
      this.sendMessage?.(messageToSend);
    });
    battleNew.attachConcludeBattle((battle: Battle) => {
      this.handleConcludedBattle(battle);
    })
    this.setBattle?.(battleNew);
    Object.values(battleInterface.participants).forEach((account) => {
      this.setAccountInBattle?.(account.id, battleNew.id);
    });
    battleNew.shiftStatus(BATTLE_STATUS.INITIALIZING);
  };

  handleConcludedBattle(battle: Battle) {
    const treasures: { [accountId: string] : Treasure[] } = {};
    Object.values(this.accounts).map((account) => {
      const fighter = Object.values(battle.stateCurrent.fighters ?? {})
      .find((f) => f.controlledBy === account.id);
      if (!fighter) throw Error(`handleConcludedBattle error: Fighter conrolled by account ID${account.id} not found.`);
      const treasureSet = this.treasureMaker({ adventure: this, fighter });
      treasures[account.id] = treasureSet;
    });
    const nextBatte = new Battle({
      ...battle,
      stateCurrent: { ...cloneBattleState(battle.stateCurrent), treasures }
    })
    this.setBattle?.(nextBatte);
    const payload: PayloadConclusion = {
      kind: MEK.BATTLE_CONCLUSION,
      battleState: nextBatte.stateCurrent,
      battleStateLast: battle.stateLast ?? battleStateEmpty
    };
    const messages: MessageServer[] = Object.values(this.accounts).map((account) => (
      new MessageServer({ accountId: account.id, payload })
    ));
    messages.forEach((message) => this.sendMessage?.(message));
  };

  readyForNew(args: { accountId: string, treasure: Treasure }) {
    const { accountId, treasure } = args;
    if (this.accountIdsReadyForNew[accountId]) {
      console.log(`Treasure already claimed for account ID${accountId}.`);
      return;
    };
    console.log(`Treasure claimed by account ID${accountId}: `, treasure);
    this.accountIdsReadyForNew[accountId] = true;
    const notYetReady = Object.values(this.accounts).filter((a) => !this.accountIdsReadyForNew[a.id]);
    if (notYetReady.length === 0) this.discardBattle();
  };

  discardBattle() {
    this.chamberIdsFinished.push(this.chamberCurrent.id);
    if (this.chamberIdsFinished.length >= getAdventureLength(this.id)) {
      this.concludeAdventure();
      return;
    }
    const encounter = this.chamberMaker(this);
    if (encounter.type === 'peaceful') throw Error("Unexpected peaceful encounter in discardBattle.");
    this.chamberCurrent = encounter;
    this.setAdventure?.(this);
    const battleArgs = encounter.toBattleArgs({
      chamberKind: encounter.id,
      chamberIndex: this.chamberIdsFinished.length,
      battleState: battleStateEmpty,
      difficulty: 1,
      accounts: this.accounts,
      fighters: this.fighters
    });
    this.createBattle(battleArgs);
  };

  concludeAdventure() {
    console.log(`Adventure concluded!`);
  };

  attachFunctions(args: {
    sendMessageFunction: (message: MessageServer) => void;
    setAdventureFunction: (adventure: Adventure) => void;
    deleteAdventureFunction: (adventureId: string) => void;
    setAccountInAdventureFunction: (accountId: string, adventureId: string) => void;
    deleteAccountInAdventureFunction: (accountId: string) => void;
    setBattleFunction: (battle: Battle) => void;
    deleteBattleFunction: (battleId: string) => void;
    setAccountInBattleFunction: (accountId: string, battleId: string) => void;
    deleteAccountInBattleFunction: (accountId: string) => void;
    setAccountFunction: (account: Account) => void;
  }) {
    this.sendMessage = args.sendMessageFunction;
    this.setAdventure = args.setAdventureFunction;
    this.deleteAdventure = args.deleteAdventureFunction;
    this.setAccountInAdventure = args.setAccountInAdventureFunction;
    this.deleteAccountInAdventure = args.deleteAccountInAdventureFunction;
    this.setBattle = args.setBattleFunction;
    this.deleteBattle = args.deleteBattleFunction;
    this.setAccountInBattle = args.setAccountInBattleFunction;
    this.deleteAccountInBattle = args.deleteAccountInBattleFunction;
    this.setAccount = args.setAccountFunction;
  };
};

export const getAdventure = (args: {
  adventureKindId: ADVENTURE_KINDS,
  accounts: { [id: string] : Account }
}) => {
  const { adventureKindId, accounts } =  args;

  const chamberMaker = getChamberMaker(adventureKindId);
  const treasureMaker = getTreasureMaker(adventureKindId);
  const adventure = new Adventure({
    id: uuid(),
    kindId: adventureKindId,
    accounts,
    accountIdsReadyForNew: {},
    fighters: {},
    chamberCurrent: encounterEmpty,
    chamberIdsFinished: [],
    chamberMaker,
    treasureMaker
  });

  const fighters: { [fighterId: string] : Fighter } = {};
  Object.values(accounts).forEach((account) => {
    const fighter = account.character?.toFighter({
      name: account.name || "",
      ownedBy: account.id,
      controlledBy: account.id,
      side: 'A',
      coords: [Object.keys(fighters).length, -1]
    });
    if (fighter) fighters[fighter.id] = fighter;
  });

  return adventure;
};

interface AdventureInterface {
  id: string;
  kindId: ADVENTURE_KINDS;
  accounts: { [id: string] : Account };
  accountIdsReadyForNew: { [id: string] : boolean };
  fighters: { [id: string] : Fighter };
  chamberCurrent: Encounter | EncounterPeaceful;
  chamberIdsFinished: string[];
  chamberMaker: (adventure: Adventure) => Encounter | EncounterPeaceful;
  treasureMaker: (args: { adventure: Adventure, fighter: Fighter }) => Treasure[];

  sendMessage?: (message: MessageServer) => void;
  setAdventure?: (adventure: Adventure) => void;
  deleteAdventure?: (adventureId: string) => void;
  setAccountInAdventure?: (accountId: string, adventureId: string) => void;
  deleteAccountInAdventure?: (accountId: string) => void;
  setBattle?: (battle: Battle) => void;
  deleteBattle?: (battleId: string) => void;
  setAccountInBattle?: (accountId: string, battleId: string) => void;
  deleteAccountInBattle?: (accountId: string) => void;
  setAccount?: (account: Account) => void;
};