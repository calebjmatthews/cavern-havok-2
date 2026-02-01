import type EquipmentPiece from "@common/models/equipmentPiece";
import { genId } from "@common/functions/utils/random";

const createEquipmentPiece = (args: {
  equipmentId: string,
  belongsTo: string,
  isEphemeral?: boolean
}): EquipmentPiece => {
  const { equipmentId, belongsTo, isEphemeral } = args;

  return {
    id: genId(),
    equipmentId,
    belongsTo,
    acquiredAt: Date.now(),
    isEphemeral,
  };
};

export default createEquipmentPiece;