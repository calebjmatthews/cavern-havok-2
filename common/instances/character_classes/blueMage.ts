import CharacterClass from "@common/models/characterClass";
import { AIS, CHARACTER_CLASSES, EQUIPMENTS } from "@common/enums";
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;

const blueMage = new CharacterClass({
  id: CHC.BLUE_MAGE,
  kind: 'character',
  description: 'Supports allies with water healing and deals icy damage with charge.',
  health: 9,
  speed: 1,
  charm: 4,
  equipmentStarting: [
    EQU.BODY_REGULAR_SHALE,
    EQU.FACE_REGULAR_TOPAZ,
    EQU.RAINFALL_HOOD,
    EQU.DROPLET_ROBE,
    EQU.WALKING_SHOES,
    EQU.COLDBURST,
    EQU.GENTLE_RAIN,
    EQU.NOTHING
  ],
  aiId: AIS.DEFAULT
});

export default blueMage;