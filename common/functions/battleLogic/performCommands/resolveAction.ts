import type BattleState from "@common/models/battleState";
import type Outcome from "@common/models/outcome";
import type ActionResolved from '../../../models/actionResolved';
import type Action from "@common/models/action";
import type Obstacle from "@common/models/obstacle";
import Fighter from "@common/models/fighter";
import equipments from "@common/instances/equipments";
import { OUTCOME_DURATION_DEFAULT } from '@common/constants';
import resolveDamageAndHealing from "./resolveDamageAndHealing";
import getObstacleKind from "@common/instances/obstacle_kinds";
import getOccupantById from "@common/functions/positioning/getOccupantById";
import cloneOccupant from "@common/functions/cloneOccupant";
import type Creation from "@common/models/creation";
import cloneBattleState from "@common/functions/cloneBattleState";

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
  const commandId = action.commandId;
  const command = action.command;
  if (!command) throw Error(`resolveAction error: command ID${commandId} not found.`);

  const outcomeDefault = { userId: command.fromId, duration: 0 };
  const resolvedDefault = { commandId, delayFromRoot };

  const user = battleState.fighters[command.fromId];
  if (!user) throw Error(`resolveAction error: user ID${command.fromId} not found.`);
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

  const equipment = equipments[command.equipmentId];
  if (!equipment?.getActions) {
    throw Error(`resolveAction error: equipment or getActions for ID${command.fromId} not found.`);
  };

  let target = command.targetCoords;
  if (command.targetId) {
    const occupantTargeted = getOccupantById({ battleState, occupantId: command.targetId });
    if (!occupantTargeted) {
      throw Error(`resolveAction error: occupantTargeted for command ID${command.id}.`);
    };
    target = occupantTargeted.coords;
  };
  if (!target) throw Error(`resolveAction error: target not found for command ID${command.id}.`);
  const outcomesInitial = [...action.outcomes];

  const newBattleState = cloneBattleState(battleState);
  let durationTotal = 0;
  const outcomesPerformed = outcomesInitial.map((outcome) => {
    let outcomePerformed: Outcome = { ...outcome };

    if (outcome.makeObstacle) {
      const newObstacle = getObstacleKind(outcome.makeObstacle.kind).makeObstacle({
        createdBy: outcome.userId,
        side: user.side,
        coords: target
      });
      newBattleState.obstacles = { ...newBattleState.obstacles, [newObstacle.id]: newObstacle };
    };

    if (outcome.affectedId) {
      const affectedOriginal: Fighter | Obstacle | Creation | undefined = getOccupantById({
        battleState,
        occupantId: outcome.affectedId
      });
      if (!affectedOriginal) {
        throw Error(`resolveAction error: affected occupant not found for command ID${command.id}.`);
      };
      let affected = cloneOccupant(affectedOriginal);

      if (outcome.defense) {
        affected.defense += outcome.defense;
      };
      if (outcome.charge && "charge" in affected) {
        affected.charge += outcome.charge;
      };
      if (outcome.moveTo) {
        affected.coords = outcome.moveTo;
      };
      if (outcome.becameStunned && "isStunned" in affected) {
        affected.isStunned = true;
      };

      if (outcome.damage || outcome.healing) {
        const result = resolveDamageAndHealing({ battleState, affected, outcome, outcomePerformed });
        affected = result.affected;
        outcomePerformed = result.outcomePerformed;
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
          console.log(`After deleting obstacle ${affected.id}:`, newBattleState.obstacles[affected.id]);
        };
      }
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