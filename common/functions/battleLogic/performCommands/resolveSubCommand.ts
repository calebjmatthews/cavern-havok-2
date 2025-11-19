import { v4 as uuid } from 'uuid';

import type BattleState from "@common/models/battleState";
import type Outcome from "@common/models/outcome";
import type Obstacle from "@common/models/obstacle";
import type Creation from "@common/models/creation";
import type SubCommand from "@common/models/subCommand";
import type SubCommandResolved from "../../../models/subCommandResolved";
import type AlterationActive from '@common/models/alterationActive';
import Fighter from "@common/models/fighter";
import resolveDamageAndHealing from "./resolveDamageAndHealing";
import getObstacleKind from "@common/instances/obstacle_kinds";
import getOccupantById from "@common/functions/positioning/getOccupantById";
import cloneOccupant from "@common/functions/cloneOccupant";
import cloneBattleState from "@common/functions/cloneBattleState";
import { OUTCOME_DURATION_DEFAULT } from '@common/constants';
import getAlterationActive from '../getAlterationActive';

interface ResolveSubCommandResult {
  battleState: BattleState;
  subCommandResolved: SubCommandResolved;
  durationTotal: number;
};

const resolveSubCommand = (args: {
  battleState: BattleState,
  subCommand: SubCommand,
  delayFromRoot: number
}): ResolveSubCommandResult => {
  const { battleState, subCommand, delayFromRoot } = args;
  const { userId } = subCommand;
  const commandId = subCommand.fromCommand;

  const outcomeDefault = { userId: subCommand.userId, duration: 0 };
  const resolvedDefault = { commandId, delayFromRoot };

  const user = battleState.fighters[subCommand.userId];
  if (!user) throw Error(`resolveSubCommand error: user ID${subCommand.userId} not found.`);
  if (user.health <= 0) {
    return { battleState, subCommandResolved: { ...resolvedDefault, outcomes: [{
      ...outcomeDefault, skippedBecauseDowned: true
    }] }, durationTotal: 0 };
  };
  if (user.isStunned) {
    return { battleState, subCommandResolved: { ...resolvedDefault, outcomes: [{
      ...outcomeDefault, skippedBecauseStunned: true
    }] }, durationTotal: 0 };
  };

  if (!subCommand.getOutcomes) {
    throw Error(`resolveSubCommand error: equipment or getOutcomes for ID${userId} not found.`);
  };

  let target = subCommand.targetCoords;
  if (subCommand.targetId) {
    const occupantTargeted = getOccupantById({ battleState, occupantId: subCommand.targetId });
    if (occupantTargeted) {
      target = occupantTargeted.coords;
    };
  };
  const outcomesInitial = [...subCommand.getOutcomes({ battleState, userId, target })];

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

    if (outcome.affectedId) {
      const affectedOriginal: Fighter | Obstacle | Creation | undefined = getOccupantById({
        battleState,
        occupantId: outcome.affectedId
      });
      if (!affectedOriginal) {
        throw Error(`resolveSubCommand error: affected occupant not found for command ID${subCommand.id}.`);
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
            id: uuid(),
            alterationId: blessingOrCurse.alterationId,
            extent: blessingOrCurse.extent,
            ownedBy: outcome.affectedId
          };
          newBattleState.alterationsActive[alteractionActive.id]  = alteractionActive;
        };
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
    subCommandResolved: { ...resolvedDefault, outcomes: outcomesPerformed },
    durationTotal
  };
};

export default resolveSubCommand;