import Character from "@common/models/characterClass";
import { AIS, CHARACTER_CLASSES, EQUIPMENTS } from "@common/enums";
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;

const boulderMole = new Character({
  id: CHC.BOULDER_MOLE,
  kind: 'monster',
  description: 'Powerful defense, but less aggressive',
  health: 8,
  speed: 1,
  charm: 2,
  equipmentStarting: [
    EQU.ROCKY_HIDE,
    EQU.SCRABBLING_LEGS,
    EQU.RUBBLE_TOSS,
    EQU.STONY_DEFENSE,
    EQU.BOULDER_DROP
  ],
  aiId: AIS.DEFAULT
});

export default boulderMole;