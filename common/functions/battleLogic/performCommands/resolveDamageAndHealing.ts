import type Outcome from "@common/models/outcome";
import type Fighter from '@common/models/fighter';
import type BattleState from "@common/models/battleState";
import type Obstacle from "@common/models/obstacle";
import type Creation from "@common/models/creation";
import alterations from "@common/instances/alterations";
import { HEALTH_DANGER_THRESHOLD } from '@common/constants';

const resolveDamageAndHealing = (args: {
  battleState: BattleState,
  affected: Fighter | Obstacle | Creation,
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
    const extent = alteration.getExtent(
      { battleState, userId: outcome.userId, affectedId: outcome.affectedId, ownedBy: aa.ownedBy }
    );
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
    if (affected.occupantKind === "obstacle") outcomePerformed.obstacleDestroyed = true;
  }
  else if (affected.health <= HEALTH_DANGER_THRESHOLD && initialHealth > HEALTH_DANGER_THRESHOLD) {
    outcomePerformed.becameInDanger = true;
  }
  else if (affected.health > 0 && initialHealth <=0) {
    outcomePerformed.becameRevived = true;
  }
  else if (affected.health > HEALTH_DANGER_THRESHOLD && initialHealth <= HEALTH_DANGER_THRESHOLD) {
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