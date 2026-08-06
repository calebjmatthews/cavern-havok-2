import type BattleState from "./battleState";
import type EquipmentPiece from "./equipmentPiece";
import equipments from "@common/instances/equipments";
import { CHARACTER_CLASSES } from "@common/enums";

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
  defenseWater: number = 0;
  defenseFire: number = 0;
  defenseBio: number = 0;
  // dauntless: number; // Like Defense, but doesn't expire at the end of a round
  isStunned: boolean = false;
  cinders: number = 0;

  constructor(fighter?: FighterInterface) {
    if (fighter) Object.assign(this, fighter);
  };

  // Returns an array of equipment pieces for equips that can be used, both based on
  // getCanUse() results (such as needing charge) and whether the equip isn't passive
  getEquipmentCanUse(args: { battleState: BattleState, userId: string }) {
    return this.equipped.filter((piece) => {
      const equipment = equipments[piece.equipmentId];
      if (!equipment) return false;
      return (
        (equipment.getCanUse === undefined || equipment.getCanUse(args))
        && equipment.getActions !== undefined
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
  defenseWater: number;
  defenseFire: number;
  defenseBio: number;
  // dauntless: number; // Like Defense, but doesn't expire at the end of a round
  isStunned: boolean;
  cinders: number;
};