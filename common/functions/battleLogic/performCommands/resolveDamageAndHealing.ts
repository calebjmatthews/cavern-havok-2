import type Outcome from "@common/models/outcome";
import type Fighter from '@common/models/fighter';
import { DANGER_HEALTH_THRESHOLD } from '@common/constants';
import type BattleState from "@common/models/battleState";
import alterations from "@common/instances/alterations";

const resolveDamageAndHealing = (args: {
  battleState: BattleState,
  affected: Fighter,
  outcome: Outcome,
  outcomePerformed: Outcome
}) => {
  const { battleState, affected, outcome, outcomePerformed } = args;
  const initialHealth = affected.health;
  // const initialDefense = affected.defense;

  const mods = new DamageAndHealingMods();
  Object.values(battleState.alterationsActive).forEach((aa) => {
    const alteration = alterations[aa.alterationId];
    if (!alteration) return;
    const fighterId = (alteration.appliesDuring === 'usingAction')
      ? outcome.userId
      : outcome.affectedId;
    if (!fighterId) return;
    const extent = alteration.getExtent({ battleState, fighterId });
    if (extent && alteration.modKind === 'damage' && alteration.extentKind === 'additive') {
      mods.damageModAdd += extent; return;
    };
    if (extent && alteration.modKind === 'damage' && alteration.extentKind === 'multiplicative') {
      mods.damageModMult *= extent; return;
    };
    if (extent && alteration.modKind === 'healing' && alteration.extentKind === 'additive') {
      mods.healingModAdd += extent; return;
    };
    if (extent && alteration.modKind === 'healing' && alteration.extentKind === 'multiplicative') {
      mods.healingModMult *= extent; return;
    };
  });
  const damage = outcome.damage && ((outcome.damage + mods.damageModAdd) * mods.damageModMult);
  const healing = outcome.healing && ((outcome.healing + mods.healingModAdd) * mods.healingModMult);

  if (damage) {
    if (affected.defense) {
      if (affected.defense > damage) {
        affected.defense -= damage;
        outcomePerformed.defenseDamaged = damage;
      }
      else if (affected.defense === damage) {
        outcomePerformed.defenseDamaged = affected.defense;
        affected.defense = 0;
        outcomePerformed.defenseBroken = true;
      }
      else {
        const damageRemaining = damage - affected.defense;
        outcomePerformed.defenseDamaged = affected.defense;
        affected.defense = 0;
        affected.health -= damageRemaining;
        outcomePerformed.sufferedDamage = damageRemaining;
      };
    }
    else {
      affected.health -= damage;
      outcomePerformed.sufferedDamage = damage;
    };
  }
  if (healing) affected.health += healing;

  if (affected.health <= 0 && initialHealth > 0) {
    outcomePerformed.becameDowned = true;
  }
  else if (affected.health <= DANGER_HEALTH_THRESHOLD && initialHealth > DANGER_HEALTH_THRESHOLD) {
    outcomePerformed.becameInDanger = true;
  }
  else if (affected.health > 0 && initialHealth <=0) {
    outcomePerformed.becameRevived = true;
  }
  else if (affected.health > DANGER_HEALTH_THRESHOLD && initialHealth <= DANGER_HEALTH_THRESHOLD) {
    outcomePerformed.becameOutOfDanger = true;
  };

  return { affected, outcomePerformed };
};

class DamageAndHealingMods {
  damageModAdd: number = 0;
  damageModMult: number = 1;
  healingModAdd: number = 0;
  healingModMult: number = 1;
}

export default resolveDamageAndHealing;