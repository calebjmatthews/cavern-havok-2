import type CycleLayer from "@client/models/artist/cycleLayer";
import framesOneNameToCycles from "@client/functions/artist/framesOneNameToCycles";
import { ARTIST_Z_INDECES, EQUIPMENTS } from "@common/enums";
import { ANIMATION_TYPES, CYCLE_LAYER_SLOTS, FRAME_NAMES } from "@client/enums";

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
  [EQUIPMENTS.AJAX]: {
    id: EQUIPMENTS.REVEL,
    slot: CYCLE_LAYER_SLOTS.MAIN,
    layers: { ...framesOneNameToCycles({
      spriteName: 'ajax.png',
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
  [EQUIPMENTS.FEIST]: {
    id: EQUIPMENTS.FEIST,
    slot: CYCLE_LAYER_SLOTS.MAIN,
    layers: { ...framesOneNameToCycles({
      spriteName: 'feist.png',
      frames: {
        [FRN.DEFAULT]: { opacity: 0 },
        [FRN.ONE_LOWER]: { opacity: 0 },
        [FRN.CLENCHING]: { offset: { x: 6, y: -1 } },
        [FRN.SWINGING_0]: { offset: { x: 8, y: -8 } },
        [FRN.SWINGING_1]: { offset: { x: 6, y: -6 } },
        [FRN.SWINGING_2]: { offset: { x: 15, y: 29 }, angle: 180 }
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
  [EQUIPMENTS.HERON]: {
    id: EQUIPMENTS.HERON,
    slot: CYCLE_LAYER_SLOTS.MAIN,
    layers: { ...framesOneNameToCycles({
      spriteName: 'heron.png',
      frames: {
        [FRN.DEFAULT]: { opacity: 0 },
        [FRN.ONE_LOWER]: { opacity: 0 },
        [FRN.CLENCHING]: { offset: { x: -12, y: 19 }, angle: 270 },
        [FRN.WALKING_1]: { offset: { x: -8, y: 20 }, angle: 270 },
        [FRN.SWINGING_0]: { offset: { x: 5, y: -13 } },
        [FRN.SWINGING_1]: { offset: { x: 7, y: -11 } },
        [FRN.SWINGING_2]: { offset: { x: 0, y: 0 }, opacity: 0 }
      }, throwingOnly: true }),
    },
    zIndex: ARTIST_Z_INDECES.MAIN
  },
  [EQUIPMENTS.GENTLE_RAIN]: {
    id: EQUIPMENTS.GENTLE_RAIN,
    slot: CYCLE_LAYER_SLOTS.MAIN,
    layers: { ...framesOneNameToCycles({
      spriteName: 'gentle_rain.png',
      frames: {
        [FRN.DEFAULT]: { opacity: 0, offset: { x: -6, y: 6 } },
        [FRN.ONE_LOWER]: { opacity: 0, offset: { x: -6, y: 6 } },
        [FRN.CASTING]: { offset: { x: -6, y: 6 } },
      }}),
    },
    zIndex: ARTIST_Z_INDECES.MAIN,
    animationTypeIds: [ ANIMATION_TYPES.HOVER ]
  },
  [EQUIPMENTS.CURRENT_SPIRAL]: {
    id: EQUIPMENTS.CURRENT_SPIRAL,
    slot: CYCLE_LAYER_SLOTS.MAIN,
    layers: { ...framesOneNameToCycles({
      spriteName: 'gentle_rain.png',
      frames: {
        [FRN.DEFAULT]: { opacity: 0, offset: { x: -6, y: 6 } },
        [FRN.ONE_LOWER]: { opacity: 0, offset: { x: -6, y: 6 } },
        [FRN.CASTING]: { offset: { x: -6, y: 6 } },
      }}),
    },
    zIndex: ARTIST_Z_INDECES.MAIN,
    animationTypeIds: [ ANIMATION_TYPES.HOVER ]
  },
  [EQUIPMENTS.RUSHING_HELIX]: {
    id: EQUIPMENTS.RUSHING_HELIX,
    slot: CYCLE_LAYER_SLOTS.MAIN,
    layers: { ...framesOneNameToCycles({
      spriteName: 'gentle_rain.png',
      frames: {
        [FRN.DEFAULT]: { opacity: 0, offset: { x: -6, y: 6 } },
        [FRN.ONE_LOWER]: { opacity: 0, offset: { x: -6, y: 6 } },
        [FRN.CASTING]: { offset: { x: -6, y: 6 } },
      }}),
    },
    zIndex: ARTIST_Z_INDECES.MAIN,
    animationTypeIds: [ ANIMATION_TYPES.HOVER ]
  },
  [EQUIPMENTS.CONSECRATE]: {
    id: EQUIPMENTS.CONSECRATE,
    slot: CYCLE_LAYER_SLOTS.MAIN,
    layers: { ...framesOneNameToCycles({
      spriteName: 'gentle_rain.png',
      frames: {
        [FRN.DEFAULT]: { opacity: 0, offset: { x: -6, y: 6 } },
        [FRN.ONE_LOWER]: { opacity: 0, offset: { x: -6, y: 6 } },
        [FRN.CASTING]: { offset: { x: -6, y: 6 } },
      }}),
    },
    zIndex: ARTIST_Z_INDECES.MAIN,
    animationTypeIds: [ ANIMATION_TYPES.HOVER ]
  },
  [EQUIPMENTS.COLDBURST]: {
    id: EQUIPMENTS.COLDBURST,
    slot: CYCLE_LAYER_SLOTS.MAIN,
    layers: { ...framesOneNameToCycles({
      spriteName: 'coldburst.png',
      frames: {
        [FRN.DEFAULT]: { opacity: 0, offset: { x: -6, y: 6 } },
        [FRN.ONE_LOWER]: { opacity: 0, offset: { x: -6, y: 6 } },
        [FRN.CASTING]: { offset: { x: -6, y: 6 } },
      }}),
    },
    zIndex: ARTIST_Z_INDECES.MAIN,
    animationTypeIds: [ ANIMATION_TYPES.HOVER ]
  },
  [EQUIPMENTS.FROST_ARC]: {
    id: EQUIPMENTS.FROST_ARC,
    slot: CYCLE_LAYER_SLOTS.MAIN,
    layers: { ...framesOneNameToCycles({
      spriteName: 'coldburst.png',
      frames: {
        [FRN.DEFAULT]: { opacity: 0, offset: { x: -6, y: 6 } },
        [FRN.ONE_LOWER]: { opacity: 0, offset: { x: -6, y: 6 } },
        [FRN.CASTING]: { offset: { x: -6, y: 6 } },
      }}),
    },
    zIndex: ARTIST_Z_INDECES.MAIN,
    animationTypeIds: [ ANIMATION_TYPES.HOVER ]
  },
  [EQUIPMENTS.SNOWBEAM]: {
    id: EQUIPMENTS.SNOWBEAM,
    slot: CYCLE_LAYER_SLOTS.MAIN,
    layers: { ...framesOneNameToCycles({
      spriteName: 'coldburst.png',
      frames: {
        [FRN.DEFAULT]: { opacity: 0, offset: { x: -6, y: 6 } },
        [FRN.ONE_LOWER]: { opacity: 0, offset: { x: -6, y: 6 } },
        [FRN.CASTING]: { offset: { x: -6, y: 6 } },
      }}),
    },
    zIndex: ARTIST_Z_INDECES.MAIN,
    animationTypeIds: [ ANIMATION_TYPES.HOVER ]
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