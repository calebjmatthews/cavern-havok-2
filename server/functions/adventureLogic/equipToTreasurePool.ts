import type Fighter from "@common/models/fighter"
import type { TreasurePoolOption } from "@server/models/treasurePoolOption";
import equipments from "@common/instances/equipments";

const tk: { equipment: 'equipment' } = { equipment: 'equipment' };

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
    if (fighter.equipment.includes(equipId)) return false;
    return true;
  })
  .map((equipId) => {
    const equipment = equipments[equipId];
    if (!equipment) return null;
    return ({ kind: tk.equipment, id: equipId, quantity: 1, weight: 2000 });
  })
  .filter((tpo) => !!tpo);
};

export default equipToTreasurePool;