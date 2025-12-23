import { v4 as uuid } from 'uuid';

import Character from './character';
import Fighter from './fighter';
import type { SpriteSet } from './spriteSet';
import { AIS, CHARACTER_CLASSES, type EQUIPMENTS } from "@common/enums";

export default class CharacterClass implements CharacterClassInterface {
  id: CHARACTER_CLASSES = CHARACTER_CLASSES.MISSING;
  kind: 'character'|'monster' = 'character';
  description: string = '';
  health: number = 10;
  speed: number = 3;
  charm: number = 3;
  equipmentStarting: EQUIPMENTS[] = [];
  spriteSet: SpriteSet = {};
  aiId: AIS = AIS.DEFAULT;

  constructor(character: CharacterClassInterface) {
    Object.assign(this, character);
  };

  toCharacter(ownedBy: string) {
    const { id, health, speed, charm } = this;

    return new Character({
      id: uuid(),
      ownedBy,
      classCurrent: id,
      classesUnlocked: [id],
      health,
      speed,
      charm,
      inventory: [...this.equipmentStarting],
      equipped: [...this.equipmentStarting]
    });
  };

  toFighter(args: {
    id?: string,
    name?: string,
    ownedBy: string,
    controlledBy: string,
    side: 'A'|'B',
    coords: [number, number],
  }) {
    const { id, name, ownedBy, controlledBy, side, coords } = args;
    const { health, speed, charm } = this;
    return new Fighter({
      id: id ?? uuid(),
      name: name ?? this.id,
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
      isStunned: false,
      cinders: 0
    });
  };
};

interface CharacterClassInterface {
  id: CHARACTER_CLASSES;
  kind: 'character'|'monster';
  description: string;
  health: number;
  speed: number;
  charm: number;
  equipmentStarting: EQUIPMENTS[];
  spriteSet: SpriteSet;
  aiId: AIS;
};