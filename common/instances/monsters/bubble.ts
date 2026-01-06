import Character from "@common/models/characterClass";
import { AIS, CHARACTER_CLASSES, EQUIPMENTS, SPRITE_STATES } from "@common/enums";
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;
const SPS = SPRITE_STATES;

const bubble = new Character({
  id: CHC.BUBBLE,
  kind: 'monster',
  description: `Mostly weak, but don't underestimate it's sacrificial attack`,
  health: 6,
  speed: 2,
  charm: 5,
  equipmentStarting: [
    EQU.WOBBLY_MEMBRANE,
    EQU.DRIFTING_ON_THE_BREEZE,
    EQU.FOAMY_DASH,
    EQU.GOODBYE
  ],
  spriteSet: {
    [SPS.RESTING]: { src: "/public/sprites/bubble.png", width: 17, height: 23 },
    [SPS.DOWNED]: { src: "/public/sprites/bubble_downed.png", width: 17, height: 22 }
  },
  aiId: AIS.BUBBLE
});

export default bubble;