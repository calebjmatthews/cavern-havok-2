import type BattleState from "@common/models/battleState";
import type DescriptionPart from "@common/models/descriptionPart";
import type EquipmentPiece from "@common/models/equipmentPiece";
import type { DescriptionPartChangedBy } from "@common/models/descriptionPart";
import RichText, { type RichTextInterface } from "@common/models/richText";
import enchantments from "@common/instances/enchantments";
import applyModToPossibleExistingPart from "./applyModToPossibleExistingPart";
import findPartOfKind from "./findPartOfKind";

const applyLevelOrEnchantment = (args: {
  partsArgs: (string | RichText | RichTextInterface | DescriptionPart)[];
  levelOrEnchantment: string;
  battleState?: BattleState;
  userId?: string;
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
        parts.push({
          kind: 'damage',
          changedBy: [changedBy],
          extent: mod.extent,
          appliesTo: mod.appliesTo
        });
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
        parts.push({
          kind: 'defense',
          changedBy: [changedBy],
          extent: mod.extent,
          appliesTo: mod.appliesTo
        });
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

export default applyLevelOrEnchantment;