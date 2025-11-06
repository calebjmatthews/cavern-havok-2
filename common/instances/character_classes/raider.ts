import CharacterClass from "@common/models/characterClass";
import { AIS, CHARACTER_CLASSES, EQUIPMENTS } from "@common/enums";
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;

const raider = new CharacterClass({
  id: CHC.RAIDER,
  kind: 'character',
  description: 'Wields an ax, fearlessly and from the front lines',
  health: 9,
  speed: 3,
  charm: 1,
  equipmentStarting: [
    EQU.FLINT_HEMLET,
    EQU.FLINT_SHOULDERGUARDS,
    EQU.FLINT_BOOTS,
    EQU.HATCHET,
    EQU.SWEEP_AX,
    EQU.CLEAVING_AX
  ],
  aiId: AIS.DEFAULT
});

export default raider;