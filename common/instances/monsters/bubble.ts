import Character from "@common/models/characterClass";
import { AIS, CHARACTER_CLASSES, EQUIPMENTS } from "@common/enums";
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;

const bubble = new Character({
  id: CHC.BUBBLE,
  kind: 'monster',
  description: `Mostly weak, but don't underestimate it's sacrificial attack`,
  health: 5,
  speed: 2,
  charm: 5,
  equipmentStarting: [
    EQU.WOBBLY_MEMBRANE,
    EQU.DRIFTING_ON_THE_BREEZE,
    EQU.FOAMY_DASH,
    EQU.GOODBYE
  ],
  aiId: AIS.BUBBLE
});

export default bubble;