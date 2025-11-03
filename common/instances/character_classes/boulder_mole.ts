import Character from "@common/models/characterClass";
import defaultAi from "@common/functions/ai/default_ai";
import { CHARACTER_CLASSES, EQUIPMENTS } from "@common/enums";
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;

const boulderMole = new Character({
  id: CHC.BOULDER_MOLE,
  health: 8,
  speed: 1,
  charm: 2,
  equipmentCanUse: [
    EQU.ROCKY_HIDE,
    EQU.SCRABBLING_LEGS,
    EQU.RUBBLE_TOSS,
    EQU.STONY_DEFENSE,
    EQU.BOULDER_DROP
  ],
  equipmentStarting: [
    EQU.ROCKY_HIDE,
    EQU.SCRABBLING_LEGS,
    EQU.RUBBLE_TOSS,
    EQU.STONY_DEFENSE,
    EQU.BOULDER_DROP
  ],
  ai: defaultAi
});

export default boulderMole;