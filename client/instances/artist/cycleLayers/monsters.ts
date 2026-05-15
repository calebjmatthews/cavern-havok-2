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
      }
    },
    zIndex: ARTIST_Z_INDECES.BODY
  },
  [EQUIPMENTS.BUBBLE]: {
    id: EQUIPMENTS.BUBBLE,
    slot: CYCLE_LAYER_SLOTS.BODY,
    layers: {
      [LAS.RESTING]: {
        spriteNames: [CHARACTER_CLASSES.BUBBLE],
        loop: true
      }
    },
    zIndex: ARTIST_Z_INDECES.BODY
  },
  [EQUIPMENTS.FLYING_SNAKE]: {
    id: EQUIPMENTS.FLYING_SNAKE,
    slot: CYCLE_LAYER_SLOTS.BODY,
    layers: {
      [LAS.RESTING]: {
        spriteNames: [CHARACTER_CLASSES.FLYING_SNAKE],
        loop: true
      }
    },
    zIndex: ARTIST_Z_INDECES.BODY
  },
  [EQUIPMENTS.FLYING_SNAKE_BALL]: {
    id: EQUIPMENTS.FLYING_SNAKE_BALL,
    slot: CYCLE_LAYER_SLOTS.BODY,
    layers: {
      [LAS.RESTING]: {
        spriteNames: [CHARACTER_CLASSES.FLYING_SNAKE_BALL],
        loop: true
      }
    },
    zIndex: ARTIST_Z_INDECES.BODY
  }
};

export default cycleLayersMonsters;