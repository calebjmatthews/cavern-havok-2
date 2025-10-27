import Character from "@common/models/characterClass";
import bubbleAi from "@common/functions/ai/bubble_ai";
import { CHARACTER_CLASSES, EQUIPMENTS } from "@common/enums";
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;

const bubble = new Character({
  id: CHC.BUBBLE,
  health: 4,
  speed: 2,
  charm: 5,
  equipmentCanUse: [
    EQU.WOBBLY_MEMBRANE,
    EQU.DRIFTING_ON_THE_BREEZE,
    EQU.FOAMY_DASH,
    EQU.GOODBYE
  ],
  equipmentStarting: [
    EQU.WOBBLY_MEMBRANE,
    EQU.DRIFTING_ON_THE_BREEZE,
    EQU.FOAMY_DASH,
    EQU.GOODBYE
  ],
  ai: bubbleAi
});

export default bubble;