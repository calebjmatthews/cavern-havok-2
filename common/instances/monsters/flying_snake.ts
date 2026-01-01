import Character from "@common/models/characterClass";
import { AIS, CHARACTER_CLASSES, EQUIPMENTS, SPRITE_STATES } from "@common/enums";
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;
const SPS = SPRITE_STATES;

const flyingSnake = new Character({
  id: CHC.FLYING_SNAKE,
  kind: 'monster',
  description: `Low health, but venomous`,
  health: 2,
  speed: 5,
  charm: 2,
  equipmentStarting: [
    EQU.CURL_UP,
    EQU.GLIDING_SLITHER,
    EQU.HEADBONK,
    EQU.VENOMOUS_FANGS
  ],
  spriteSet: {
    [SPS.RESTING]: { src: "/public/sprites/flying_snake.png", width: 16, height: 16 },
    [SPS.DOWNED]: { src: "/public/sprites/flying_snake_downed.png", width: 16, height: 10 },
  },
  aiId: AIS.DEFAULT
});

export default flyingSnake;