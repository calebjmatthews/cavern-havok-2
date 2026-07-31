import CharacterClass from "@common/models/characterClass";
import { AIS, CHARACTER_CLASSES, EQUIPMENTS } from "@common/enums";
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;

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
    EQU.WALKING_SHOES,
    EQU.HATCHET,
    EQU.CRESCENT,
    EQU.NOTHING
  ],
  aiId: AIS.DEFAULT
});

export default raider;