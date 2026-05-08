import type CycleLayer from "@client/models/artist/cycleLayer";
import { ARTIST_Z_INDECES, EQUIPMENTS, LAYERED_ANIMATED_STATES } from "@common/enums";
import { SPRITE_NAMES } from "@client/enums";
import range from "@common/functions/utils/range";

const LAS = LAYERED_ANIMATED_STATES;
const SPN = SPRITE_NAMES;

const cycleLayersFaces: { [name: string] : CycleLayer } = {
  [EQUIPMENTS.FACE_REGULAR_TOPAZ]: {
    layers: {
      [LAS.RESTING]: [{
        spriteNames: [SPN.FACE_RESTING, SPN.FACE_CLOSED],
        offsets: [{ x: 4, y: 5 }, { x: 4, y: 7 }],
        durations: [200, 6]
      }, {
        spriteNames: [SPN.FACE_RESTING, SPN.FACE_CLOSED],
        offsets: [{ x: 4, y: 5 }, { x: 4, y: 7 }],
        durations: [300, 10]
      }, {
        spriteNames: [SPN.FACE_RESTING, SPN.FACE_CLOSED, SPN.FACE_RESTING, SPN.FACE_CLOSED],
        offsets: [{ x: 4, y: 5 }, { x: 4, y: 7 }, { x: 4, y: 5 }, { x: 4, y: 7 }],
        durations: [120, 4, 20, 6]
      }, {
        spriteNames: [SPN.FACE_RESTING, SPN.FACE_CLOSED],
        offsets: [{ x: 4, y: 5 }, { x: 4, y: 7 }],
        durations: [240, 8]
      }], 
      [LAS.WALKING]: {
        spriteNames: [SPN.FACE_RESTING, SPN.FACE_RESTING],
        offsets: [{ x: 4, y: 6 }, { x: 4, y: 5 }]
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
      },
      [LAS.THROWING]: {
        spriteNames: [SPN.FACE_RESTING, SPN.FACE_RESTING, SPN.FACE_RESTING, SPN.FACE_RESTING],
        offsets: [{ x: 4, y: 6 }, { x: 4, y: 6 }, { x: 4, y: 5 }, { x: 4, y: 6 }],
        durations: [15, 10, 30, 20]
      },
      [LAS.CLENCHING]: [{
        spriteNames: [SPN.FACE_RESTING, SPN.FACE_CLOSED],
        offsets: [{ x: 4, y: 6 }, { x: 4, y: 7 }],
        durations: [200, 6]
      }, {
        spriteNames: [SPN.FACE_RESTING, SPN.FACE_CLOSED],
        offsets: [{ x: 4, y: 6 }, { x: 4, y: 8 }],
        durations: [300, 10]
      }, {
        spriteNames: [SPN.FACE_RESTING, SPN.FACE_CLOSED, SPN.FACE_RESTING, SPN.FACE_CLOSED],
        offsets: [{ x: 4, y: 6 }, { x: 4, y: 8 }, { x: 4, y: 6 }, { x: 4, y: 8 }],
        durations: [120, 4, 20, 6]
      }, {
        spriteNames: [SPN.FACE_RESTING, SPN.FACE_CLOSED],
        offsets: [{ x: 4, y: 6 }, { x: 4, y: 8 }],
        durations: [240, 8]
      }],
      [LAS.CHEERING]: {
        spriteNames: [SPN.FACE_RESTING],
        offsets: [{ x: 4, y: 5 }]
      },
      [LAS.DAMAGED]: {
        spriteNames: [SPN.FACE_DAMAGED],
        offsets: [{ x: 3, y: 7 }]
      },
      [LAS.CRITICAL]: {
        spriteNames: [SPN.FACE_CRITICAL],
        offsets: [{ x: 4, y: 9 }]
      },
      [LAS.DOWN]: {
        spriteNames: [SPN.FACE_DOWN],
        offsets: [{ x: 2, y: 17 }]
      }
    },
    zIndex: ARTIST_Z_INDECES.FACE,
    tint: '#f8d858'
  }
};

export default cycleLayersFaces;