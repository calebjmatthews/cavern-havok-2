import type CycleLayer from "@client/models/artist/cycleLayer";
import { ARTIST_Z_INDECES, CHARACTER_CLASSES, EQUIPMENTS, LAYERED_ANIMATED_STATES } from "@common/enums";
import { CYCLE_LAYER_SLOTS } from "@client/enums";

const LAS = LAYERED_ANIMATED_STATES;

const cycleLayersMonsters: { [name: string] : CycleLayer } = {
  [EQUIPMENTS.BOULDER_MOLE]: {
    id: EQUIPMENTS.BOULDER_MOLE,
    slot: CYCLE_LAYER_SLOTS.BODY,
    layers: {
      [LAS.RESTING]: {
        spriteNames: [CHARACTER_CLASSES.BOULDER_MOLE],
        loop: true
      },
      [LAS.DOWN]: {
        spriteNames: [`${CHARACTER_CLASSES.BOULDER_MOLE} Downed`]
      }
    },
    zIndex: ARTIST_Z_INDECES.BODY,
    isPrimary: true,
    heightExplicit: 14
  },
  [EQUIPMENTS.BUBBLE]: {
    id: EQUIPMENTS.BUBBLE,
    slot: CYCLE_LAYER_SLOTS.BODY,
    layers: {
      [LAS.RESTING]: {
        spriteNames: [CHARACTER_CLASSES.BUBBLE],
        loop: true
      },
      [LAS.DOWN]: {
        spriteNames: [`${CHARACTER_CLASSES.BUBBLE} Downed`]
      }
    },
    zIndex: ARTIST_Z_INDECES.BODY,
    isPrimary: true,
    heightExplicit: 23
  },
  [EQUIPMENTS.FLYING_SNAKE]: {
    id: EQUIPMENTS.FLYING_SNAKE,
    slot: CYCLE_LAYER_SLOTS.BODY,
    layers: {
      [LAS.RESTING]: {
        spriteNames: [CHARACTER_CLASSES.FLYING_SNAKE],
        loop: true
      },
      [LAS.DOWN]: {
        spriteNames: [`${CHARACTER_CLASSES.FLYING_SNAKE} Downed`]
      }
    },
    zIndex: ARTIST_Z_INDECES.BODY,
    isPrimary: true,
    heightExplicit: 16
  },
  [EQUIPMENTS.FLYING_SNAKE_BALL]: {
    id: EQUIPMENTS.FLYING_SNAKE_BALL,
    slot: CYCLE_LAYER_SLOTS.BODY,
    layers: {
      [LAS.RESTING]: {
        spriteNames: [CHARACTER_CLASSES.FLYING_SNAKE_BALL],
        loop: true
      },
      [LAS.DOWN]: {
        spriteNames: [`${CHARACTER_CLASSES.FLYING_SNAKE_BALL} Downed`]
      }
    },
    zIndex: ARTIST_Z_INDECES.BODY,
    isPrimary: true,
    heightExplicit: 26
  }
};

export default cycleLayersMonsters;