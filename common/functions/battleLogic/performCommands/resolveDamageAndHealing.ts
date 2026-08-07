import type Outcome from "@common/models/outcome";
import type Fighter from '@common/models/fighter';
import type BattleState from "@common/models/battleState";
import type Obstacle from "@common/models/obstacle";
import type Creation from "@common/models/creation";
import alterations from "@common/instances/alterations";
import { getDefenseTotal, setDefenseReduced } from "../defenseTotal";
import { HEALTH_DANGER_THRESHOLD } from '@common/constants';
import { ELEMENTS } from "@common/enums";
const ELE = ELEMENTS;

const resolveDamageAndHealing = (args: {
  battleState: BattleState,
  affected: Fighter | Obstacle | Creation,
  user: Fighter | Creation,
  outcome: Outcome,
  outcomePerformed: Outcome
}) => {
  const { battleState, affected: affectedArg, user, outcome, outcomePerformed } = args;
  let affected = affectedArg;
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
    const extent = alteration.getExtent({
      battleState,
      userId: (outcome.userId ?? ''),
      affectedId: outcome.affectedId,
      alterationActive: aa
    });
    if (extent && (alteration.modKind === 'damage' || alteration.modKind === 'damageOrHealing')) {
      if (alteration.extentKind === 'additive') { mods.damageModAdd += extent; return; }
      if (alteration.extentKind === 'subtractive') { mods.damageModAdd -= extent; return; }
      if (alteration.extentKind === 'multiplicative') { mods.damageModAdd *= extent; return; }
      if (alteration.extentKind === 'divisive') { mods.damageModAdd /= extent; return; }
    };
    if (extent && (alteration.modKind === 'healing' || alteration.modKind === 'damageOrHealing')) {
      if (alteration.extentKind === 'additive') { mods.healingModAdd += extent; return; }
      if (alteration.extentKind === 'subtractive') { mods.healingModAdd -= extent; return; }
      if (alteration.extentKind === 'multiplicative') { mods.healingModAdd *= extent; return; }
      if (alteration.extentKind === 'divisive') { mods.healingModAdd /= extent; return; }
    };
  });

  const damageInitial = outcome.damage;
  let damage = outcome.damage;
  if (outcome.damageEqualToUsersInjury) damage = (user.healthMax - user.health);
  if (damage) damage = ((damage + mods.damageModAdd) * mods.damageModMult);
  if (damageInitial && (damage ?? 0) < 1) damage = 1;
  const healingInitial = outcome.healing;
  let healing = outcome.healing;
  if (healing) healing = ((healing + mods.healingModAdd) * mods.healingModMult);
  if (healingInitial && (healing ?? 0) < 1) healing = 1;
  let defenseTotal = getDefenseTotal(affected);

  // Elemental defense
  if (damage && (
    ((outcome.elements ?? []).includes(ELE.BIO) && affected.defenseWater)
    || ((outcome.elements ?? []).includes(ELE.WATER) && affected.defenseFire)
    || ((outcome.elements ?? []).includes(ELE.FIRE) && affected.defenseBio)
  )) {
    damage *= 2;
    outcomePerformed.damageCritical = damage;
  }
  else if (damage && (
    ((outcome.elements ?? []).includes(ELE.WATER) && affected.defenseWater)
    || ((outcome.elements ?? []).includes(ELE.FIRE) && affected.defenseFire)
    || ((outcome.elements ?? []).includes(ELE.BIO) && affected.defenseBio)
  )) {
    outcome.defense = damage;
    outcomePerformed.defense = damage;
    outcomePerformed.damageAbsorbed = damage;
    damage = 0;
    outcomePerformed.damage = 0;
  };

  if (damage) {
    if (defenseTotal) {
      if (defenseTotal > damage) {
        affected = setDefenseReduced({ occupant: affected, extent: damage });
        outcomePerformed.defenseDamaged = damage;
      }
      else if (defenseTotal === damage) {
        outcomePerformed.defenseDamaged = affected.defense;
        affected = setDefenseReduced({ occupant: affected, extent: damage });
        outcomePerformed.defenseBroken = true;
      }
      else {
        const damageRemaining = damage - affected.defense;
        outcomePerformed.defenseDamaged = affected.defense;
        affected = setDefenseReduced({ occupant: affected, extent: damage });
        outcomePerformed.defenseBroken = true;
        affected.health -= damageRemaining;
        outcomePerformed.sufferedDamage = damageRemaining;
      };
    }
    else {
      affected.health -= damage;
      outcomePerformed.sufferedDamage = damage;
    };
    outcomePerformed.damage = damage;
  };

  if (healing) {
    const healthBefore = affected.health;
    affected.health += healing;
    if (affected.health >= affected.healthMax) affected.health = affected.healthMax;
    if (healthBefore < affected.health) outcomePerformed.wasHealed = affected.health - healthBefore;
    outcomePerformed.healing = healing;
  };

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