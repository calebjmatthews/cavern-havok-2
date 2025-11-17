import { v4 as uuid } from "uuid";

import type Treasure from "@common/models/treasure";
import type Adventure from "./adventure";
import type Fighter from "@common/models/fighter";
import type SceneState from "@common/models/sceneState";
import type { EncounterGetArgs } from "./encounter";
import type { SceneInterface } from "./scene";

export default class EncounterPeaceful implements EncounterPeacefulInterface {
  id: string = '';
  name: string = '';
  type: 'peaceful' = 'peaceful';
  getIntroText: (args: EncounterGetArgs) => string = () => '';
  isFinishRoom?: boolean;
  treasureMaker?: (args: { adventure: Adventure, fighter: Fighter }) => Treasure[] = () => [];

  constructor(encounterPeaceful: EncounterPeacefulInterface) {
    Object.assign(this, encounterPeaceful);
  };

  toSceneArgs(args: EncounterGetArgs): SceneInterface {
    const { chamberKind, chamberIndex, accounts, fighters } = args;
    if (!fighters) throw Error("Unexpected lack of fighters in encounterPeaceful toSceneArgs.");

    const sceneState: SceneState = {
      sceneId: uuid(),
      name: this.name,
      fighters,
      texts: { introText: this.getIntroText(args) }
    }

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
  getIntroText: (args: EncounterGetArgs) => string;
  isFinishRoom?: boolean;
  treasureMaker?: (args: { adventure: Adventure, fighter: Fighter }) => Treasure[];
};
