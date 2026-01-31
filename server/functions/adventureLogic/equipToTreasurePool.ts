import type Fighter from "@common/models/fighter"
import type { TreasurePoolOption } from "@server/models/treasurePoolOption";
import equipments from "@common/instances/equipments";

const kindEquip: 'equipment' = 'equipment';

const equipToTreasurePool = (args: {
  equipIds: string[],
  fighter: Fighter
}) : TreasurePoolOption[] => {
  const { equipIds, fighter } = args;

  return equipIds
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
    return ({ kind: kindEquip, id: equipId, quantity: 1, weight: 100 });
  })
  .filter((tpo) => !!tpo);
};

export default equipToTreasurePool;