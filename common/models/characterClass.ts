import Fighter from "./fighter";
import { AIS, CHARACTER_CLASSES, type EQUIPMENTS } from "@common/enums";

export default class CharacterClass implements CharacterClassInterface {
  id: CHARACTER_CLASSES = CHARACTER_CLASSES.MISSING;
  health: number = 10;
  speed: number = 3;
  charm: number = 3;
  equipmentStarting: EQUIPMENTS[] = [];
  aiId: AIS = AIS.DEFAULT;

  constructor(character: CharacterClassInterface) {
    Object.assign(this, character);
  };

  toFighter(args: {
    id: string,
    name: string,
    ownedBy: string,
    controlledBy: string,
    side: 'A'|'B',
    coords: [number, number],
  }) {
    const { id, name, ownedBy, controlledBy, side, coords } = args;
    const { health, speed, charm } = this;
    return new Fighter({
      id,
      name,
      ownedBy,
      characterClass: this.id,
      healthStat: health,
      speedStat: speed,
      charmStat: charm,
      equipment: [...this.equipmentStarting],
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

interface CharacterClassInterface {
  id: CHARACTER_CLASSES;
  health: number;
  speed: number;
  charm: number;
  equipmentStarting: EQUIPMENTS[];
  aiId: AIS;
};