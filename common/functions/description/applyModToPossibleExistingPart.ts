import type DescriptionPart from "@common/models/descriptionPart";
import type { DescriptionPartChangedBy } from "@common/models/descriptionPart";
import type { EnchantmentMod } from "@common/models/enchantment";
import RichText, { type RichTextInterface } from "@common/models/richText";
import applyMod from "../utils/applyMod";
import findPartOfKind from "./findPartOfKind";

const applyModToPossibleExistingPart = (args: {
  parts: (string | RichText | RichTextInterface | DescriptionPart)[];
  mod: EnchantmentMod,
  partKind: string,
  changedBy: DescriptionPartChangedBy
}) => {
  const { parts: partsArgs, mod, partKind, changedBy } = args;
  let parts = partsArgs.map((p) => {
    if (typeof p === 'string') return p;
    return { ...p };
  });

  const partMatching = findPartOfKind(parts, partKind);
  if (partMatching?.extent) {
    const originalExtent = partMatching.extent;
    partMatching.extent = applyMod(originalExtent, mod);
    if (!partMatching.changedBy) partMatching.changedBy = [];
    partMatching.changedBy.push({
      ...changedBy,
      amount: originalExtent,
      alterationId: mod.alterationId
    });
  };

  return parts;
};

export default applyModToPossibleExistingPart;