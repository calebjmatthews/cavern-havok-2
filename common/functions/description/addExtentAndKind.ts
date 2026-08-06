import type RichText from "@common/models/richText";
import type { DescriptionPartKind } from "@common/models/descriptionPart";
import type { RichTextInterface } from "@common/models/richText";
import { ELEMENTS, TERMS } from "@common/enums";

const addExtentAndKind = (extentAndKindPiece: {
  kind: DescriptionPartKind;
  extent?: number;
  alterationId?: string;
  elements?: string[]
}): RichTextInterface => {
  const { kind, extent, alterationId, elements } = extentAndKindPiece;
  const contents: (string | RichText | RichTextInterface)[] = [];
  if (!extent) return { tag: 'span', contents };

  contents.push(`${extent}`);

  const waterFireOrBioDefense = getWaterFireOrBioDefense({ kind, elements });
  if (waterFireOrBioDefense) {
    contents.push({ tag: 'Term', contents: [waterFireOrBioDefense] });
  }
  else if (elements) {
    elements.forEach((element) => {
      contents.push({ tag: 'Term', contents: [element] });
    });
  }

  if (kind === 'damage') {
    contents.push(`damage`);
  }
  else if (kind === 'healing') {
    contents.push(`healing`);
  }
  else if (kind === 'curse') {
    contents.push({
      tag: 'span', 
      contents: [
        { tag: 'Term', contents: [TERMS.CURSE] },
        `potency`
      ]
    });
  }
  else if (kind === 'blessing') {
    contents.push({
      tag: 'span', 
      contents: [
        { tag: 'Term', contents: [TERMS.BLESSING] },
        `potency`
      ]
    });
  }
  else if ((kind === 'giveCurse' || kind === 'giveBlessing') && alterationId) {
    contents.push({
      tag: 'span', 
      contents: [
        { tag: 'Alteration', contents: [alterationId] }
      ]
    });
  }
  else if (kind === 'chargeCost') {
    contents.push({
      tag: 'span',
      contents: [
        { tag: 'Term', contents: [TERMS.CHARGE] }
      ]
    });
  }
  else if (kind === 'defense' && !waterFireOrBioDefense) {
    contents.push({
      tag: 'span',
      contents: [
        { tag: 'Term', contents: [TERMS.DEFENSE] }
      ]
    });
  }
  else if (kind === 'healAfterDamage') {
    contents.push({
      tag: 'span',
      contents: [
        { tag: 'Term', contents: [TERMS.HEAL_AFTER_DAMAGE] }
      ]
    });
  };

  return { tag: 'span', contents };
};

const getWaterFireOrBioDefense = (args: {
  kind: DescriptionPartKind,
  elements?: string[]
}) => {
  const { kind, elements } = args;
  if (!elements || elements.length > 1) return null;

  if (kind === 'defense' && elements[0] === ELEMENTS.WATER) return TERMS.WATER_DEFENSE;
  if (kind === 'defense' && elements[0] === ELEMENTS.FIRE) return TERMS.FIRE_DEFENSE;
  if (kind === 'defense' && elements[0] === ELEMENTS.BIO) return TERMS.BIO_DEFENSE;
  return null;
};

export default addExtentAndKind;