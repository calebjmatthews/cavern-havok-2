import type CycleLayer from "@client/models/artist/cycleLayer";
import framesOneNameToCycles from "@client/functions/artist/framesOneNameToCycles";
import { ARTIST_Z_INDECES, EQUIPMENTS } from "@common/enums";
import { CYCLE_LAYER_SLOTS, FRAME_NAMES } from "@client/enums";

const FRN = FRAME_NAMES;

const cycleLayersWeapons: { [name: string] : CycleLayer } = {
  [EQUIPMENTS.HATCHET]: {
    id: EQUIPMENTS.HATCHET,
    slot: CYCLE_LAYER_SLOTS.MAIN,
    layers: { ...framesOneNameToCycles({
      spriteName: 'flintlet.png',
      frames: {
        [FRN.CLENCHING]: {
          offset: { x: 8, y: 1 }
        },
        [FRN.SWINGING_0]: {
          offset: { x: 10, y: -6 }
        },
        [FRN.SWINGING_1]: {
          offset: { x: 8, y: -4 }
        },
        [FRN.SWINGING_2]: {
          offset: { x: 14, y: 27 },
          angle: 180
        },
        // [FRN.DOWN]: {
        //   offset: { x: -3, y: 22 }
        // },
      }}),
    },
    zIndex: ARTIST_Z_INDECES.MAIN
  },
};

export default cycleLayersWeapons;