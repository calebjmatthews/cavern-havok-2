import Character from "@common/models/characterClass";
import defaultAi from "@common/functions/ai/default_ai";
import { CHARACTER_CLASSES, EQUIPMENTS } from "@common/enums";
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;

const raider = new Character({
  id: CHC.RAIDER,
  health: 9,
  speed: 3,
  charm: 1,
  equipmentCanUse: [
    EQU.FLINT_HEMLET,
    EQU.FLINT_SHOULDERGUARDS,
    EQU.FLINT_BOOTS,
    EQU.HATCHET,
    EQU.SWEEP_AX,
    EQU.CLEAVING_AX
  ],
  equipmentStarting: [
    EQU.FLINT_HEMLET,
    EQU.FLINT_SHOULDERGUARDS,
    EQU.FLINT_BOOTS,
    EQU.HATCHET,
    EQU.SWEEP_AX,
    EQU.CLEAVING_AX
  ],
  ai: defaultAi
});

export default raider;