import type CycleLayer from "@client/models/artist/cycleLayer";
import framesToCycles from "@client/functions/artist/framesToCycles";
import { ARTIST_Z_INDECES, EQUIPMENTS, LAYERED_ANIMATED_STATES } from "@common/enums";
import { FRAME_NAMES, SPRITE_NAMES } from "@client/enums";

const LAS = LAYERED_ANIMATED_STATES;
const SPN = SPRITE_NAMES;
const FRN = FRAME_NAMES;

const cycleLayersTops: { [name: string] : CycleLayer } = {
  [EQUIPMENTS.DOWN_VEST]: {
    layers: framesToCycles({
      name: 'belted_overalls',
      /**
        RESTING = "Resting",
        WALKING_0 = "Walking 0",
        WALKING_1 = "Walking 1",
        SWINGING_0 = "Swinging 0",
        SWINGING_1 = "Swinging 1",
        SWINGING_2 = "Swinging 2",
        CHEERING = "Cheering",
        CASTING = "Casting",
        CRITICAL = "Critical",
        DAMAGED = "Damaged",
        CLENCHING = "Clenching",
       */
      frames: {
        [FRN.RESTING]: {
          offset: { x: 3, y: 11 }
        }
      }
    }),
    zIndex: ARTIST_Z_INDECES.TOP
  }
};

export default cycleLayersTops;