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
        [FRN.DEFAULT]: { opacity: 0 },
        [FRN.ONE_LOWER]: { opacity: 0 },
        [FRN.CLENCHING]: { offset: { x: 8, y: 1 } },
        [FRN.SWINGING_0]: { offset: { x: 10, y: -6 } },
        [FRN.SWINGING_1]: { offset: { x: 8, y: -4 } },
        [FRN.SWINGING_2]: { offset: { x: 14, y: 27 }, angle: 180 }
      }}),
    },
    zIndex: ARTIST_Z_INDECES.MAIN
  },
  [EQUIPMENTS.REVEL]: {
    id: EQUIPMENTS.REVEL,
    slot: CYCLE_LAYER_SLOTS.MAIN,
    layers: { ...framesOneNameToCycles({
      spriteName: 'claymore.png',
      frames: {
        [FRN.DEFAULT]: { opacity: 0 },
        [FRN.ONE_LOWER]: { opacity: 0 },
        [FRN.CLENCHING]: { offset: { x: 7, y: 1 } },
        [FRN.SWINGING_0]: { offset: { x: 9, y: -6 } },
        [FRN.SWINGING_1]: { offset: { x: 7, y: -4 } },
        [FRN.SWINGING_2]: { offset: { x: 15, y: 27 }, angle: 180 }
      }}),
    },
    zIndex: ARTIST_Z_INDECES.MAIN
  },
  [EQUIPMENTS.CRESCENT]: {
    id: EQUIPMENTS.REVEL,
    slot: CYCLE_LAYER_SLOTS.MAIN,
    layers: { ...framesOneNameToCycles({
      spriteName: 'crescent.png',
      frames: {
        [FRN.DEFAULT]: { opacity: 0 },
        [FRN.ONE_LOWER]: { opacity: 0 },
        [FRN.CLENCHING]: { offset: { x: 6, y: -2 } },
        [FRN.SWINGING_0]: { offset: { x: 8, y: -9 } },
        [FRN.SWINGING_1]: { offset: { x: 6, y: -7 } },
        [FRN.SWINGING_2]: { offset: { x: 15, y: 30 }, angle: 180 }
      }}),
    },
    zIndex: ARTIST_Z_INDECES.MAIN
  },
  [EQUIPMENTS.SPARROW]: {
    id: EQUIPMENTS.SPARROW,
    slot: CYCLE_LAYER_SLOTS.MAIN,
    layers: { ...framesOneNameToCycles({
      spriteName: 'sparrow.png',
      frames: {
        [FRN.DEFAULT]: { opacity: 0 },
        [FRN.ONE_LOWER]: { opacity: 0 },
        [FRN.CLENCHING]: { offset: { x: -10, y: 17 }, angle: 270 },
        [FRN.WALKING_1]: { offset: { x: -8, y: 19 }, angle: 270 },
        [FRN.SWINGING_0]: { offset: { x: 5, y: -10} },
        [FRN.SWINGING_1]: { offset: { x: 7, y: -8 } },
        [FRN.SWINGING_2]: { offset: { x: 0, y: 0 }, opacity: 0 }
      }, throwingOnly: true }),
    },
    zIndex: ARTIST_Z_INDECES.MAIN
  },
  [EQUIPMENTS.STARLING]: {
    id: EQUIPMENTS.STARLING,
    slot: CYCLE_LAYER_SLOTS.MAIN,
    layers: { ...framesOneNameToCycles({
      spriteName: 'starling.png',
      frames: {
        [FRN.DEFAULT]: { opacity: 0 },
        [FRN.ONE_LOWER]: { opacity: 0 },
        [FRN.CLENCHING]: { offset: { x: -10, y: 18 }, angle: 270 },
        [FRN.WALKING_1]: { offset: { x: -8, y: 19 }, angle: 270 },
        [FRN.SWINGING_0]: { offset: { x: 5, y: -10} },
        [FRN.SWINGING_1]: { offset: { x: 7, y: -8 } },
        [FRN.SWINGING_2]: { offset: { x: 0, y: 0 }, opacity: 0 }
      }, throwingOnly: true }),
    },
    zIndex: ARTIST_Z_INDECES.MAIN
  },
  [EQUIPMENTS.NOTHING]: {
    id: EQUIPMENTS.NOTHING,
    slot: CYCLE_LAYER_SLOTS.MAIN,
    layers: { ...framesOneNameToCycles({
      spriteName: 'nothing.png',
      frames: {
        [FRN.DEFAULT]: { opacity: 0 },
        [FRN.ONE_LOWER]: { opacity: 0 },
        [FRN.CLENCHING]: { opacity: 0 },
        [FRN.WALKING_1]: { opacity: 0 },
        [FRN.SWINGING_0]: { opacity: 0 },
        [FRN.SWINGING_1]: { opacity: 0 },
        [FRN.SWINGING_2]: { opacity: 0 }
      }}),
    },
    zIndex: ARTIST_Z_INDECES.MAIN
  },
};

export default cycleLayersWeapons;