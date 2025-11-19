import Character from "@common/models/characterClass";
import { AIS, CHARACTER_CLASSES, EQUIPMENTS } from "@common/enums";
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;

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
  aiId: AIS.DEFAULT
});

export default flyingSnake;