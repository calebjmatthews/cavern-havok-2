import Character from "@common/models/characterClass";
import { AIS, CHARACTER_CLASSES, EQUIPMENTS } from "@common/enums";
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;

const flyingSnakeBall = new Character({
  id: CHC.FLYING_SNAKE_BALL,
  kind: 'monster',
  description: `It's made of twisting snakes, and most of them aren't trying to get out. Don't look to closely.`,
  health: 16,
  speed: 2,
  charm: 1,
  equipmentStarting: [
    EQU.TIGHTEN_UP,
    EQU.SQUIRMING_HEADS,
    EQU.WIGGLE_OUT
  ],
  aiId: AIS.DEFAULT
});

export default flyingSnakeBall;