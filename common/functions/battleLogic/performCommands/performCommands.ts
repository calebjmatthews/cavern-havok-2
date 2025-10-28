import type BattleState from "@common/models/battleState";
import type Command from "@common/models/command";
import type Outcome from "@common/models/outcome";
import type ActionResolved from '../../../models/actionResolved';
import type Fighter from '@common/models/fighter';
import type Action from "@common/models/action";
import equipments from "@common/instances/equipments";
import sortActions from "../sortActions";
import { DANGER_HEALTH_THRESHOLD, OUTCOME_DURATION_DEFAULT } from '@common/constants';

const performCommands = (battleState: BattleState) => {
  const commands = Object.values(battleState.commandsPending);
  const actions = commandsIntoActions({ battleState, commands });
  const actionsResolved: ActionResolved[] = [];
  let newBattleState: BattleState = { ...battleState };
  let actionsRemaining = [ ...actions ];
  let delayFromRoot = 0;
  for (let looper = 0; looper < 1000; looper++) {
    const result = performOneAction({
      battleState: newBattleState,
      actions: actionsRemaining,
      delayFromRoot
    });
    newBattleState = result.battleState;
    actionsResolved.push(result.actionResolved);
    delayFromRoot += result.durationTotal;
    actionsRemaining = result.actions.slice(1);

    if (actionsRemaining.length === 0) return {
      battleState: newBattleState,
      actionsResolved
    };
  };

  throw Error(`performCommands error: infinite commands for battle ID${battleState.battleId}`);
};

const commandsIntoActions = (args: {
  battleState: BattleState,
  commands: Command[]
}) => {
  const { battleState, commands } = args;

  const actions: Action[] = [];
  commands.forEach((command) => {
    const equipment = equipments[command.equipmentId];
    if (!equipment?.getActions) {
      throw Error(`commandsIntoActions error: equipment or getActions for ID${command.fromId} not found.`);
    };

    let target = command.targetCoords;
    if (command.targetId) {
      const fighterTargeted = battleState.fighters[command.targetId];
      if (!fighterTargeted) {
        throw Error(`commandsIntoActions error: fighterTargeted for command ID${command.id}.`);
      };
      target = fighterTargeted.coords;
    };
    if (!target) throw Error(`commandsIntoActions error: target not found for command ID${command.id}.`);

    const commandId = command.id;
    const userId = command.fromId;
    const actionsFromCommand = equipment.getActions({ battleState, commandId, userId, target });
    actionsFromCommand.forEach((action) => actions.push({ ...action, command }));
  });

  return actions;
};

const performOneAction = (args: {
  battleState: BattleState,
  actions: Action[],
  delayFromRoot: number
}) => {
  const { battleState, delayFromRoot } = args;

  const sortedActions = sortActions(args);
  const action = sortedActions[0];
  if (!action) throw Error(`performOneAction error: command not found.`);

  return { ...resolveAction({ battleState, action, delayFromRoot }), actions: sortedActions };
};

interface ResolveCommandResult {
  battleState: BattleState;
  actionResolved: ActionResolved;
  durationTotal: number;
};

const resolveAction = (args: {
  battleState: BattleState,
  action: Action,
  delayFromRoot: number
}): ResolveCommandResult => {
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
        const result = performDamageAndHealing({ affected, outcome, outcomePerformed });
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

const performDamageAndHealing = (args: {
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

export default performCommands;