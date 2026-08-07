import type EquipmentPiece from "./equipmentPiece";
import Fighter from "./fighter";
import equipments from "@common/instances/equipments";
import applyStatChange from "@common/functions/applyStatChange";
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

    let fighter = new Fighter({
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
      mainSlots: 4,
      artifactSlots: 3,
      chestChoices: 3,
      treasureChoices: 3,
      rarityMult: 1,
      defense: 0,
      defenseWater: 0,
      defenseFire: 0,
      defenseBio: 0,
      isStunned: false,
      cinders: 0
    });

    (fighter.equipped ?? []).forEach((piece) => {
      const equipment = equipments[piece.equipmentId];

      (equipment?.statChanges ?? []).forEach((statChange) => {
        if (!fighter || statChange.getExtentDuring !== 'equip') return;
        fighter = applyStatChange({ fighter, statChange, piece });
        piece.artifactLastApplied = { chamber: -1, round: -1 };
      });
    });

    return fighter;
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