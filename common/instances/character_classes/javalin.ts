import CharacterClass from "@common/models/characterClass";
import { AIS, CHARACTER_CLASSES, EQUIPMENTS, SPRITE_STATES } from "@common/enums";
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;
const SPS = SPRITE_STATES;

const javalin = new CharacterClass({
  id: CHC.JAVALIN,
  kind: 'character',
  description: 'Throws spears, tactically and from a distance.',
  health: 14,
  speed: 5,
  charm: 2,
  equipmentStarting: [
    EQU.BODY_REGULAR_SHALE,
    EQU.FACE_REGULAR_TOPAZ,
    EQU.ROGASA,
    EQU.GREENHORN_PONCHO,
    EQU.WALKING_BOOTS,
    EQU.SWALLOW,
    EQU.BLACKBIRD,
    EQU.NOTHING
  ],
  spriteSet: {
    [SPS.RESTING]: { src: "/public/sprites/javalin.png", width: 13, height: 28 },
    [SPS.DOWNED]: { src: "/public/sprites/javalin_downed.png", width: 28, height: 13 }
  },
  aiId: AIS.DEFAULT
});

export default javalin;