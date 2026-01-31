import { v4 as uuid } from 'uuid';

import type EquipmentPiece from "@common/models/equipmentPiece";

const createEquipmentPiece = (args: {
  equipmentId: string,
  belongsTo: string,
  isEphemeral?: boolean
}): EquipmentPiece => {
  const { equipmentId, belongsTo, isEphemeral } = args;

  return {
    id: uuid(),
    equipmentId,
    belongsTo,
    acquiredAt: Date.now(),
    isEphemeral,
  };
};

export default createEquipmentPiece;