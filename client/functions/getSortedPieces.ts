import type EquipmentPiece from "@common/models/equipmentPiece";
import equipments from "@common/instances/equipments";
import { EQUIPMENT_SLOTS } from "@common/enums";

const EQS = EQUIPMENT_SLOTS;

const slotMap: { [slot: string] : number } = {
  [EQS.HEAD]:   40,
  [EQS.TOP]:    30,
  [EQS.MAIN]:   20,
  [EQS.BOTTOM]: 10
};

const getSortedPieces = (pieces: EquipmentPiece[]) => (
  [...pieces].map((piece) => ({
    ...piece,
    enchantments: piece.enchantments ? [...piece.enchantments] : undefined
  }))
  .sort((a, b) => {
    const equipmentA = equipments[a.equipmentId];
    const equipmentB = equipments[b.equipmentId];
    if (!equipmentA || !equipmentB) return 0;
    
    if (equipmentA.slot === EQS.MAIN && equipmentB.slot === EQS.MAIN) {
      return (a.slotNumber ?? 0) - (b.slotNumber ?? 0);
    };

    return (slotMap[equipmentB.slot] ?? 0) - (slotMap[equipmentA.slot] ?? 0);
  })
);

export default getSortedPieces;