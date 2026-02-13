import type BattleState from "@common/models/battleState";
import type Outcome from "@common/models/outcome";
import type Obstacle from "@common/models/obstacle";
import type Creation from "@common/models/creation";
import type Action from "@common/models/action";
import type ActionResolved from "../../../models/actionResolved";
import type AlterationActive from '@common/models/alterationActive';
import Fighter from "@common/models/fighter";
import resolveDamageAndHealing from "./resolveDamageAndHealing";
import getObstacleKind from "@common/instances/obstacle_kinds";
import getOccupantById from "@common/functions/positioning/getOccupantById";
import cloneOccupant from "@common/functions/cloneOccupant";
import cloneBattleState from "@common/functions/cloneBattleState";
import getAlterationActive from '../getAlterationActive';
import getCharacterClass from '@common/instances/character_classes';
import applyEnchantments from "../applyEnchantments";
import { genId } from "@common/functions/utils/random";
import { FIGHTER_CONTROL_AUTO, OUTCOME_DURATION_DEFAULT } from '@common/constants';

interface ResolveActionResult {
  battleState: BattleState;
  actionResolved: ActionResolved;
  durationTotal: number;
};

const resolveAction = (args: {
  battleState: BattleState,
  action: Action,
  delayFromRoot: number
}): ResolveActionResult => {
  const { battleState, action, delayFromRoot } = args;
  const { userId } = action;
  const commandId = action.fromCommand;

  const outcomeDefault = { userId: action.userId, duration: 0 };
  const resolvedDefault = { commandId, delayFromRoot };

  const user = battleState.fighters[action.userId];
  if (!user) throw Error(`resolveAction error: user ID${action.userId} not found.`);
  if (user.health <= 0) {
    return { battleState, actionResolved: { ...resolvedDefault, outcomes: [{
      ...outcomeDefault, skippedBecauseDowned: true
    }] }, durationTotal: 0 };
  };
  if (user.isStunned) {
    return { battleState, actionResolved: { ...resolvedDefault, outcomes: [{
      ...outcomeDefault, skippedBecauseStunned: true
    }] }, durationTotal: 0 };
  };

  if (!action.getOutcomes) {
    throw Error(`resolveAction error: equipment or getOutcomes for ID${userId} not found.`);
  };

  let target = action.targetCoords;
  if (action.targetId) {
    const occupantTargeted = getOccupantById({ battleState, occupantId: action.targetId });
    if (occupantTargeted) {
      target = occupantTargeted.coords;
    };
  };
  const pieceId = action.pieceId;
  const getOutcomesArgs = { battleState, userId, pieceId, target };
  const outcomesBeforeEnchantments = [...(action.getOutcomes(getOutcomesArgs))];
  const outcomesInitial = applyEnchantments({
    ...getOutcomesArgs,
    outcomesOriginal: outcomesBeforeEnchantments
  });

  const newBattleState = cloneBattleState(battleState);
  let durationTotal = 0;
  const outcomesPerformed = outcomesInitial.map((outcome) => {
    let outcomePerformed: Outcome = { ...outcome };

    if (outcome.makeObstacle) {
      let highestObstacleNumber = 1;
      Object.values(newBattleState.obstacles).forEach((obstacle) => {
        const nameSplit = obstacle.name.split(" ");
        const obstacleNumberFromName = parseInt(nameSplit[nameSplit.length - 1] || "");
        if (obstacleNumberFromName >= highestObstacleNumber) {
          highestObstacleNumber = (obstacleNumberFromName + 1);
        };
      });
      const obstacleKind = getObstacleKind(outcome.makeObstacle.kind);
      if (target) {
        const newObstacle = obstacleKind.makeObstacle({
          name: `${obstacleKind.id} ${highestObstacleNumber}`,
          createdBy: (outcome.userId ?? ''),
          side: user.side,
          coords: target
        });
        newBattleState.obstacles = { ...newBattleState.obstacles, [newObstacle.id]: newObstacle };
      };
    };

    if (outcome.makeFighter) {
      let highestFighterNumber = 1;
      Object.values(newBattleState.fighters).forEach((fighter) => {
        const nameSplit = fighter.name.split(" ");
        const fighterNumberFromName = parseInt(nameSplit[nameSplit.length - 1] || "");
        if (fighterNumberFromName >= highestFighterNumber) {
          highestFighterNumber = (fighterNumberFromName + 1);
        };
      });
      const characterClass = getCharacterClass(outcome.makeFighter.className);
      if (target) {
        const newFighter = characterClass.toFighter({
          name: `${characterClass.id} ${highestFighterNumber}`,
          ownedBy: FIGHTER_CONTROL_AUTO,
          controlledBy: FIGHTER_CONTROL_AUTO,
          side: user.side,
          coords: target
        });
        newBattleState.fighters = { ...newBattleState.fighters, [newFighter.id]: newFighter };
      };
    };

    if (outcome.affectedId) {
      const affectedOriginal: Fighter | Obstacle | Creation | undefined = getOccupantById({
        battleState,
        occupantId: outcome.affectedId
      });
      if (!affectedOriginal) {
        throw Error(`resolveAction error: affected occupant not found for command ID${action.id}.`);
      };
      let affected = cloneOccupant(affectedOriginal);

      if (outcome.defense) {
        affected.defense += outcome.defense;
      };
      if (outcome.charge && "charge" in affected) {
        affected.charge += outcome.charge;
      };
      if (outcome.moveTo) {
        affected.coords = [...outcome.moveTo];
      };
      if (outcome.becameStunned && "isStunned" in affected) {
        affected.isStunned = true;
      };

      if (outcome.damage || outcome.healing || outcome.damageEqualToUsersInjury) {
        const result = resolveDamageAndHealing({
          battleState, affected, user, outcome, outcomePerformed
        });
        affected = result.affected;
        outcomePerformed = result.outcomePerformed;
      };

      const blessingOrCurse = outcome.bless || outcome.curse;
      if (blessingOrCurse) {
        const existingAA = getAlterationActive({
          battleState,
          alterationId: blessingOrCurse.alterationId,
          occupantId: outcome.affectedId
        });
        if (existingAA) {
          const extent = existingAA.extent + blessingOrCurse.extent;
          newBattleState.alterationsActive[existingAA.id]  = { ...existingAA, extent };
        }
        else {
          const alteractionActive: AlterationActive = {
            id: genId(),
            alterationId: blessingOrCurse.alterationId,
            extent: blessingOrCurse.extent,
            ownedBy: outcome.affectedId
          };
          newBattleState.alterationsActive[alteractionActive.id]  = alteractionActive;
        };
      };

      // ToDo: Implement healAfterDamage
      if (outcome.healAfterDamage) {

      };

      if (affected.occupantKind === "fighter") {
        newBattleState.fighters[affected.id] = affected;
      }
      // affected is an Obstacle, destroy if no health
      else if (affected.occupantKind === "obstacle") {
        if (affected.health > 0) {
          newBattleState.obstacles[affected.id] = affected;
        }
        else {
          delete newBattleState.obstacles[affected.id];
        };
      };
    };

    durationTotal += OUTCOME_DURATION_DEFAULT;

    return outcomePerformed;
  });

  return {
    battleState: newBattleState,
    actionResolved: { ...resolvedDefault, outcomes: outcomesPerformed },
    durationTotal
  };
};

export default resolveAction;