import type EquipmentPiece from './equipmentPiece';
import type RichText from './richText';
import Character from './character';
import Fighter from './fighter';
import createEquipmentPiece from '@server/functions/utils/createEquipmentPiece';
import equipments from '@common/instances/equipments';
import { AIS, CHARACTER_CLASSES, EQUIPMENT_SLOTS, type EQUIPMENTS } from "@common/enums";
import { genId } from '@common/functions/utils/random';

export default class CharacterClass implements CharacterClassInterface {
  id: CHARACTER_CLASSES = CHARACTER_CLASSES.MISSING;
  name?: string;
  kind: 'character'|'monster' = 'character';
  description: RichText | string = '';
  health: number = 10;
  speed: number = 3;
  charm: number = 3;
  equipmentStarting: EQUIPMENTS[] = [];
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

    let slotNumber = 0;
    inventory.forEach((piece) => {
      const equipment = equipments[piece.equipmentId];
      if (equipment?.slot === EQUIPMENT_SLOTS.MAIN) {
        piece.slotNumber = slotNumber;
        slotNumber++;
      };
    });

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

    let slotNumber = 0;
    inventory.forEach((piece) => {
      const equipment = equipments[piece.equipmentId];
      if (equipment?.slot === EQUIPMENT_SLOTS.MAIN) {
        piece.slotNumber = slotNumber;
        slotNumber++;
      };
    });

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
      mainSlots: 4,
      artifactSlots: 3,
      chestChoices: 3,
      treasureChoices: 3,
      rarityMult: 1,
      defense: 0,
      defenseFire: 0,
      defenseWater: 0,
      defenseBio: 0,
      isStunned: false,
      cinders: 0
    });
  };
};

interface CharacterClassInterface {
  id: CHARACTER_CLASSES;
  name?: string;
  kind: 'character'|'monster';
  description: RichText | string;
  health: number;
  speed: number;
  charm: number;
  equipmentStarting: EQUIPMENTS[];
  aiId: AIS;
};