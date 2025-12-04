import { v4 as uuid } from "uuid";

import type Account from "@common/models/account";
import type Encounter from "./encounter";
import type EncounterPeaceful from "./encounterPeaceful";
import type Treasure from "@common/models/treasure";
import type Outcome from "@common/models/outcome";
import type { PayloadConclusion, PayloadTreasureApplied } from "@common/communicator/payload";
import type { BattleInterface } from "./battle";
import type { SceneInterface } from "./scene";
import MessageServer from "@common/communicator/message_server";
import Battle from "./battle";
import Fighter from "@common/models/fighter";
import Scene from "./scene";
import encounterEmpty from "@server/instances/encounters/encounterEmpty";
import { getChamberMaker, getTreasureMaker } from '@server/instances/adventures';
import cloneBattleState from "@common/functions/cloneBattleState";
import { battleStateEmpty } from "@common/models/battleState";
import { sceneStateEmpty } from "@common/models/sceneState";
import { ADVENTURE_KINDS, BATTLE_STATUS, MESSAGE_KINDS } from "@common/enums";
import foods from "@common/instances/food";
import { OUTCOME_DURATION_DEFAULT } from "@common/constants";
import joinWithAnd from "@common/functions/utils/joinWithAnd";
import type AlterationActive from "@common/models/alterationActive";
import alterations from "@common/instances/alterations";
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
  treasuresApplying?: { accountId: string, outcomes: Outcome[], text: string }[];
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

  readyForNew(args: { accountId: string, treasure: Treasure }) {
    const { accountId, treasure } = args;
    if (this.accountIdsReadyForNew[accountId]) {
      console.log(`Treasure already claimed for account ID${accountId}.`);
      return;
    };
    console.log(`Treasure claimed by account ID${accountId}: `, treasure);
    this.treasureApply(args);
    this.accountIdsReadyForNew[accountId] = true;
    const notYetReady = Object.values(this.accounts).filter((a) => !this.accountIdsReadyForNew[a.id]);
    if (notYetReady.length === 0 && this.battleCurrentId) {
      this.discardBattle();
    }
    else if (notYetReady.length === 0 && this.sceneCurrentId) {
      this.discardScene();
    }
  };

  treasureApply(args: { accountId: string, treasure: Treasure }) {
    const { accountId, treasure } = args;

    // ToDo: Create outcome for this if applicable, along with text description
    const fighter = Object.values(this.fighters).find((f) => f.controlledBy === accountId);
    if (!fighter) return;
    if (!this.treasuresApplying) this.treasuresApplying = [];
    const fighterNext = new Fighter(fighter);
    const outcomeRoot: Outcome = { affectedId: fighter.id, duration: OUTCOME_DURATION_DEFAULT };

    if (treasure.kind === 'cinders') {
      fighter.cinders += treasure.quantity;
      const outcome = { ...outcomeRoot, cindersGained: treasure.quantity };
      let text = `${fighter.name} gained ${treasure.quantity} cinders`;
      if (fighter.cinders > treasure.quantity) {
        text = `${text}, for a total of c${fighter.cinders}.`
      }
      else {
        text = `${text}.`;
      }
      this.treasuresApplying?.push({ accountId, outcomes: [outcome], text });
    };

    if (treasure.kind === 'food') {
      const food = foods[treasure.id || ''];
      if (!food) return;
      const outcomes: Outcome[] = [];
      const textPieces = [`${fighter.name} ate the ${food.name}`];

      if (food.healthMax) {
        fighterNext.healthMax += food.healthMax;
        fighterNext.health += food.healthMax;
        textPieces.push(`gained ${food.healthMax} maximum health (new total ${fighterNext.healthMax})`);
        outcomes.push({ ...outcomeRoot, healthMax: food.healthMax });
      };

      if (food.damage) {
        fighterNext.health -= food.damage;
        textPieces.push(`took ${food.damage} damage`);
        outcomes.push({ ...outcomeRoot, damage: food.damage });
      };

      if (food.healing) {
        fighterNext.health += food.healing;
        if (fighterNext.health > fighterNext.healthMax) {
          fighterNext.health = fighterNext.healthMax;
          textPieces.push(`was fully healed`);
        }
        else {
          textPieces.push(`healed ${food.healing}`);
        }
        outcomes.push({ ...outcomeRoot, healing: food.healing });
      };

      if (food.healToPercentage) {
        const healTo = Math.ceil(fighterNext.healthMax * (food.healToPercentage / 100));
        if (healTo > fighterNext.health) {
          const healing = healTo - fighter.health;
          if (healTo === fighterNext.healthMax) {
            textPieces.push(`was fully healed`);
          }
          else {
            textPieces.push(`healed ${healing}`);
          }
          fighterNext.health = healTo;
          outcomes.push({ ...outcomeRoot, healing });
        };
      };

      if (food.speed) {
        fighterNext.speed += food.speed;
        textPieces.push(`gained ${food.speed} speed (new total ${fighterNext.speed})`);
        outcomes.push({ ...outcomeRoot, speed: food.speed });
      };

      if (food.blessing) {
        const blessing = alterations[food.blessing.alterationId];
        if (!blessing) return;
        const alterationActive: AlterationActive = {
          id: uuid(),
          alterationId: food.blessing.alterationId,
          ownedBy: fighterNext.id,
          extent: food.blessing.extent
        };
        this.alterationsActive[alterationActive.id] = alterationActive;
        textPieces.push(blessing.outcomeText ?? `was blessed with ${blessing.id}`);
      }

      if (textPieces.length === 1) textPieces.push(`nothing much happened`);
      this.treasuresApplying.push({ accountId, outcomes, text: `${joinWithAnd(textPieces)}.` });
    };

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
    this.createNextChamber();
  };

  createNextChamber() {
    const encounter = this.chamberMaker(this);
    const encounterGetArgs = {
      chamberKind: encounter.id,
      chamberIndex: this.chamberIdsFinished.length,
      battleState: battleStateEmpty,
      difficulty: 1,
      accounts: this.accounts,
      fighters: this.fighters
    };
    if (encounter.type === 'battle') {
      const battleArgs = encounter.toBattleArgs(encounterGetArgs);
      this.createBattle(battleArgs);
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
  treasuresApplying?: { accountId: string, outcomes: Outcome[], text: string }[];
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