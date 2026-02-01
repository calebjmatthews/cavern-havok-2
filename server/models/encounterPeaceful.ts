import type Treasure from "@common/models/treasure";
import type Adventure from "./adventure/adventure";
import type Fighter from "@common/models/fighter";
import type SceneState from "@common/models/sceneState";
import type { SceneInterface } from "./scene";
import type Account from "@common/models/account";
import { genId } from "@common/functions/utils/random";

export default class EncounterPeaceful implements EncounterPeacefulInterface {
  id: string = '';
  name: string = '';
  type: 'peaceful' = 'peaceful';
  getIntroText: (args: SceneGetArgs) => string = () => '';
  isFinishRoom?: boolean;
  treasureMaker?: (args: { adventure: Adventure, fighter: Fighter }) => Treasure[] = () => [];

  constructor(encounterPeaceful: EncounterPeacefulInterface) {
    Object.assign(this, encounterPeaceful);
  };

  toSceneArgs(args: SceneGetArgs): SceneInterface {
    const { adventure, chamberKind, chamberIndex, accounts, fighters } = args;
    if (!fighters) throw Error("Unexpected lack of fighters in encounterPeaceful toSceneArgs.");

    let treasures: { [accountId: string] : Treasure[] } | undefined;
    if (this.treasureMaker) {
      Object.values(fighters).forEach((fighter) => {
        if (!this.treasureMaker) return;
        if (!treasures) treasures = {};
        treasures[fighter.controlledBy] = this.treasureMaker({ adventure, fighter });
      });
    };
    const sceneState: SceneState = {
      sceneId: genId(),
      name: this.name,
      fighters,
      texts: { introText: this.getIntroText(args) },
      treasures
    };

    return {
      id: sceneState.sceneId,
      chamberKind,
      chamberIndex,
      accounts,
      state: sceneState,
      isFinishRoom: this.isFinishRoom
    };
  };
};

interface EncounterPeacefulInterface {
  id: string;
  name: string;
  type: 'peaceful';
  getIntroText: (args: SceneGetArgs) => string;
  isFinishRoom?: boolean;
  treasureMaker?: (args: { adventure: Adventure, fighter: Fighter }) => Treasure[];
};

interface SceneGetArgs {
  chamberKind: string;
  chamberIndex: number;
  sceneState: SceneState;
  adventure: Adventure;
  difficulty: number;
  accounts: { [accountId: string] : Account };
  fighters?: { [fighterId: string] : Fighter };
};