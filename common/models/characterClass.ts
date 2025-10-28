import type BattleState from "./battleState";
import type Command from "./command";
import Fighter from "./fighter";
import { CHARACTER_CLASSES, type EQUIPMENTS } from "@common/enums";

export default class CharacterClass implements CharacterClassInterface {
  id: CHARACTER_CLASSES = CHARACTER_CLASSES.MISSING;
  health: number = 10;
  speed: number = 3;
  charm: number = 3;
  equipmentCanUse: EQUIPMENTS[] = [];
  equipmentStarting: EQUIPMENTS[] = [];
  ai: (args: { battleState: BattleState, userId: string }) => Command|null = () => ({
    id: '',
    fromId: '',
    equipmentId: ''
  });

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
  equipmentCanUse: EQUIPMENTS[];
  equipmentStarting: EQUIPMENTS[];
  ai: (args: { battleState: BattleState, userId: string }) => Command|null;
};