import CharacterClass from "@common/models/characterClass";
import { AIS, CHARACTER_CLASSES, EQUIPMENTS } from "@common/enums";
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;

const javalin = new CharacterClass({
  id: CHC.JAVALIN,
  kind: 'character',
  description: 'Throws spears, tactically and from a distance',
  health: 14,
  speed: 4,
  charm: 2,
  equipmentStarting: [
    EQU.FEATHER_CAP,
    EQU.DOWN_VEST,
    EQU.TUFTED_SANDALS,
    EQU.SWALLOW,
    EQU.BLACKBIRD,
    EQU.HERON
  ],
  aiId: AIS.DEFAULT
});

export default javalin;