import type Fighter from "@common/models/fighter";
import LayeredAnimated from "@client/models/artist/layeredAnimated";
import { LAYERED_ANIMATED_STATES, SPRITE_NAMES } from "@client/enums";
const LAS = LAYERED_ANIMATED_STATES;
const SPN = SPRITE_NAMES;

// spriteNames: string[];
// durations?: number[];
// offsets?: { x: number, y: number }[];
// rotations?: number[];
// loop?: boolean;

const fighterToLayeredAnimated = (fighter: Fighter) => {
  return new LayeredAnimated({
    id: fighter.id,
    intialState: LAS.RESTING,
    layersAnimated: {
      [LAS.RESTING]: { spriteNames: [SPN.SBR_RESTING] }
    }
  });
};

export default fighterToLayeredAnimated