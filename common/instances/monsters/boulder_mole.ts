import Character from "@common/models/characterClass";
import { AIS, CHARACTER_CLASSES, EQUIPMENTS, SPRITE_STATES } from "@common/enums";
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;
const SPS = SPRITE_STATES;

const boulderMole = new Character({
  id: CHC.BOULDER_MOLE,
  kind: 'monster',
  description: 'Powerful defense, but less aggressive',
  health: 10,
  speed: 1,
  charm: 2,
  equipmentStarting: [
    EQU.ROCKY_HIDE,
    EQU.SCRABBLING_LEGS,
    EQU.RUBBLE_TOSS,
    EQU.STONY_DEFENSE,
    EQU.BOULDER_DROP
  ],
  spriteSet: {
    [SPS.RESTING]: { src: "/public/sprites/boulder_mole.png", width: 18, height: 14 },
    [SPS.DOWNED]: { src: "/public/sprites/boulder_mole_downed.png", width: 18, height: 14 }
  },
  aiId: AIS.DEFAULT
});

export default boulderMole;