import type EquipmentPiece from "./equipmentPiece";
import Fighter from "./fighter";
import { CHARACTER_CLASSES } from "@common/enums";

export default class Character implements CharacterInterface {
  id: string = '';
  ownedBy: string = '';
  classCurrent: CHARACTER_CLASSES = CHARACTER_CLASSES.MISSING;
  classesUnlocked: CHARACTER_CLASSES[] = [];
  health: number = 10;
  speed: number = 3;
  charm: number = 3;
  inventory: EquipmentPiece[] = [];
  equipped: EquipmentPiece[] = [];

  constructor(character: CharacterInterface) {
    Object.assign(this, character);
  };

  toFighter(args: {
    name: string,
    ownedBy: string,
    controlledBy: string,
    side: 'A'|'B',
    coords: [number, number],
  }) {
    const { name, ownedBy, controlledBy, side, coords } = args;
    const { health, speed, charm } = this;
    return new Fighter({
      id: this.id,
      name,
      ownedBy,
      characterClass: this.classCurrent,
      healthStat: health,
      speedStat: speed,
      charmStat: charm,
      equipped: [...this.equipped],
      inventory: [],
      controlledBy,
      side,
      coords,
      health,
      healthMax: health,
      speed,
      charm,
      charge: 0,
      defense: 0,
      isStunned: false,
      cinders: 0
    });
  };
};

interface CharacterInterface {
  id: string;
  ownedBy: string;
  classCurrent: CHARACTER_CLASSES;
  classesUnlocked: CHARACTER_CLASSES[];
  health: number;
  speed: number;
  charm: number;
  inventory: EquipmentPiece[];
  equipped: EquipmentPiece[];
};