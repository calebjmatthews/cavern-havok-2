import type EquipmentPiece from "@common/models/equipmentPiece";
import type RichText from "@common/models/richText";
import equipments from "@common/instances/equipments";

const getEquipmentName = (piece: EquipmentPiece): RichText | string => {
  const equipment = equipments[piece.equipmentId];
  if (!equipment) return piece.equipmentId;

  const nameFull = [
    ...(piece.enchantments ?? []),
    equipment.name ?? equipment.id
  ].join(" ");

  if ((piece.enchantments ?? []).length === 0) return nameFull;

  return {
    tag: 'span',
    props: { style: { color: "var(--c-red)" } },
    contents: [nameFull]
  };
};

export default getEquipmentName;