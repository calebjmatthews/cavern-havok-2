import type Outcome from "@common/models/outcome";
import type Fighter from '@common/models/fighter';
import { DANGER_HEALTH_THRESHOLD } from '@common/constants';

const resolveDamageAndHealing = (args: {
  affected: Fighter,
  outcome: Outcome,
  outcomePerformed: Outcome
}) => {
  const { affected, outcome, outcomePerformed } = args;
  const initialHealth = affected.health;
  // const initialDefense = affected.defense;
  if (outcome.damage) {
    if (affected.defense) {
      if (affected.defense > outcome.damage) {
        affected.defense -= outcome.damage;
        outcome.defenseDamaged = outcome.damage;
      }
      else if (affected.defense === outcome.damage) {
        outcome.defenseDamaged = affected.defense;
        affected.defense = 0;
        outcome.defenseBroken = true;
      }
      else {
        const damageRemaining = outcome.damage - affected.defense;
        outcome.defenseDamaged = affected.defense;
        affected.defense = 0;
        affected.health -= damageRemaining;
        outcome.sufferedDamage = damageRemaining;
      };
    }
    else {
      affected.health -= outcome.damage;
      outcome.sufferedDamage = outcome.damage;
    };
  }
  if (outcome.healing) affected.health += outcome.healing;

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

export default resolveDamageAndHealing;