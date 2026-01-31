import { CHARACTER_CLASSES } from "@common/enums";
import type BattleState from "./battleState";
import equipments from "@common/instances/equipments";
import type EquipmentPiece from "./equipmentPiece";

export default class Fighter implements FighterInterface {
  id: string = '';
  occupantKind: "fighter" = "fighter";
  name: string = '';
  ownedBy: string = '';
  characterClass: CHARACTER_CLASSES = CHARACTER_CLASSES.MISSING;
  healthStat: number = 10;
  speedStat: number = 3;
  charmStat: number = 3;
  inventory: EquipmentPiece[] = [];
  equipped: EquipmentPiece[] = [];
  controlledBy: string = '';
  side: 'A'|'B' = 'A';
  coords: [number, number] = [0, 0];
  health: number = 10;
  healthMax: number = 10;
  speed: number = 3;
  charm: number = 3;
  charge: number = 0;
  defense: number = 0;
  isStunned: boolean = false;
  cinders: number = 0;

  constructor(fighter?: FighterInterface) {
    if (fighter) Object.assign(this, fighter);
  };

  // Returns an array of equipment pieces for equips that can be used, both based on
  // getCanUse() results (such as needing charge) and whether the equip isn't passive
  getEquipmentCanUse(args: { battleState: BattleState, userId: string }) {
    return this.equipped.filter((equipmentPiece) => {
      const equipment = equipments[equipmentPiece.equipmentId];
      if (!equipment) return false;
      return (
        (equipment.getCanUse === undefined || equipment.getCanUse(args))
        && equipment.getSubCommands !== undefined
      );
    });
  };
};

interface FighterInterface {
  id: string;
  occupantKind?: "fighter";
  name: string;
  ownedBy: string;
  characterClass: CHARACTER_CLASSES;
  healthStat: number;
  speedStat: number;
  charmStat: number;
  inventory: EquipmentPiece[];
  equipped: EquipmentPiece[];
  controlledBy: string;
  side: 'A'|'B';
  coords: [number, number];
  health: number;
  healthMax: number;
  speed: number;
  charm: number;
  charge: number;
  defense: number;
  isStunned: boolean;
  cinders: number;
};