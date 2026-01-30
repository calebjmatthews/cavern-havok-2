import { v4 as uuid } from "uuid";

import type Account from "@common/models/account";
import type Encounter from "../encounter";
import type EncounterPeaceful from "../encounterPeaceful";
import type Treasure from "@common/models/treasure";
import type Outcome from "@common/models/outcome";
import type AlterationActive from "@common/models/alterationActive";
import type BattleState from "@common/models/battleState";
import type { PayloadConclusion, PayloadTreasureApplied } from "@common/communicator/payload";
import type { BattleInterface } from "../battle";
import type { SceneInterface } from "../scene";
import type { TreasuresApplying } from "@common/models/treasuresApplying";
import MessageServer from "@common/communicator/message_server";
import Battle from "../battle";
import Fighter from "@common/models/fighter";
import Scene from "../scene";
import encounterEmpty from "@server/instances/encounters/encounterEmpty";
import cloneBattleState from "@common/functions/cloneBattleState";
import { getChamberMaker, getTreasureMaker } from '@server/instances/adventures';
import { battleStateEmpty } from "@common/models/battleState";
import { sceneStateEmpty } from "@common/models/sceneState";
import { ADVENTURE_KINDS, BATTLE_STATUS, MESSAGE_KINDS } from "@common/enums";
import { OUTCOME_DURATION_DEFAULT } from "@common/constants";
import treasureApplyOne from "./treasureApplyOne";
const MEK = MESSAGE_KINDS;

