import type EquipmentPiece from "@common/models/equipmentPiece";
import RichText from "@common/models/richText";
import equipments from "@common/instances/equipments";
import enchantments from '@common/instances/enchantments';

const getEquipmentName = (piece: EquipmentPiece): RichText | string => {
  const equipment = equipments[piece.equipmentId];
  if (!equipment) return piece.equipmentId;

  const equipmentName = equipment.name ?? equipment.id;
  if ((piece.enchantments ?? []).length === 0) return equipmentName;

  const namePieces = [
    ...(piece.enchantments ?? []).map((enchantmentId) => {
      const enchantment = enchantments[enchantmentId];
      return enchantment?.name ?? enchantmentId
    }),
    equipmentName
  ];

  return new RichText({
    tag: 'span',
    props: { style: { color: "var(--c-red)" } },
    contents: [namePieces.join(" ")]
  });
};

export default getEquipmentName;