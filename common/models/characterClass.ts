import type EquipmentPiece from './equipmentPiece';
import type { SpriteSet } from './spriteSet';
import Character from './character';
import Fighter from './fighter';
import createEquipmentPiece from '@server/functions/utils/createEquipmentPiece';
import { AIS, CHARACTER_CLASSES, type EQUIPMENTS } from "@common/enums";
import { genId } from '@common/functions/utils/random';
import type RichText from './richText';

export default class CharacterClass implements CharacterClassInterface {
  id: CHARACTER_CLASSES = CHARACTER_CLASSES.MISSING;
  kind: 'character'|'monster' = 'character';
  description: (RichText | string)[] = [''];
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

    const characterId = genId();
    const inventory: EquipmentPiece[] = this.equipmentStarting.map((equipmentId) => (
      createEquipmentPiece({
        equipmentId,
        belongsTo: characterId
      })
    ));

    return new Character({
      id: characterId,
      ownedBy,
      classCurrent: id,
      classesUnlocked: [id],
      health,
      speed,
      charm,
      inventory,
      equipped: inventory.map((piece) => ({ ...piece }))
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

    const characterId = genId();
    const inventory: EquipmentPiece[] = this.equipmentStarting.map((equipmentId) => (
      createEquipmentPiece({
        equipmentId,
        belongsTo: characterId
      })
    ));

    return new Fighter({
      id: id ?? genId(),
      name: name ?? this.id,
      ownedBy,
      characterClass: this.id,
      healthStat: health,
      speedStat: speed,
      charmStat: charm,
      inventory,
      equipped: inventory.map((piece) => ({ ...piece })),
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
  description: (RichText | string)[];
  health: number;
  speed: number;
  charm: number;
  equipmentStarting: EQUIPMENTS[];
  spriteSet: SpriteSet;
  aiId: AIS;
};