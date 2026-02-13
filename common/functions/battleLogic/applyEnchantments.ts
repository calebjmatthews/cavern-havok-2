import type BattleState from "@common/models/battleState";
import type Outcome from "@common/models/outcome";
import enchantments from "@common/instances/enchantments";
import type { EnchantmentMod } from "@common/models/enchantment";
import { OUTCOME_DURATION_DEFAULT } from "@common/constants";
import getOccupantIdFromCoords from "../positioning/getOccupantIdFromCoords";

const duration = OUTCOME_DURATION_DEFAULT;

const applyEnchantments = (args: {
  battleState: BattleState;
  userId: string;
  pieceId: string;
  target?: [number, number];
  outcomesOriginal: Outcome[];
}) => {
  const { battleState, userId, pieceId, target, outcomesOriginal } = args;
  const user = battleState.fighters[userId];
  const piece = user?.equipped.find((piece) => piece.id === pieceId);
  const enchantmentIds = piece?.enchantments;
  if (!user || !piece || !enchantmentIds || (enchantmentIds ?? []).length === 0) {
    return outcomesOriginal;
  };

  const outcomes = outcomesOriginal.map((outcome) => ({ ...outcome }));
  enchantmentIds.forEach((enchantmentId) => {
    const enchantment = enchantments[enchantmentId];
    if (!enchantment) return;

    enchantment.mods.forEach((mod) => {
      if (mod.kind === 'damage') {
        const outcomeDamage = outcomes.find((o) => !!o.damage);
        if (outcomeDamage && outcomeDamage.damage) {
          outcomeDamage.damage = applyMod(outcomeDamage.damage, mod);
        }
        else {
          const damage = mod.extent ?? 1;
          const affectedId = getAffectedId({ mod, battleState, userId, target });
          if (affectedId) outcomes.push({ userId, duration, affectedId, damage });
        };
      };

      if (mod.kind === 'healingCurseBlessing') {
        const outcomeHealing = outcomes.find((o) => !!o.healing);
        if (outcomeHealing && outcomeHealing.healing) {
          outcomeHealing.healing = applyMod(outcomeHealing.healing, mod);
        };
        const outcomeCurse = outcomes.find((o) => !!o.curse);
        if (outcomeCurse && outcomeCurse.curse) {
          outcomeCurse.curse.extent = applyMod(outcomeCurse.curse.extent, mod);
        };
        const outcomeBless = outcomes.find((o) => !!o.bless);
        if (outcomeBless && outcomeBless.bless) {
          outcomeBless.bless.extent = applyMod(outcomeBless.bless.extent, mod);
        };
      };

      if ((mod.kind === 'giveBlessing' || mod.kind === 'giveCurse') && mod.alterationId) {
        const outcomeMatching = outcomes.find((outcome) => (
          outcome.bless?.alterationId === mod.alterationId
        ));
        let targetMatching = true;
        if (mod.appliesTo === 'user' && outcomeMatching?.affectedId !== userId) {
          targetMatching = false;
        };
        if (mod.appliesTo === 'target' && outcomeMatching?.affectedId === userId) {
          targetMatching = false;
        };

        if (outcomeMatching && targetMatching) {
          if (mod.kind === 'giveBlessing' && outcomeMatching.bless) {
            outcomeMatching.bless.extent = applyMod(outcomeMatching.bless.extent, mod);
          }
          else if (mod.kind === 'giveCurse' && outcomeMatching.curse) {
            outcomeMatching.curse.extent = applyMod(outcomeMatching.curse.extent, mod);
          };
        }

        else {
          const affectedId = getAffectedId({ mod, battleState, userId, target });
          const alterationId = mod.alterationId;
          const extent = mod.extent ?? 1;
          if (affectedId && mod.kind === 'giveBlessing' && alterationId) {
            outcomes.push({ userId, duration, affectedId, bless: { alterationId, extent } });
          }
          else if (affectedId && mod.kind === 'giveCurse' && alterationId) {
            outcomes.push({ userId, duration, affectedId, curse: { alterationId, extent } });
          };
        };
      };

      if (mod.kind === 'chargeLess') {
        const outcomeChargeCost = outcomes.find((outcome) => (outcome.charge ?? 0) < 1);
        if (outcomeChargeCost?.charge) {
          if (mod.extentKind === 'multiplicative') {
            outcomeChargeCost.charge /= mod.extent ?? 2;
          }
          else {
            outcomeChargeCost.charge -= mod.extent ?? 1;
          };
        };
      };

      if (mod.kind === 'healAfterDamage') {
        const outcomeMatching = outcomes.find((outcome) => (outcome.healAfterDamage ?? 0) > 0);
        if (outcomeMatching && outcomeMatching.healAfterDamage) {
          outcomeMatching.healAfterDamage = applyMod(outcomeMatching.healAfterDamage, mod);
        }
        else {
          const affectedId = getAffectedId({ mod, battleState, userId, target });
          if (affectedId) {
            outcomes.push({ userId, duration, affectedId, healAfterDamage: mod.extent ?? 1 });
          };
        };
      }
    });
  });

  return outcomes;
};

const applyMod = (value: number, mod: EnchantmentMod) => {
  if (mod.extentKind === 'multiplicative') {
    return value * (mod.extent ?? 2);
  }
  return value + (mod.extent ?? 1);
};

const getAffectedId = (args: {
  mod: EnchantmentMod,
  battleState: BattleState,
  userId: string,
  target?: [number, number]
}) => {
  const { mod, battleState, userId, target } = args;
  let affectedId: string | undefined = undefined;
  if (mod.appliesTo === 'user') affectedId = userId;
  if (mod.appliesTo === 'target' && target) {
    affectedId = getOccupantIdFromCoords({ battleState, coords: target });
  };
  return affectedId
};

export default applyEnchantments;