export default class Adventure implements AdventureInterface {
  id: string = '';
  kindId: ADVENTURE_KINDS = ADVENTURE_KINDS.KIND_MISSING;
  accounts: { [id: string] : Account } = {};
  accountIdsReadyForNew: { [id: string] : boolean } = {};
  fighters: { [id: string] : Fighter } = {};
  chamberCurrent: Encounter | EncounterPeaceful = encounterEmpty;
  battleCurrentId?: string;
  sceneCurrentId?: string;
  treasureChoices?: { [accountId: string] : Treasure[] };
  treasuresApplying?: TreasuresApplying;
  alterationsActive: { [id: string] : AlterationActive } = {};
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
  setScene?: (scene: Scene) => void;
  deleteScene?: (sceneId: string) => void;
  setAccountInScene?: (accountId: string, sceneId: string) => void;
  deleteAccountInScene?: (accountId: string) => void;
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
      difficulty: 0,
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
    this.battleCurrentId = battleNew.id;
    Object.values(battleInterface.participants).forEach((account) => {
      this.setAccountInBattle?.(account.id, battleNew.id);
    });
    battleNew.shiftStatus(BATTLE_STATUS.INITIALIZING);
  };

  handleConcludedBattle(battle: Battle) {
    const treasures: { [accountId: string] : Treasure[] } = {};
    Object.values(this.accounts).map((account, index) => {
      const fighter = Object.values(battle.stateCurrent.fighters ?? {})
      .find((f) => f.controlledBy === account.id);
      if (!fighter) throw Error(`handleConcludedBattle error: Fighter conrolled by account ID${account.id} not found.`);
      this.fighters[fighter.id] = new Fighter({ ...fighter, coords: [index, -1] });
      const treasureSet = this.treasureMaker({ adventure: this, fighter });
      treasures[account.id] = treasureSet;
    });
    const nextBatte = new Battle({
      ...battle,
      stateCurrent: { ...cloneBattleState(battle.stateCurrent), treasures }
    })
    this.setBattle?.(nextBatte);
    this.treasureChoices = treasures;
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

  createScene(sceneInterface: SceneInterface) {
    const sceneNew = new Scene(sceneInterface);
    sceneNew.attachSendMessage((messageToSend: MessageServer) => {
      this.sendMessage?.(messageToSend);
    });
    sceneNew.attachConcludeScene((scene: Scene) => {
      this.handleConcludedScene(scene);
    })
    this.setScene?.(sceneNew);
    this.sceneCurrentId = sceneNew.id;
    Object.values(sceneInterface.accounts).forEach((account) => {
      this.setAccountInScene?.(account.id, sceneNew.id);
    });
    sceneNew.beginScene();
  };

  handleConcludedScene(scene: Scene) {
    if (scene.isFinishRoom) {
      this.concludeAdventure();
    }
  };

  treasureClaim(args: { accountId: string, treasure: Treasure }) {
    const { accountId, treasure } = args;
    if (this.accountIdsReadyForNew[accountId]) {
      console.log(`Treasure already claimed for account ID${accountId}.`);
      return;
    };
    console.log(`Treasure claimed by account ID${accountId}: `, treasure);
    this.treasureApply({ accountId, treasureSelected: treasure });
  };

  readyForNew(accountId: string) {
    this.accountIdsReadyForNew[accountId] = true;
    const notYetReady = Object.values(this.accounts).filter((a) => !this.accountIdsReadyForNew[a.id]);
    if (notYetReady.length === 0 && this.battleCurrentId) {
      this.discardBattle();
    }
    else if (notYetReady.length === 0 && this.sceneCurrentId) {
      this.discardScene();
    };
  };

  treasureApply(args: { accountId: string, treasureSelected: Treasure }) {
    const { accountId, treasureSelected } = args;

    const fighter = Object.values(this.fighters).find((f) => f.controlledBy === accountId);
    if (!fighter) return;
    if (!this.treasuresApplying) this.treasuresApplying = [];
    const outcomeRoot: Outcome = { affectedId: fighter.id, duration: OUTCOME_DURATION_DEFAULT };
    let fighterNext = new Fighter(fighter);
    let outcomes: Outcome[] = [];
    let text = '';

    const treasuresGuaranteed = (this.treasureChoices?.[accountId] ?? []).filter((t) => t.isGuaranteed);
    [...treasuresGuaranteed, treasureSelected].forEach((treasure) => {
      const results = treasureApplyOne({ treasure, outcomeRoot, fighter });
      if (results?.fighterNext) fighterNext = results.fighterNext;
      if (results?.outcomes) outcomes = [...outcomes, ...results.outcomes];
      if (text.length > 0) text = `${text} `;
      if (results?.text) text = `${text}${results.text}`;
      (results?.glyphsLearned ?? []).forEach((glyphSeen) => {
        const account = this.accounts[accountId];
        if (!account) return;
        if (!account.glyphsSeen) account.glyphsSeen = [];
        account.glyphsSeen.push(glyphSeen);
      });
    });
    
    this.treasuresApplying.push({ accountId, outcomes, text });
    this.fighters[fighterNext.id] = fighterNext;

    const payload: PayloadTreasureApplied = {
      kind: MEK.TREASURE_APPLIED,
      treasuresApplying: this.treasuresApplying
    };
    const messages: MessageServer[] = Object.values(this.accounts).map((account) => (
      new MessageServer({ accountId: account.id, payload })
    ));
    messages.forEach((message) => this.sendMessage?.(message));
  };

  

  discardBattle() {
    this.chamberIdsFinished.push(this.chamberCurrent.id);
    Object.values(this.accounts || {}).forEach((account) => {
      this.deleteAccountInBattle?.(account.id);
      delete this.accountIdsReadyForNew[account.id];
    });
    if (this.battleCurrentId) {
      this.deleteBattle?.(this.battleCurrentId);
      this.battleCurrentId = undefined;
    }
    this.treasuresApplying = undefined;
    this.createNextChamber();
  };

  createNextChamber() {
    const encounter = this.chamberMaker(this);
    const encounterGetArgs = {
      chamberKind: encounter.id,
      chamberIndex: this.chamberIdsFinished.length,
      battleState: battleStateEmpty,
      // ToDo: Difficulty should account for character level
      difficulty: this.chamberIdsFinished.length,
      accounts: this.accounts,
      fighters: this.fighters
    };
    if (encounter.type === 'battle') {
      const battleArgs = encounter.toBattleArgs(encounterGetArgs);
      const stateInitial: BattleState = {
        ...battleArgs.stateInitial,
        alterationsActive: this.alterationsActive
      };
      this.createBattle({
        ...battleArgs,
        stateInitial,
        stateCurrent: stateInitial
      });
    }
    else if (encounter.type === 'peaceful') {
      const sceneArgs = encounter.toSceneArgs({
        ...encounterGetArgs,
        adventure: this,
        sceneState: sceneStateEmpty
      });
      this.createScene(sceneArgs);
    };
    this.chamberCurrent = encounter;
    this.setAdventure?.(this);
  };

  discardScene() {
    this.chamberIdsFinished.push(this.chamberCurrent.id);
    Object.values(this.accounts || {}).forEach((account) => {
      this.deleteAccountInScene?.(account.id);
      delete this.accountIdsReadyForNew[account.id];
    });
    if (this.sceneCurrentId) {
      this.deleteScene?.(this.sceneCurrentId);
      this.sceneCurrentId = undefined;
    }

    if ("isFinishRoom" in this.chamberCurrent && this.chamberCurrent.isFinishRoom) {
      this.concludeAdventure();
    }
    else {
      this.createNextChamber();
    };
  };

  concludeAdventure() {
    console.log(`Adventure concluded!`);
    const messages: MessageServer[] = [];
    Object.values(this.accounts).forEach((account) => {
      messages.push(new MessageServer({
        accountId: account.id,
        payload: { kind: MEK.ADVENTURE_OVER }
      }));
      this.deleteAccountInAdventure?.(account.id);
    });
    messages.forEach((message) => this.sendMessage?.(message));
    this.deleteAdventure?.(this.id);
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
    setSceneFunction: (Ss: Scene) => void;
    deleteSceneFunction: (SsId: string) => void;
    setAccountInSceneFunction: (accountId: string, SsId: string) => void;
    deleteAccountInSceneFunction: (accountId: string) => void;
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
    this.setScene = args.setSceneFunction;
    this.deleteScene = args.deleteSceneFunction;
    this.setAccountInScene = args.setAccountInSceneFunction;
    this.deleteAccountInScene = args.deleteAccountInSceneFunction;
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
  battleCurrentId?: string;
  sceneCurrentId?: string;
  treasuresApplying?: TreasuresApplying;
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
  setScene?: (scene: Scene) => void;
  deleteScene?: (sceneId: string) => void;
  setAccountInScene?: (accountId: string, sceneId: string) => void;
  deleteAccountInScene?: (accountId: string) => void;
  setAccount?: (account: Account) => void;
};