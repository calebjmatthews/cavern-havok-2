import { CHARACTER_CLASSES, EQUIPMENTS } from "@common/enums";
import type BattleState from "./battleState";
import equipments from "@common/instances/equipments";

export default class Fighter implements FighterInterface {
  id: string = '';
  name: string = '';
  ownedBy: string = '';
  characterClass: CHARACTER_CLASSES = CHARACTER_CLASSES.MISSING;
  healthStat: number = 10;
  speedStat: number = 3;
  charmStat: number = 3;
  equipment: EQUIPMENTS[] = [];
  controlledBy: string = '';
  side: 'A'|'B' = 'A';
  coords: [number, number] = [0, 0];
  health: number = 10;
  healthMax: number = 10;
  speed: number = 3;
  charm: number = 3;
  charge: number = 0 ;

  constructor(fighter: FighterInterface) {
    Object.assign(this, fighter);
  };

  getEquipmentCanUse(args: { battleState: BattleState, userId: string }) {
    return this.equipment.filter((equipmentId) => {
      const equipment = equipments[equipmentId];
      if (!equipment) return false;
      return (
        (equipment.getCanUse === undefined || equipment.getCanUse(args))
        && equipment.getEffects !== undefined
      );
    });
  };
};

interface FighterInterface {
  id: string;
  name: string;
  ownedBy: string;
  characterClass: CHARACTER_CLASSES;
  healthStat: number;
  speedStat: number;
  charmStat: number;
  equipment: EQUIPMENTS[];
  controlledBy: string;
  side: 'A'|'B';
  coords: [number, number];
  health: number;
  healthMax: number;
  speed: number;
  charm: number;
  charge: number;
};