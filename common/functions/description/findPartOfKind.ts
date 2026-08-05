import type DescriptionPart from "@common/models/descriptionPart";
import RichText, { type RichTextInterface } from "@common/models/richText";

const findPartOfKind = (
  parts: (string | RichText | RichTextInterface | DescriptionPart)[],
  kind: string
): DescriptionPart | null => {
  let partOfKind: DescriptionPart | null = null;
  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];
    if (part && typeof part !== 'string' && 'kind' in part) {
      if (part.kind === kind) partOfKind = part;
    };
  };
  return partOfKind;
};

export default findPartOfKind;