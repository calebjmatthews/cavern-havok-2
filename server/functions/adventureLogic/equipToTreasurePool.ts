import type Fighter from "@common/models/fighter"
import type { TreasurePoolOption } from "@server/models/treasurePoolOption";
import equipments from "@common/instances/equipments";
import enchantmentsForEquipment from "../utils/enchantmentsForEquipment";
import randomFromWeighted from "@common/functions/utils/randomFromWeighted";
import createEquipmentPiece from "../utils/createEquipmentPiece";
import enchantments from '@common/instances/enchantments';

const kindEquip: 'equipment' = 'equipment';

const equipToTreasurePool = (args: {
  equipIds: string[],
  fighter: Fighter,
  enchantmentPercentage: number
}) : TreasurePoolOption[] => {
  const { equipIds, fighter, enchantmentPercentage } = args;

  const unenchanted = equipIds
  .filter((equipId) => {
    const equipment = equipments[equipId];
    if (!equipment) return false;
    if (!equipment.equippedBy.includes(fighter.characterClass)) return false;
    if (fighter.equipped.find((piece) => piece.equipmentId === equipId)) return false;
    return true;
  })
  .map((equipId) => {
    const equipment = equipments[equipId];
    if (!equipment) return null;
    return ({
      kind: kindEquip,
      piece: createEquipmentPiece({
        equipmentId: equipId,
        belongsTo: fighter.ownedBy,
        isEphemeral: true
      }),
      quantity: 1,
      weight: 100
    });
  })
  .filter((tpo) => !!tpo);

  const enchanted = equipIds
  .filter((equipId) => {
    const equipment = equipments[equipId];
    if (!equipment) return false;
    if (!equipment.equippedBy.includes(fighter.characterClass)) return false;
    return true;
  })
  .map((equipId) => {
    const equipment = equipments[equipId];
    if (!equipment) return null;
    const enchantmentsAllowed = enchantmentsForEquipment(equipId)
    const randomIndex = randomFromWeighted(enchantmentsAllowed);
    let enchantmentIds: string[] | undefined;
    const enchantmentSelected = randomIndex ? enchantmentsAllowed[randomIndex] : undefined;
    if (enchantmentSelected) enchantmentIds = [enchantmentSelected.id];

    return ({
      kind: kindEquip,
      piece: createEquipmentPiece({
        equipmentId: equipId,
        belongsTo: fighter.ownedBy,
        enchantmentIds,
        isEphemeral: true
      }),
      quantity: 1,
      weight: enchantmentPercentage
    });
  })
  .filter((tpo) => !!tpo)
  .filter((tpo) => (tpo.piece?.enchantments ?? []).length > 0);

  return [ ...unenchanted, ...enchanted ];
};

export default equipToTreasurePool;