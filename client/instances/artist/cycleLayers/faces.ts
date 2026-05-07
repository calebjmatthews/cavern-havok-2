import type CycleLayer from "@client/models/artist/cycleLayer";
import { ARTIST_Z_INDECES, EQUIPMENTS, LAYERED_ANIMATED_STATES } from "@common/enums";
import { SPRITE_NAMES } from "@client/enums";

const LAS = LAYERED_ANIMATED_STATES;
const SPN = SPRITE_NAMES;

const cycleLayersFaces: { [id: string] : CycleLayer } = {
  [EQUIPMENTS.FACE_REGULAR_TOPAZ]: {
    layers: {
      [LAS.RESTING]: {
        spriteNames: [SPN.FACE_RESTING], offsets: [{ x: 4, y: 5 }]
      }, 
      [LAS.WALKING]: {
        spriteNames: [SPN.FACE_RESTING, SPN.FACE_RESTING],
        offsets: [{ x: 4, y: 5 }, { x: 4, y: 6 }],
        loop: true
      },
      [LAS.WALKING0]: {
        spriteNames: [SPN.FACE_RESTING],
        offsets: [{ x: 4, y: 6 }]
      },
      [LAS.WALKING1]: {
        spriteNames: [SPN.FACE_RESTING],
        offsets: [{ x: 4, y: 6 }]
      },
      [LAS.SWINGING]: {
        spriteNames: [SPN.FACE_RESTING, SPN.FACE_RESTING, SPN.FACE_RESTING],
        offsets: [{ x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 6 }]
      },
      [LAS.SWINGING0]: {
        spriteNames: [SPN.FACE_RESTING],
        offsets: [{ x: 4, y: 5 }]
      },
      [LAS.SWINGING1]: {
        spriteNames: [SPN.FACE_RESTING],
        offsets: [{ x: 4, y: 6 }]
      },
      [LAS.SWINGING2]: {
        spriteNames: [SPN.FACE_RESTING],
        offsets: [{ x: 4, y: 6 }]
      },
      [LAS.CASTING]: {
        spriteNames: [SPN.FACE_CASTING_0, SPN.FACE_CASTING_1],
        offsets: [{ x: 4, y: 6 }, { x: 4, y: 6 }],
        loop: true
      }
    },
    zIndex: ARTIST_Z_INDECES.FACE,
    tint: '#f8d858'
  }
};

export default cycleLayersFaces;