import type BattleState from "@common/models/battleState";
import type Outcome from "@common/models/outcome";
import type ActionResolved from '../../../models/actionResolved';
import type Action from "@common/models/action";
import equipments from "@common/instances/equipments";
import { OUTCOME_DURATION_DEFAULT } from '@common/constants';
import resolveDamageAndHealing from "./resolveDamageAndHealing";

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
  if (user?.health <= 0) {
    return { battleState, actionResolved: { ...resolvedDefault, outcomes: [{
      ...outcomeDefault, skippedBecauseDowned: true
    }] }, durationTotal: 0 };
  };
  if (user?.isStunned) {
    return { battleState, actionResolved: { ...resolvedDefault, outcomes: [{
      ...outcomeDefault, skippedBecauseStunned: true
    }] }, durationTotal: 0 };
  }

  const equipment = equipments[command.equipmentId];
  if (!equipment?.getActions) {
    throw Error(`resolveAction error: equipment or getActions for ID${command.fromId} not found.`);
  };

  let target = command.targetCoords;
  if (command.targetId) {
    const fighterTargeted = battleState.fighters[command.targetId];
    if (!fighterTargeted) {
      throw Error(`resolveAction error: fighterTargeted for command ID${command.id}.`);
    };
    target = fighterTargeted.coords;
  };
  if (!target) throw Error(`resolveAction error: target not found for command ID${command.id}.`);
  const outcomesInitial = [...action.outcomes];

  const newBattleState = { ...battleState };
  let durationTotal = 0;
  const outcomesPerformed = outcomesInitial.map((outcome) => {
    let outcomePerformed: Outcome = { ...outcome };
    if (outcome.affectedId) {
      let affected = newBattleState.fighters[outcome.affectedId];
      if (!affected) {
        throw Error(`resolveAction error: affected fighter not found for command ID${command.id}.`);
      };

      if (outcome.defense) {
        affected.defense += outcome.defense;
      };
      if (outcome.charge) {
        affected.charge += outcome.charge;
      };
      if (outcome.moveTo) {
        affected.coords = outcome.moveTo;
      };
      if (outcome.becameStunned) {
        affected.isStunned = true;
      };

      if (outcome.damage || outcome.healing) {
        const result = resolveDamageAndHealing({ affected, outcome, outcomePerformed });
        affected = result.affected;
        outcomePerformed = result.outcomePerformed;
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