import type RichText from "@common/models/richText";
import type DescriptionPart from "@common/models/descriptionPart";
import type { RichTextInterface } from "@common/models/richText";
import type { DescriptionSection } from "@common/models/descriptionPart";

const combineDescriptionParts = (
  descriptionParts: (string | RichText | RichTextInterface | DescriptionPart)[]
) => {
  const firstPart = descriptionParts[0];
  const followingParts = descriptionParts.slice(1);
  if (!firstPart || typeof firstPart === 'string' || followingParts.length < 1) return descriptionParts;
  if (!('kind' in firstPart)) return descriptionParts;
  
  const matchingParts: DescriptionPart[] = [];
  followingParts.forEach((part) => {
    if (!part || typeof part === 'string') return;
    if (!('kind' in part)) return;

    if (
      part.appliesTo === firstPart.appliesTo
      && part.range?.[0] === firstPart.range?.[0]
      && part.range?.[1] === firstPart.range?.[1]
    ) {
      matchingParts.push(part);
    };
  });
  if (matchingParts.length === 0) return descriptionParts;

  const unmatchingParts = followingParts.filter((part) => {
    if (!part || typeof part === 'string') return true;
    if (!('kind' in part)) return true;

    return (
      part.appliesTo !== firstPart.appliesTo
      || part.range?.[0] !== firstPart.range?.[0]
      || part.range?.[1] !== firstPart.range?.[1]
    );
  });

  const combinedParts: DescriptionSection = {
    subSections: [firstPart, ...matchingParts].map((part) => ({
      extent: part.extent,
      kind: part.kind,
      alterationId: part.alterationId
    })),
    appliesTo: firstPart.appliesTo,
    changedBy: [...(firstPart.changedBy ?? []), ...matchingParts.flatMap((p) => (p.changedBy ?? []))],
    range: firstPart.range,
    suffix: firstPart.suffix,
    levelMult: firstPart.levelMult,
  };
  return [combinedParts, ...unmatchingParts];
};

export default combineDescriptionParts;