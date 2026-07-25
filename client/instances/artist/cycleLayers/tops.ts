import type CycleLayer from "@client/models/artist/cycleLayer";
import framesToCycles from "@client/functions/artist/framesToCycles";
import { ARTIST_Z_INDECES, EQUIPMENTS, LAYERED_ANIMATED_STATES } from "@common/enums";
import { CYCLE_LAYER_SLOTS, FRAME_NAMES } from "@client/enums";

const LAS = LAYERED_ANIMATED_STATES;
const FRN = FRAME_NAMES;

const cycleLayersTops: { [name: string] : CycleLayer } = {
  [EQUIPMENTS.BELTED_OVERALLS]: {
    id: EQUIPMENTS.BELTED_OVERALLS,
    slot: CYCLE_LAYER_SLOTS.TOP,
    layers: { ...framesToCycles({
      name: 'belted_overalls',
      frames: {
        [FRN.RESTING]:    { offset: { x: 3, y: 11 } },
        [FRN.WALKING_0]:  { offset: { x: 1, y: 12 } },
        [FRN.WALKING_1]:  { offset: { x: 2, y: 12 } },
        [FRN.SWINGING_0]: { offset: { x: 2, y: 8 } },
        [FRN.SWINGING_1]: { offset: { x: 2, y: 10 } },
        [FRN.SWINGING_2]: { offset: { x: 2, y: 11 } },
        [FRN.CASTING]:    { offset: { x: 3, y: 11 } },
        [FRN.CLENCHING]:  { offset: { x: 2, y: 12 } },
        [FRN.CHEERING]:   { offset: { x: 1, y: 8 } },
        [FRN.DAMAGED]:    { offset: { x: 3, y: 11 } },
        [FRN.CRITICAL]:   { offset: { x: 2, y: 13 } },
      }}),
      [LAS.DOWN]: {
        spriteNames: [`belted_overalls_swinging0.png`],
        offsets: [{ x: 4, y: 22 }],
        angles: [270]
      }
    },
    zIndex: ARTIST_Z_INDECES.TOP
  },
  [EQUIPMENTS.ROOKIE_SHOULDERGUARDS]: {
    id: EQUIPMENTS.ROOKIE_SHOULDERGUARDS,
    slot: CYCLE_LAYER_SLOTS.TOP,
    layers: { ...framesToCycles({
      name: 'rock_shoulderguards',
      frames: {
        [FRN.RESTING]:    { offset: { x: 2, y: 10 } },
        [FRN.WALKING_0]:  { offset: { x: 1, y: 10 } },
        [FRN.WALKING_1]:  { offset: { x: 3, y: 11 } },
        [FRN.SWINGING_0]: { offset: { x: 2, y: 9 } },
        [FRN.SWINGING_1]: { offset: { x: 2, y: 11 } },
        [FRN.SWINGING_2]: { offset: { x: 3, y: 11 } },
        [FRN.CASTING]:    { offset: { x: 2, y: 10 } },
        [FRN.CLENCHING]:  { offset: { x: 2, y: 10 } },
        [FRN.CHEERING]:   { offset: { x: 2, y: 10 } },
        [FRN.DAMAGED]:    { offset: { x: 3, y: 11 } },
        [FRN.CRITICAL]:   { offset: { x: 2, y: 13 } },
      }}),
      [LAS.DOWN]: {
        spriteNames: [`rock_shoulderguards_swinging0.png`],
        offsets: [{ x: 5, y: 22 }],
        angles: [270]
      }
    },
    zIndex: ARTIST_Z_INDECES.TOP
  },
  [EQUIPMENTS.COZY_ROBE]: {
    id: EQUIPMENTS.COZY_ROBE,
    slot: CYCLE_LAYER_SLOTS.TOP,
    layers: { ...framesToCycles({
      name: 'cozy_robe',
      frames: {
        [FRN.RESTING]:    { offset: { x: 2, y: 11 } },
        [FRN.WALKING_0]:  { offset: { x: -1, y: 12 } },
        [FRN.WALKING_1]:  { offset: { x: 1, y: 12 } },
        [FRN.SWINGING_0]: { offset: { x: 2, y: 9 } },
        [FRN.SWINGING_1]: { offset: { x: 2, y: 10 } },
        [FRN.SWINGING_2]: { offset: { x: 2, y: 11 } },
        [FRN.CASTING]:    { offset: { x: 2, y: 11 } },
        [FRN.CLENCHING]:  { offset: { x: 2, y: 12 } },
        [FRN.CHEERING]:   { offset: { x: 2, y: 9 } },
        [FRN.DAMAGED]:    { offset: { x: 3, y: 12 } },
        [FRN.CRITICAL]:   { offset: { x: 2, y: 13 } },
      }}),
      [LAS.DOWN]: {
        spriteNames: [`cozy_robe_swinging0.png`],
        offsets: [{ x: 5, y: 22 }],
        angles: [270]
      }
    },
    zIndex: ARTIST_Z_INDECES.TOP
  },
  [EQUIPMENTS.GREENHORN_PONCHO]: {
    id: EQUIPMENTS.GREENHORN_PONCHO,
    slot: CYCLE_LAYER_SLOTS.TOP,
    layers: { ...framesToCycles({
      name: 'poncho',
      frames: {
        [FRN.RESTING]:    { offset: { x: 3, y: 10 } },
        [FRN.WALKING_0]:  { offset: { x: 1, y: 11 } },
        [FRN.WALKING_1]:  { offset: { x: 2, y: 12 } },
        [FRN.SWINGING_0]: { offset: { x: 3, y: 8 } },
        [FRN.SWINGING_1]: { offset: { x: 3, y: 9 } },
        [FRN.SWINGING_2]: { offset: { x: 3, y: 10 } },
        [FRN.CASTING]:    { offset: { x: 3, y: 10 } },
        [FRN.CLENCHING]:  { offset: { x: 2, y: 11 } },
        [FRN.CHEERING]:   { offset: { x: 3, y: 7 } },
        [FRN.DAMAGED]:    { offset: { x: 3, y: 10 } },
        [FRN.CRITICAL]:   { offset: { x: 2, y: 12 } },
      }}),
      [LAS.DOWN]: {
        spriteNames: [`poncho_swinging0.png`],
        offsets: [{ x: 4, y: 21 }],
        angles: [270]
      }
    },
    zIndex: ARTIST_Z_INDECES.TOP
  },
  [EQUIPMENTS.RUFFLED_SHIRT]: {
    id: EQUIPMENTS.RUFFLED_SHIRT,
    slot: CYCLE_LAYER_SLOTS.TOP,
    layers: { ...framesToCycles({
      name: 'ruffled_shirt',
      frames: {
        [FRN.RESTING]:    { offset: { x: 2, y: 10 } },
        [FRN.WALKING_0]:  { offset: { x: 0, y: 11 } },
        [FRN.WALKING_1]:  { offset: { x: 2, y: 11 } },
        [FRN.SWINGING_0]: { offset: { x: 2, y: 6 } },
        [FRN.SWINGING_1]: { offset: { x: 2, y: 7 } },
        [FRN.SWINGING_2]: { offset: { x: 2, y: 11 } },
        [FRN.CASTING]:    { offset: { x: 2, y: 10 } },
        [FRN.CLENCHING]:  { offset: { x: 0, y: 12 } },
        [FRN.CHEERING]:   { offset: { x: -1, y: 6 } },
        [FRN.DAMAGED]:    { offset: { x: 3, y: 10 } },
        [FRN.CRITICAL]:   { offset: { x: 1, y: 12 } },
      }}),
      [LAS.DOWN]: {
        spriteNames: [`ruffled_shirt_swinging0.png`],
        offsets: [{ x: 2, y: 21 }],
        angles: [270]
      }
    },
    zIndex: ARTIST_Z_INDECES.TOP
  }
};

export default cycleLayersTops;