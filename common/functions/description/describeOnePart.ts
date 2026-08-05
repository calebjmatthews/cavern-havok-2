import type BattleState from "@common/models/battleState";
import type DescriptionPart from "@common/models/descriptionPart";
import type EquipmentPiece from "@common/models/equipmentPiece";
import { type RichTextInterface } from "@common/models/richText";
import { TERMS } from "@common/enums";
import addExtentAndKind from "./addExtentAndKind";
import type { DescriptionSection } from "@common/models/descriptionPart";

const describeOnePart = (args: {
  part: DescriptionPart | DescriptionSection,
  battleState?: BattleState;
  userId?: string;
  piece: EquipmentPiece;
}) => {
  const { part } = args;

  const richText: RichTextInterface = { 'tag': 'span' };
  richText.contents = [];

  if ('extent' in part) {
    richText.contents.push(...addExtentAndKind(part));
  }
  else if ('subSections' in part) {
    richText.contents.push(...part.subSections.flatMap((subSection) => addExtentAndKind(subSection)));
  };

  // ToDo: Address 'fast' and 'slow'
  // if (part.kind === 'fast' || part.kind === 'slow') {
  //   const term = part.kind === 'fast' ? TERMS.FAST : TERMS.SLOW;
  //   richText.contents.push({ tag: 'Term', contents: [term] });
  // };

  if (part.appliesTo === 'user') {
    richText.contents.push(`to user`);
  }
  else if (part.appliesTo === 'userAndAllies') {
    richText.contents.push(`to user and allies`);
  }
  else if (part.appliesTo === 'target') {
    richText.contents.push(`to target`);
  }
  else if (part.appliesTo === 'column') {
    richText.contents.push(`to a column`);
  }
  else if (part.appliesTo === 'frontColumn') {
    richText.contents.push(`to the closest occupied enemy column`);
  }
  else if (part.appliesTo === 'backTwoColumns') {
    richText.contents.push(`to all enemy targets in the back two columns`);
  }
  else if (part.appliesTo === 'enemiesInUsersRow') {
    richText.contents.push(`to all enemy targets in user's row`);
  }
  else if (part.appliesTo === 'enemyAll') {
    richText.contents.push(`to all targets on enemy side`);
  }
  else if (part.appliesTo === 'front') {
    richText.contents.push({
      tag: 'span', 
      contents: [
        `to a target in`,
        { tag: 'Term', contents: [TERMS.FRONT] }
      ]
    });
  }

  if (part.range) {
    if (part.range[0] < 2) {
      richText.contents.push({
        tag: 'span', 
        contents: [
          `within ${part.range[1]}`,
          { tag: 'Term', contents: [TERMS.RANGE] },
        ]
      });
    }
    else {
      richText.contents.push({
        tag: 'span', 
        contents: [
          `between ${part.range[0]} and ${part.range[1]}`,
          { tag: 'Term', contents: [TERMS.RANGE] }
        ]
      });
    };
  };

  if (part.suffix) {
    richText.contents.push(part.suffix);
  };

  return richText.contents.length > 0 ? richText : null;
};

export default describeOnePart;