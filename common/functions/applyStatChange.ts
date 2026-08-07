import type BattleState from "@common/models/battleState";
import type EquipmentPiece from "@common/models/equipmentPiece";
import type Fighter from "@common/models/fighter";
import type Outcome from "@common/models/outcome";
import type StatChange from "@common/models/statChange";

const applyStatChange = (args: {
  fighter: Fighter,
  statChange: StatChange,
  piece: EquipmentPiece,
  battleState?: BattleState,
  userId?: string | undefined,
  affectedId?: string | undefined,
  outcome?: Outcome,
}) => {
  const { statChange } = args;
  const fighter = args.fighter;

  const extent = statChange.getExtent(args);
  if (!extent) return fighter;

  if (statChange.stat === 'health') {
    if (statChange.extentKind === 'additive') {
      fighter.healthMax += extent; fighter.health += extent;
    };
    if (statChange.extentKind === 'subtractive') {
      fighter.healthMax -= extent; fighter.health -= extent;
    };
    if (statChange.extentKind === 'multiplicative') {
      fighter.healthMax *= extent; fighter.health *= extent;
    };
    if (statChange.extentKind === 'divisive') {
      fighter.healthMax /= extent; fighter.health /= extent;
    };
  }
  else if (statChange.stat === 'speed') {
    if (statChange.extentKind === 'additive') fighter.speed += extent;
    if (statChange.extentKind === 'subtractive') fighter.speed -= extent;
    if (statChange.extentKind === 'multiplicative') fighter.speed *= extent;
    if (statChange.extentKind === 'divisive') fighter.speed /= extent;
  }
  else if (statChange.stat === 'charm') {
    if (statChange.extentKind === 'additive') fighter.charm += extent;
    if (statChange.extentKind === 'subtractive') fighter.charm -= extent;
    if (statChange.extentKind === 'multiplicative') fighter.charm *= extent;
    if (statChange.extentKind === 'divisive') fighter.charm /= extent;
  }
  else if (statChange.stat === 'chestChoices') {
    if (statChange.extentKind === 'additive') fighter.chestChoices += extent;
    if (statChange.extentKind === 'subtractive') fighter.chestChoices -= extent;
    if (statChange.extentKind === 'multiplicative') fighter.chestChoices *= extent;
    if (statChange.extentKind === 'divisive') fighter.chestChoices /= extent;
  }
  else if (statChange.stat === 'treasureChoices') {
    if (statChange.extentKind === 'additive') fighter.treasureChoices += extent;
    if (statChange.extentKind === 'subtractive') fighter.treasureChoices -= extent;
    if (statChange.extentKind === 'multiplicative') fighter.treasureChoices *= extent;
    if (statChange.extentKind === 'divisive') fighter.treasureChoices /= extent;
  }
  else if (statChange.stat === 'rarityMult') {
    if (statChange.extentKind === 'additive') fighter.rarityMult += extent;
    if (statChange.extentKind === 'subtractive') fighter.rarityMult -= extent;
    if (statChange.extentKind === 'multiplicative') fighter.rarityMult *= extent;
    if (statChange.extentKind === 'divisive') fighter.rarityMult /= extent;
  };

  return fighter;
};

export default applyStatChange;