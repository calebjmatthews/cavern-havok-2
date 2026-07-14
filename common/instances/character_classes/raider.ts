import CharacterClass from "@common/models/characterClass";
import { AIS, CHARACTER_CLASSES, EQUIPMENTS, SPRITE_STATES } from "@common/enums";
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;
const SPS = SPRITE_STATES;

const raider = new CharacterClass({
  id: CHC.RAIDER,
  kind: 'character',
  description: 'Wields an ax, fearlessly and from the front lines.',
  health: 11,
  speed: 3,
  charm: 1,
  equipmentStarting: [
    EQU.BODY_REGULAR_SHALE,
    EQU.FACE_REGULAR_TOPAZ,
    EQU.SHARD_HELMET,
    EQU.ROOKIE_SHOULDERGUARDS,
    EQU.WALKING_BOOTS,
    EQU.HATCHET,
    EQU.CRESCENT,
    EQU.NOTHING
  ],
  spriteSet: {
    [SPS.RESTING]: { src: "/public/sprites/raider.png", width: 11, height: 25 },
    [SPS.DOWNED]: { src: "/public/sprites/raider_downed.png", width: 25, height: 11 }
  },
  aiId: AIS.DEFAULT
});

export default raider;