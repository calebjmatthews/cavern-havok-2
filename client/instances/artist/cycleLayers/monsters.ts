import type CycleLayer from "@client/models/artist/cycleLayer";
import { ARTIST_Z_INDECES, CHARACTER_CLASSES, EQUIPMENTS, LAYERED_ANIMATED_STATES } from "@common/enums";

const LAS = LAYERED_ANIMATED_STATES;

// [CHARACTER_CLASSES.BOULDER_MOLE]: 'boulder_mole.png',
// [CHARACTER_CLASSES.BUBBLE]: 'bubble.png',
// [CHARACTER_CLASSES.FLYING_SNAKE]: 'flying_snake.png',
// [CHARACTER_CLASSES.FLYING_SNAKE_BALL]: 'flying_snake_ball.png',

const cycleLayersMonsters: { [name: string] : CycleLayer } = {
  [EQUIPMENTS.BOULDER_MOLE]: {
    layers: {
      [LAS.RESTING]: {
        spriteNames: [CHARACTER_CLASSES.BOULDER_MOLE],
        loop: true
      }
    },
    zIndex: ARTIST_Z_INDECES.BODY
  },
  [EQUIPMENTS.BUBBLE]: {
    layers: {
      [LAS.RESTING]: {
        spriteNames: [CHARACTER_CLASSES.BUBBLE],
        loop: true
      }
    },
    zIndex: ARTIST_Z_INDECES.BODY
  },
  [EQUIPMENTS.FLYING_SNAKE]: {
    layers: {
      [LAS.RESTING]: {
        spriteNames: [CHARACTER_CLASSES.FLYING_SNAKE],
        loop: true
      }
    },
    zIndex: ARTIST_Z_INDECES.BODY
  },
  [EQUIPMENTS.FLYING_SNAKE_BALL]: {
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