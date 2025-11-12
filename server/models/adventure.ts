import { v4 as uuid } from "uuid";

import type Account from "@common/models/account";
import type Fighter from "@common/models/fighter";
import type Encounter from "./encounter";
import type EncounterPeaceful from "./encounterPeaceful";
import type Treasure from "@common/models/treasure";
import type MessageServer from "@common/communicator/message_server";
import type { BattleInterface } from "./battle";
import Battle from "./battle";
import encounterEmpty from "@server/instances/encounters/encounterEmpty";
import getChamberMaker from '@server/instances/adventures/chamberMakers';
import getTreasureMaker from '@server/instances/adventures/treasureMakers';
import { battleStateEmpty } from "@common/models/battleState";
import { ADVENTURE_KINDS, BATTLE_STATUS } from "@common/enums";

export default class Adventure implements AdventureInterface {
  id: string = '';
  kindId: ADVENTURE_KINDS = ADVENTURE_KINDS.KIND_MISSING;
  accounts: { [id: string] : Account } = {};
  accountIdsReadyForNext: { [id: string] : boolean } = {};
  fighters: { [id: string] : Fighter } = {};
  chamberCurrent: Encounter | EncounterPeaceful = encounterEmpty;
  chamberKindsFinished: string[] = [];
  chamberMaker: (adventure: Adventure) => Encounter | EncounterPeaceful = () => encounterEmpty;
  treasureMaker: (adventure: Adventure) => Treasure[] = () => ([]);

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
    if (encounter.type === 'peaceful') throw Error("Unexpected peaceful encounter in createAdventure.");
    this.chamberCurrent = encounter;
    this.setAdventure?.(this);
    const battleArgs = encounter.toBattleArgs({
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
    this.setBattle?.(battleNew);
    Object.values(battleInterface.participants).forEach((account) => {
      this.setAccountInBattle?.(account.id, battleNew.id);
    });
    battleNew.shiftStatus(BATTLE_STATUS.INITIALIZING);
  };

  readyForNext(args: { accountId: string, battle: Battle }) {
    const { accountId, battle } = args;
    this.accountIdsReadyForNext[accountId] = true;
    const notYetReady = Object.values(this.accounts).filter((a) => !this.accountIdsReadyForNext[a.id]);
    if (notYetReady.length === 0) this.finishChamber(battle);
  };

  finishChamber(battle: Battle) {

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
    accountIdsReadyForNext: {},
    fighters: {},
    chamberCurrent: encounterEmpty,
    chamberKindsFinished: [],
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
  accountIdsReadyForNext: { [id: string] : boolean };
  fighters: { [id: string] : Fighter };
  chamberCurrent: Encounter | EncounterPeaceful;
  chamberKindsFinished: string[];
  chamberMaker: (adventure: Adventure) => Encounter | EncounterPeaceful;
  treasureMaker: (adventure: Adventure) => Treasure[];

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