import type RichText from "@common/models/richText";
import type { DescriptionPartKind } from "@common/models/descriptionPart";
import type { RichTextInterface } from "@common/models/richText";
import { TERMS } from "@common/enums";

const addExtentAndKind = (extentAndKindPiece: {
  kind: DescriptionPartKind;
  extent?: number;
  alterationId?: string;
}) => {
  const { kind, extent, alterationId } = extentAndKindPiece;
  const contents: (string | RichText | RichTextInterface)[] = [];
  if (!extent) return contents;

  if (kind === 'damage') {
    contents.push(`${extent} damage`);
  }
  else if (kind === 'healing') {
    contents.push(`${extent} healing`);
  }
  else if (kind === 'curse') {
    contents.push({
      tag: 'span', 
      contents: [
        `${extent}`,
        { tag: 'Term', contents: [TERMS.CURSE] },
        `potency`
      ]
    });
  }
  else if (kind === 'blessing') {
    contents.push({
      tag: 'span', 
      contents: [
        `${extent}`,
        { tag: 'Term', contents: [TERMS.BLESSING] },
        `potency`
      ]
    });
  }
  else if ((kind === 'giveCurse' || kind === 'giveBlessing') && alterationId) {
    contents.push({
      tag: 'span', 
      contents: [
        `${extent}`,
        { tag: 'Alteration', contents: [alterationId] }
      ]
    });
  }
  else if (kind === 'chargeCost') {
    contents.push({
      tag: 'span',
      contents: [
        `Costs ${extent}`,
        { tag: 'Term', contents: [TERMS.CHARGE] }
      ]
    });
  }
  else if (kind === 'defense') {
    contents.push({
      tag: 'span',
      contents: [
        `${extent}`,
        { tag: 'Term', contents: [TERMS.DEFENSE] }
      ]
    });
  }
  else if (kind === 'healAfterDamage') {
    contents.push({
      tag: 'span',
      contents: [
        `${extent}`,
        { tag: 'Term', contents: [TERMS.HEAL_AFTER_DAMAGE] }
      ]
    });
  };

  return contents;
};

export default addExtentAndKind;