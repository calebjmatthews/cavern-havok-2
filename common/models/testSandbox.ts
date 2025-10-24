import { v4 as uuid } from 'uuid';

import Fighter from "./fighter";
import { CHARACTER_CLASSES, EQUIPMENTS } from '@common/enums';
const CHC = CHARACTER_CLASSES;
const EQU = EQUIPMENTS;

const testSandbox = () => {
  const raider: Fighter = {
    id: uuid(),
    name: "Raids",
    ownedBy: "Carb",
    class: CHC.RAIDER,
    healthStat: 9,
    speedStat: 3,
    charmStat: 1,
    equipment: [
      EQU.HORNED_HELMET,
      EQU.HIDE_VEST,
      EQU.HOB_NAILED_BOOTS,
      EQU.HATCHET,
      EQU.SWEEP_AX,
      EQU.CLEAVING_AX
    ],
    controlledBy: "Carb",
    side: 'A',
    coords: [4, 2],
    health: 9,
    speed: 3,
    charm: 1,
    charge: 0
  };
};