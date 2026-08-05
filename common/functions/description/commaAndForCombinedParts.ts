import type RichText from "@common/models/richText";
import type { RichTextInterface } from "@common/models/richText";

const commaAndForCombinedParts = (parts: (string | RichTextInterface | RichText)[]) => {
  if (parts.length === 0) return parts;
  if (parts.length === 1) return parts;
  if (parts.length === 2) return [parts[0]!, ',', parts[1]!];

  const withCommaAnd: (string | RichTextInterface | RichText)[] = [];
  parts.forEach((part, index) => {
    const isPenultimate = index === (parts.length - 2);
    const isLast = index === (parts.length - 1);
    if (!isPenultimate && !isLast) {
      withCommaAnd.push(...[ part, ',' ]);
    }
    else if (isPenultimate) {
      withCommaAnd.push(...[ part, ', and' ]);
    }
    else if (isLast) {
      withCommaAnd.push(part);
    }
  });
  return withCommaAnd;
};

export default commaAndForCombinedParts;