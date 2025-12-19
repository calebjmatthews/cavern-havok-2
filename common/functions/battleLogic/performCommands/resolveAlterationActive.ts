import { v4 as uuid } from 'uuid';

import type AlterationActive from "@common/models/alterationActive";
import type BattleState from "@common/models/battleState"
import type Outcome from "@common/models/outcome";
import alterations from "@common/instances/alterations";
import getOccupantById from "@common/functions/positioning/getOccupantById";
import cloneBattleState from "@common/functions/cloneBattleState";
import {
  HEALTH_DANGER_THRESHOLD, OUTCOME_ALTERATION_DURATION_DEFAULT, ALTERATION_SUB_COMMAND_RESOLVED
} from "@common/constants";

const resolveAlterationActive = (args: {
  battleState: BattleState,
  alterationActive: AlterationActive,
  roundTimings: ('usingAction' | 'targetedByAction' | 'roundStart' | 'roundEnd' | 'battleStart')[]
}) => {
  const { battleState, alterationActive, roundTimings } = args;
  const aa: AlterationActive = { ...alterationActive };

  const alteration = alterations[aa.alterationId];

  if (!alteration || !(roundTimings.includes(alteration.appliesDuring))) return;

  let applied: boolean = false;
  const extent = alteration.getExtent({
    battleState,
    userId: (aa.ownedBy ?? ''),
    affectedId: aa.alterationId,
    alterationActive: aa
  });
  if (!extent || extent === 0) return;
  const outcomePerformed: Outcome = {
    userId: ALTERATION_SUB_COMMAND_RESOLVED,
    affectedId: aa.ownedBy,
    alterationId: aa.alterationId,
    duration: OUTCOME_ALTERATION_DURATION_DEFAULT
  };
  const occupant = getOccupantById({ battleState, occupantId: aa.ownedBy }) ;
  if (!occupant) return;
  if (alteration.isDamage || alteration.isHealing) {
    const initialHealth = occupant.health;
    
    if (alteration.isDamage) {
      const damage = extent;
      occupant.health -= damage;
      outcomePerformed.damage = damage;
      outcomePerformed.sufferedDamage = damage;
      applied = true;
    }
    else if (alteration.isHealing) {
      const healing = extent;
      occupant.health += healing;
      if (occupant.health > occupant.healthMax) occupant.health = occupant.healthMax;
      outcomePerformed.healing = healing;
      applied = true;
    };

    if (occupant.health <= 0 && initialHealth > 0) {
      outcomePerformed.becameDowned = true;
      if (occupant.occupantKind === "obstacle") outcomePerformed.obstacleDestroyed = true;
    }
    else if (occupant.health <= HEALTH_DANGER_THRESHOLD && initialHealth > HEALTH_DANGER_THRESHOLD) {
      outcomePerformed.becameInDanger = true;
    }
    else if (occupant.health > 0 && initialHealth <=0) {
      outcomePerformed.becameRevived = true;
    }
    else if (occupant.health > HEALTH_DANGER_THRESHOLD && initialHealth <= HEALTH_DANGER_THRESHOLD) {
      outcomePerformed.becameOutOfDanger = true;
    };
  };

  let newAlterationActive: AlterationActive | null = null;
  const newAlterationId = alteration.blessing || alteration.curse;
  if (newAlterationId) {
    newAlterationActive = {
      id: uuid(),
      alterationId: newAlterationId,
      ownedBy: aa.ownedBy,
      extent
    };
    outcomePerformed.bless = { alterationId: newAlterationId, extent };
  };

  if (alteration.declinesOnApplication && applied) aa.extent -= 1;
  if (alteration.expiresOnApplication && applied) aa.extent = 0;
  if (aa.extent === 0 && alteration.kind === 'blessing') {
    outcomePerformed.blessingExpired = alteration.id;
  }
  else if (aa.extent === 0 && alteration.kind === 'curse') {
    outcomePerformed.curseExpired = alteration.id;
  };

  return {
    newBattleState: cloneBattleState(battleState),
    alterationActive: aa,
    outcomePerformed,
    newAlterationActive
  };
};

export default resolveAlterationActive;