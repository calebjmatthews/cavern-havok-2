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
        [FRN.DEFAULT]: {
          opacity: 0
        },
        [FRN.ONE_LOWER]: {
          opacity: 0
        },
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
        }
      }}),
    },
    zIndex: ARTIST_Z_INDECES.MAIN
  },
  [EQUIPMENTS.SWALLOW]: {
    id: EQUIPMENTS.SWALLOW,
    slot: CYCLE_LAYER_SLOTS.MAIN,
    layers: { ...framesOneNameToCycles({
      spriteName: 'swallow.png',
      frames: {
        [FRN.DEFAULT]: {
          opacity: 0
        },
        [FRN.ONE_LOWER]: {
          opacity: 0
        },
        [FRN.CLENCHING]: {
          offset: { x: -10, y: 17 },
          angle: 270
        },
        [FRN.WALKING_1]: {
          offset: { x: -8, y: 19 },
          angle: 270
        },
        [FRN.SWINGING_0]: {
          offset: { x: 5, y: -10}
        },
        [FRN.SWINGING_1]: {
          offset: { x: 7, y: -8 }
        },
        [FRN.SWINGING_2]: {
          offset: { x: 0, y: 0 },
          opacity: 0
        }
      }, throwingOnly: true }),
    },
    zIndex: ARTIST_Z_INDECES.MAIN
  },
};

export default cycleLayersWeapons;