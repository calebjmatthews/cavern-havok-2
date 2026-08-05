import type BattleState from "@common/models/battleState";
import type DescriptionPart from "@common/models/descriptionPart";
import type EquipmentPiece from "@common/models/equipmentPiece";
import RichText, { type RichTextInterface } from "@common/models/richText";
import applyLevelOrEnchantment from "./applyLevelOrEnchantment";
import describeOnePart from "./describeOnePart";
import combineDescriptionParts from "./combineDescriptionParts";

const describeWithCircumstances = (args: {
  parts: (string | RichText | RichTextInterface | DescriptionPart)[];
  battleState?: BattleState;
  userId?: string;
  piece: EquipmentPiece;
}): RichText => {
  const { parts: partsArgs, piece } = args;
  let parts = partsArgs.map((p) => {
    if (typeof p === 'string') return p;
    return { ...p };
  });

  const levelAndEnchantments: string[] = [
    ...((piece.level ?? 0) > 0 ? ['level'] : []),
    ...(piece.enchantments  ?? [])
  ];
  levelAndEnchantments.forEach((levelOrEnchantment) => {
    parts = applyLevelOrEnchantment({ partsArgs, levelOrEnchantment, ...args });
  });

  const contents = combineDescriptionParts(parts).map((part) => {
    if (typeof part === 'string') return part;
    if ('kind' in part || 'subSections' in part) return describeOnePart({ part, ...args });
    return part;
  }).filter((p) => p !== null);

  return new RichText({
    tag: 'section',
    props: { className: 'section-with-separator' },
    contents
  });
};

export default describeWithCircumstances;