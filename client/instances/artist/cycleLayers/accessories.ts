import type CycleLayer from "@client/models/artist/cycleLayer";
import { ARTIST_Z_INDECES, EQUIPMENTS, LAYERED_ANIMATED_STATES } from "@common/enums";
import { CYCLE_LAYER_SLOTS } from "@client/enums";

const LAS = LAYERED_ANIMATED_STATES;

const getScarfCycleLayer = (args: { id: string, color: string }): CycleLayer => {
  const { id, color } = args;

  const spriteNames = [
    `${color}_scarf0.png`, `${color}_scarf1.png`, `${color}_scarf2.png`, `${color}_scarf3.png`,
    `${color}_scarf4.png`, `${color}_scarf5.png`, `${color}_scarf6.png`, `${color}_scarf7.png`
  ];

  return {
    id,
    slot: CYCLE_LAYER_SLOTS.NECK,
    layers: {
      [LAS.RESTING]: {
        spriteNames,
        offsets: [
          { x: 4, y: 8 }, { x: 4, y: 7 }, { x: 4, y: 6 }, { x: 4, y: 5 },
          { x: 4, y: 7 }, { x: 4, y: 9 }, { x: 4, y: 9 }, { x: 4, y: 8 }
        ],
        loop: true
      },
      [LAS.WALKING]: {
        spriteNames,
        offsets: [
          { x: 4, y: 9 }, { x: 4, y: 7 }, { x: 4, y: 7 }, { x: 4, y: 5 },
          { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 8 }
        ],
        loop: true
      },
      [LAS.WALKING0]: {
        spriteNames: [`${color}_scarf0.png`],
        offsets: [{ x: 4, y: 9 }]
      },
      [LAS.WALKING1]: {
        spriteNames: [`${color}_scarf0.png`],
        offsets: [{ x: 4, y: 9 }]
      },
      [LAS.SWINGING]: {
        spriteNames: [
          `${color}_scarf0.png`, `${color}_scarf1.png`, `${color}_scarf2.png`, `${color}_scarf3.png`,
          `${color}_scarf4.png`, `${color}_scarf5.png`
        ],
        offsets: [
          { x: 4, y: 7 }, { x: 4, y: 6 }, { x: 4, y: 6 }, { x: 4, y: 5 },
          { x: 4, y: 7 }, { x: 4, y: 9 }
        ],
        durations: [10, 10, 10, 10, 10, 15]
      },
      [LAS.SWINGING0]: {
        spriteNames: [`${color}_scarf0.png`],
        offsets: [{ x: 4, y: 7 }]
      },
      [LAS.SWINGING1]: {
        spriteNames: [`${color}_scarf0.png`],
        offsets: [{ x: 4, y: 8 }]
      },
      [LAS.SWINGING2]: {
        spriteNames: [`${color}_scarf0.png`],
        offsets: [{ x: 4, y: 8 }]
      },
      [LAS.CASTING]: {
        spriteNames,
        offsets: [
          { x: 4, y: 8 }, { x: 4, y: 7 }, { x: 4, y: 6 }, { x: 4, y: 5 },
          { x: 4, y: 7 }, { x: 4, y: 9 }, { x: 4, y: 9 }, { x: 4, y: 8 }
        ],
        loop: true
      },
      [LAS.THROWING]: {
        spriteNames,
        offsets: [
          { x: 4, y: 8 }, { x: 4, y: 7 }, { x: 4, y: 5 }, { x: 4, y: 4 },
          { x: 4, y: 7 }, { x: 4, y: 9 }, { x: 4, y: 9 }, { x: 4, y: 8 }
        ],
        durations: [10, 5, 10, 10, 10, 10, 10, 10] 
        // durations: [10, 5, 20, 30] 
      },
      [LAS.CLENCHING]: {
        spriteNames,
        offsets: [
          { x: 4, y: 9 }, { x: 4, y: 8 }, { x: 4, y: 7 }, { x: 4, y: 6 },
          { x: 4, y: 8 }, { x: 4, y: 10 }, { x: 4, y: 10 }, { x: 4, y: 9 }
        ],
        loop: true
      },
      [LAS.DEFENDING]: {
        spriteNames,
        offsets: [
          { x: 4, y: 8 }, { x: 4, y: 7 }, { x: 4, y: 6 }, { x: 4, y: 5 },
          { x: 4, y: 7 }, { x: 4, y: 9 }, { x: 4, y: 9 }, { x: 4, y: 8 }
        ]
      },
      [LAS.CHEERING]: {
        spriteNames,
        offsets: [
          { x: 4, y: 8 }, { x: 4, y: 7 }, { x: 4, y: 6 }, { x: 4, y: 5 },
          { x: 4, y: 7 }, { x: 4, y: 9 }, { x: 4, y: 9 }, { x: 4, y: 8 }
        ]
      },
      [LAS.INVOKING]: {
        spriteNames,
        offsets: [
          { x: 4, y: 8 }, { x: 4, y: 7 }, { x: 4, y: 6 }, { x: 4, y: 5 },
          { x: 4, y: 7 }, { x: 4, y: 9 }, { x: 4, y: 9 }, { x: 4, y: 8 }
        ]
      },
      [LAS.DAMAGED]: {
        spriteNames: [
          `${color}_scarf0.png`, `${color}_scarf1.png`, `${color}_scarf2.png`, `${color}_scarf3.png`
        ],
        offsets: [{ x: 5, y: 8 }, { x: 5, y: 7 }, { x: 5, y: 6 }, { x: 5, y: 5 }],
        durations: [15, 15, 15, 30]
      },
      [LAS.CRITICAL]: {
        spriteNames,
        offsets: [
          { x: 4, y: 11 }, { x: 4, y: 10 }, { x: 4, y: 9 }, { x: 4, y: 8 },
          { x: 4, y: 10 }, { x: 4, y: 12 }, { x: 4, y: 12 }, { x: 4, y: 11 }
        ],
        loop: true
      },
      [LAS.DOWN]: {
        spriteNames: [`${color}_scarf_down.png`],
        offsets: [{ x: 5, y: 26 }],
        angles: [270]
      }
    },
    zIndex: ARTIST_Z_INDECES.NECK
  }
};

const cycleLayersAccessories: { [name: string] : CycleLayer } = {
  [EQUIPMENTS.BLUE_SCARF]: getScarfCycleLayer({ id: EQUIPMENTS.BLUE_SCARF, color: 'blue' }),
  [EQUIPMENTS.RED_SCARF]: getScarfCycleLayer({ id: EQUIPMENTS.RED_SCARF, color: 'red' }),
  [EQUIPMENTS.GREEN_SCARF]: getScarfCycleLayer({ id: EQUIPMENTS.RED_SCARF, color: 'green' })
};

export default cycleLayersAccessories;