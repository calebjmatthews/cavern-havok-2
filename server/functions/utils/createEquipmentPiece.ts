import type EquipmentPiece from "@common/models/equipmentPiece";
import { genId } from "@common/functions/utils/random";

const createEquipmentPiece = (args: {
  equipmentId: string,
  belongsTo: string,
  enchantmentIds?: string[],
  isEphemeral?: boolean
}): EquipmentPiece => {
  const { equipmentId, belongsTo, enchantmentIds, isEphemeral } = args;

  return {
    id: genId(),
    equipmentId,
    belongsTo,
    acquiredAt: Date.now(),
    enchantments: enchantmentIds,
    isEphemeral,
  };
};

export default createEquipmentPiece;