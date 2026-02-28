import type BattleState from "@common/models/battleState";
import type DescriptionPart from "@common/models/descriptionPart";
import type EquipmentPiece from "@common/models/equipmentPiece";
import type RichText from "@common/models/richText";
import type { DescriptionPartChangedBy } from "@common/models/descriptionPart";
import type { EnchantmentMod } from "@common/models/enchantment";
import enchantments from "@common/instances/enchantments";
import applyMod from "../../common/functions/utils/applyMod";
import { TERMS } from "@common/enums";

const describeWithCircumstances = (args: {
  parts: (string | RichText | DescriptionPart)[];
  battleState?: BattleState;
  userId: string;
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

  return {
    tag: 'span',
    contents: parts.map((part) => {
      if (typeof part === 'string') return part;
      if ('kind' in part) return describeOnePart({ part, ...args });
      return part;
    }).filter((p) => p !== null)
  };
};

const applyLevelOrEnchantment = (args: {
  partsArgs: (string | RichText | DescriptionPart)[];
  levelOrEnchantment: string;
  battleState?: BattleState;
  userId: string;
  piece: EquipmentPiece;
}) => {
  const { partsArgs, levelOrEnchantment, piece } = args;
  let parts = partsArgs.map((p) => {
    if (typeof p === 'string') return p;
    return { ...p };
  });

  if (levelOrEnchantment === 'level' && !!piece.level && (piece.level > 0)) {
    let affectedByLevel: DescriptionPart | undefined;
    for (let index = 0; index < parts.length; index++) {
      const part = parts[index];
      if (!!part && typeof part !== 'string' && 'levelMult' in part) {
        affectedByLevel = part;
      };
    };
    if (affectedByLevel?.levelMult) {
      if (!affectedByLevel.extent) affectedByLevel.extent = 1;
      const originalExtent = affectedByLevel.extent;
      affectedByLevel.extent += (piece.level * affectedByLevel.levelMult);
      if (!affectedByLevel.changedBy) affectedByLevel.changedBy = [];
      affectedByLevel.changedBy.push({
        kind: 'level',
        id: `${piece.level}`,
        amount: (affectedByLevel.extent - originalExtent)
      });
    }
    return parts;
  };

  const enchantment = enchantments[levelOrEnchantment];
  if (!enchantment) return parts;

  enchantment.mods.forEach((mod) => {
    const changedBy: DescriptionPartChangedBy = {
      kind: 'enchantment', id: enchantment.id, amount: mod.extent ?? 1
    };
    if (mod.kind === 'damage') {
      parts = applyModToPossibleExistingPart({ parts, mod, partKind: 'damage', changedBy });
      const partDamage = findPartOfKind(parts, 'damage');
      if (!partDamage?.extent) {
        parts.push({ kind: 'damage', changedBy: [changedBy] })
      };
    }

    else if (mod.kind === 'healingCurseBlessing') {
      parts = applyModToPossibleExistingPart({ parts, mod, partKind: 'healing', changedBy });
      parts = applyModToPossibleExistingPart({ parts, mod, partKind: 'curse', changedBy });
      parts = applyModToPossibleExistingPart({ parts, mod, partKind: 'blessing', changedBy });
    }

    else if (mod.kind === 'giveCurse' || mod.kind === 'giveBlessing') {
      let partMatching: DescriptionPart | null = null;
      if (mod.kind === 'giveCurse') partMatching = findPartOfKind(parts, 'giveCurse');
      else if (mod.kind === 'giveBlessing') partMatching = findPartOfKind(parts, 'giveBlessing');
      if (!partMatching?.extent || !partMatching?.alterationId) {
        parts.push({ kind: mod.kind, changedBy: [changedBy] });
      }
      else {
        parts = applyModToPossibleExistingPart({ parts, mod, partKind: mod.kind, changedBy });
      }
    }

    else if (mod.kind === 'chargeLess') {
      const partChargeCost = findPartOfKind(parts, 'chargeCost');
      if (partChargeCost?.extent && partChargeCost.extent < -1) {
        if (mod.extentKind === 'multiplicative') {
          partChargeCost.extent /= mod.extent ?? 2;
        }
        else {
          partChargeCost.extent -= mod.extent ?? 1;
        };
      };
    }

    else if (mod.kind === 'defense') {
      parts = applyModToPossibleExistingPart({ parts, mod, partKind: 'defense', changedBy });
      const partDefense = findPartOfKind(parts, 'defense');
      if (!partDefense?.extent) {
        parts.push({ kind: 'defense', changedBy: [changedBy] })
      };
    }

    else if (mod.kind === 'fast' || mod.kind === 'slow') {
      const partPriority = findPartOfKind(parts, 'fast') ?? findPartOfKind(parts, 'slow');
      if ((partPriority?.kind === 'fast' && mod.kind === 'slow')
        || (partPriority?.kind === 'slow' && mod.kind === 'fast')) {
        partPriority.kind = mod.kind;
        if (!partPriority.changedBy) partPriority.changedBy = [];
        partPriority.changedBy.push({ ...changedBy });
      }
      else if (!partPriority) {
        parts.push({ kind: mod.kind, changedBy: [changedBy] })
      }
    }

    else if (mod.kind === 'healAfterDamage') {
      parts = applyModToPossibleExistingPart({ parts, mod, partKind: 'healAfterDamage', changedBy });
      const partHealingAfterDamage = findPartOfKind(parts, 'healAfterDamage');
      if (!partHealingAfterDamage?.extent) {
        parts.push({ kind: 'healAfterDamage', changedBy: [changedBy] })
      };
    };
  });

  return parts;
};

const describeOnePart = (args: {
  part: DescriptionPart,
  battleState?: BattleState;
  userId: string;
  piece: EquipmentPiece;
}) => {
  const { part } = args;

  const richText: RichText = { 'tag': 'span' };
  richText.contents = [];

  if (part.extent) {
    if (part.kind === 'damage') {
      richText.contents.push(`${part.extent} damage`);
    }
    else if (part.kind === 'healing') {
      richText.contents.push(`${part.extent} healing`);
    }
    else if (part.kind === 'curse') {
      richText.contents.push({
        tag: 'span', 
        contents: [
          `${part.extent}`,
          { tag: 'Term', contents: [TERMS.CURSE] },
          `potency`
        ]
      });
    }
    else if (part.kind === 'blessing') {
      richText.contents.push({
        tag: 'span', 
        contents: [
          `${part.extent}`,
          { tag: 'Term', contents: [TERMS.BLESSING] },
          `potency`
        ]
      });
    }
    else if (part.kind === 'giveCurse' || part.kind === 'giveBlessing') {
      if (part.alterationId) {
        richText.contents.push({
          tag: 'span', 
          contents: [
            `${part.extent}`,
            { tag: 'Alteration', contents: [part.alterationId] }
          ]
        });
      };
    }
    else if (part.kind === 'chargeCost') {
      richText.contents.push({
        tag: 'span',
        contents: [
          `Costs ${part.extent}`,
          { tag: 'Term', contents: [TERMS.CHARGE] }
        ]
      });
    }
    else if (part.kind === 'defense') {
      richText.contents.push({
        tag: 'span',
        contents: [
          `${part.extent}`,
          { tag: 'Term', contents: [TERMS.DEFENSE] }
        ]
      });
    }
    else if (part.kind === 'healAfterDamage') {
      richText.contents.push({
        tag: 'span',
        contents: [
          `${part.extent}`,
          { tag: 'Term', contents: [TERMS.HEAL_AFTER_DAMAGE] }
        ]
      });
    };
  };

  if (part.kind === 'fast' || part.kind === 'slow') {
    const term = part.kind === 'fast' ? TERMS.FAST : TERMS.SLOW;
    richText.contents.push({
      tag: 'section',
      props: { className: 'section-with-separator' },
      contents: [
        { tag: 'span', props: { className: "separator" } },
        { tag: 'Term', contents: [term] }
      ]
    });
  };

  if (part.appliesTo === 'user') {
    richText.contents.push(`to user`);
  }
  else if (part.appliesTo === 'target') {
    richText.contents.push(`to target`);
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

  if (part.suffix) {
    richText.contents.push(part.suffix);
  }

  return richText.contents.length > 0 ? richText : null;
};

const applyModToPossibleExistingPart = (args: {
  parts: (string | RichText | DescriptionPart)[];
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

const findPartOfKind = (
  parts: (string | RichText | DescriptionPart)[],
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

export default describeWithCircumstances;