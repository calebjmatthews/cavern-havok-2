import type CycleLayer from "@client/models/artist/cycleLayer";
import { ARTIST_Z_INDECES, EQUIPMENTS, LAYERED_ANIMATED_STATES } from "@common/enums";
import { CYCLE_LAYER_SLOTS, SPRITE_NAMES } from "@client/enums";

const LAS = LAYERED_ANIMATED_STATES;
const SPN = SPRITE_NAMES;

const cycleLayersBodies: { [name: string] : CycleLayer } = {
  [EQUIPMENTS.BODY_REGULAR_SHALE]: {
    id: EQUIPMENTS.BODY_REGULAR_SHALE,
    slot: CYCLE_LAYER_SLOTS.BODY,
    layers: {
      [LAS.RESTING]: {
        spriteNames: [SPN.SBR_RESTING],
        loop: true
      },
      [LAS.WALKING]: {
        spriteNames: [SPN.SBR_WALKING_0, SPN.SBR_RESTING, SPN.SBR_WALKING_1, SPN.SBR_RESTING],
        offsets: [{ x: -2, y: 0 }, { x: 0, y: 0 }, { x: -2, y: 0 }, { x: 0, y: 0 }],
        loop: true
      },
      [LAS.WALKING0]: {
        spriteNames: [SPN.SBR_WALKING_0],
        offsets: [{ x: -2, y: 0 }]
      },
      [LAS.WALKING1]: {
        spriteNames: [SPN.SBR_WALKING_1],
        offsets: [{ x: -2, y: 0 }]
      },
      [LAS.SWINGING]: {
        spriteNames: [SPN.SBR_SWINGING_0, SPN.SBR_SWINGING_1, SPN.SBR_SWINGING_2],
        offsets: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 2 }],
        durations: [20, 10, 35]
      },
      [LAS.SWINGING0]: {
        spriteNames: [SPN.SBR_SWINGING_0],
        offsets: [{ x: 1, y: 1 }]
      },
      [LAS.SWINGING1]: {
        spriteNames: [SPN.SBR_SWINGING_1],
        offsets: [{ x: 1, y: 2 }]
      },
      [LAS.SWINGING2]: {
        spriteNames: [SPN.SBR_SWINGING_2],
        offsets: [{ x: 1, y: 2 }]
      },
      [LAS.CASTING]: {
        spriteNames: [SPN.SBR_CASTING],
        offsets: [{ x: 1, y: 1 }],
        loop: true
      },
      [LAS.THROWING]: {
        spriteNames: [SPN.SBR_WALKING_1, SPN.SBR_SWINGING_1, SPN.SBR_SWINGING_0, SPN.SBR_SWINGING_2],
        offsets: [{ x: -2, y: 0 }, { x: 1, y: 2 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
        durations: [10, 5, 20, 30] 
      },
      [LAS.CLENCHING]: {
        spriteNames: [SPN.SBR_CLENCHING],
        offsets: [{ x: 0, y: 2 }]
      },
      [LAS.DEFENDING]: {
        spriteNames: [SPN.SBR_SWINGING_2, SPN.SBR_CLENCHING],
        offsets: [{ x: 1, y: 2 }, { x: 0, y: 2 }],
        durations: [40, 15]
      },
      [LAS.CHEERING]: {
        spriteNames: [SPN.SBR_CHEERING, SPN.SBR_CHEERING],
        offsets: [{ x: 0, y: 1 }, { x: 0, y: 0 }],
        durations: [100, 1]
      },
      [LAS.INVOKING]: {
        spriteNames: [SPN.SBR_CASTING, SPN.SBR_SWINGING_2],
        offsets: [{ x: 1, y: 1 }, { x: 1, y: 2 }],
        durations: [10, 40]
      },
      [LAS.DAMAGED]: {
        spriteNames: [SPN.SBR_DAMAGED, SPN.SBR_RESTING],
        offsets: [{ x: 0, y: 2 }, { x: 0, y: 0 }],
        durations: [50, 1]
      },
      [LAS.CRITICAL]: {
        spriteNames: [SPN.SBR_CRITICAL],
        offsets: [{ x: -1, y: 4 }]
      },
      [LAS.DOWN]: {
        spriteNames: [SPN.SBR_SWINGING_0],
        offsets: [{ x: -3, y: 23 }],
        angles: [270]
      }
    },
    zIndex: ARTIST_Z_INDECES.BODY,
    isPrimary: true,
    tint: '#7d3a09',
    heightExplicit: 22
  }
};

export default cycleLayersBodies;