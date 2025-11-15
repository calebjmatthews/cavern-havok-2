import type Treasure from "@common/models/treasure";
import type Adventure from "./adventure";
import type Fighter from "@common/models/fighter";
import type { EncounterGetArgs } from "./encounter";

export default class EncounterPeaceful implements EncounterPeacefulInterface {
  id: string = '';
  type: 'peaceful' = 'peaceful';
  getIntroText: (args: EncounterGetArgs) => string = () => '';
  isFinishRoom?: boolean;
  treasureMaker?: (args: { adventure: Adventure, fighter: Fighter }) => Treasure[] = () => [];

  toSceneArgs: (args: EncounterGetArgs) {
    
  };
};

interface EncounterPeacefulInterface {
  id: string;
  type: 'peaceful';
  getIntroText: (args: EncounterGetArgs) => string = () => '';
  isFinishRoom?: boolean;
  treasureMaker?: (args: { adventure: Adventure, fighter: Fighter }) => Treasure[];
};
