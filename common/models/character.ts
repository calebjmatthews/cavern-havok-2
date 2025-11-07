import Fighter from "./fighter";
import { CHARACTER_CLASSES, type EQUIPMENTS } from "@common/enums";

export default class Character implements CharacterInterface {
  id: string = '';
  ownedBy: string = '';
  classCurrent: CHARACTER_CLASSES = CHARACTER_CLASSES.MISSING;
  classesUnlocked: CHARACTER_CLASSES[] = [];
  health: number = 10;
  speed: number = 3;
  charm: number = 3;
  inventory: EQUIPMENTS[] = [];
  equipped: EQUIPMENTS[] = [];

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
      equipment: [...this.equipped],
      controlledBy,
      side,
      coords,
      health,
      healthMax: health,
      speed,
      charm,
      charge: 0,
      defense: 0,
      isStunned: false
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
  inventory: EQUIPMENTS[];
  equipped: EQUIPMENTS[];
};