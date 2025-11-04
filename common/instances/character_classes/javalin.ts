import Character from "@common/models/characterClass";
import { AIS, CHARACTER_CLASSES, EQUIPMENTS } from "@common/enums";
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;

const javalin = new Character({
  id: CHC.RAIDER,
  health: 10,
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