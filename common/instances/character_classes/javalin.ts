import CharacterClass from "@common/models/characterClass";
import { AIS, CHARACTER_CLASSES, EQUIPMENTS, SPRITE_STATES } from "@common/enums";
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;
const SPS = SPRITE_STATES;

const javalin = new CharacterClass({
  id: CHC.JAVALIN,
  kind: 'character',
  description: ['Throws spears, tactically and from a distance.'],
  health: 14,
  speed: 4,
  charm: 2,
  equipmentStarting: [
    EQU.FEATHER_CAP,
    EQU.DOWN_VEST,
    EQU.TUFTED_SANDALS,
    EQU.SWALLOW,
    EQU.BLACKBIRD
  ],
  spriteSet: {
    [SPS.RESTING]: { src: "/public/sprites/javalin.png", width: 13, height: 28 },
    [SPS.DOWNED]: { src: "/public/sprites/javalin_downed.png", width: 28, height: 13 }
  },
  aiId: AIS.DEFAULT
});

export default javalin;