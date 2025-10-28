import type BattleState from "@common/models/battleState";
import type Command from "@common/models/command";
import type Outcome from "@common/models/outcome";
import type CommandResolved from '../../models/commandResolved';
import sortCommands from "./sortCommands";
import equipments from "@common/instances/equipments";
import { DANGER_HEALTH_THRESHOLD, OUTCOME_DURATION_DEFAULT } from '@common/constants';
import type Fighter from '@common/models/fighter';

const performCommands = (args: {
  battleState: BattleState,
  commands: Command[]
}) => {
  const { battleState, commands } = args;

  const commandsResolved: CommandResolved[] = [];
  let newBattleState: BattleState = { ...battleState };
  let commandsRemaining = [ ...commands ];
  let delayFromRoot = 0;
  for (let looper = 0; looper < 1000; looper++) {
    const result = performOneCommand({
      battleState: newBattleState,
      commands,
      delayFromRoot
    });
    newBattleState = result.battleState;
    commandsResolved.push(result.commandResolved);
    delayFromRoot += result.durationTotal;
    commandsRemaining = result.commands.slice(1);

    if (commandsRemaining.length === 0) return {
      battleState: newBattleState,
      commandsResolved
    };
  };

  throw Error(`performCommands error: infinite commands for battle ID${battleState.battleId}`);
};

const performOneCommand = (args: {
  battleState: BattleState,
  commands: Command[],
  delayFromRoot: number
}) => {
  const { battleState, delayFromRoot } = args;

  const sortedCommands = sortCommands(args);
  const command = sortedCommands[0];
  if (!command) throw Error(`performOneCommand error: command not found.`);

  return { ...resolveCommand({ battleState, command, delayFromRoot }), commands: sortedCommands };
};

interface ResolveCommandResult {
  battleState: BattleState;
  commandResolved: CommandResolved;
  durationTotal: number;
};

const resolveCommand = (args: {
  battleState: BattleState,
  command: Command,
  delayFromRoot: number
}): ResolveCommandResult => {
  const { battleState, command, delayFromRoot } = args;
  const commandId = command.id;
  const outcomeDefault = { userId: command.fromId, duration: 0 };
  const resolvedDefault = { commandId, delayFromRoot };

  const user = battleState.fighters[command.fromId];
  if (!user) throw Error(`resolveCommand error: user ID${command.fromId} not found.`);
  if (user?.health <= 0) {
    return { battleState, commandResolved: { ...resolvedDefault, outcomes: [{
      ...outcomeDefault, skippedBecauseDowned: true
    }] }, durationTotal: 0 };
  };
  if (user?.isStunned) {
    return { battleState, commandResolved: { ...resolvedDefault, outcomes: [{
      ...outcomeDefault, skippedBecauseStunned: true
    }] }, durationTotal: 0 };
  }

  const equipment = equipments[command.equipmentId];
  if (!equipment?.getOutcomes) {
    throw Error(`resolveCommand error: equipment or getOutcomes for ID${command.fromId} not found.`);
  };

  let target = command.targetCoords;
  if (command.targetId) {
    const fighterTargeted = battleState.fighters[command.targetId];
    if (!fighterTargeted) {
      throw Error(`resolveCommand error: fighterTargeted for command ID${command.id}.`);
    };
    target = fighterTargeted.coords;
  };
  if (!target) throw Error(`resolveCommand error: target not found for command ID${command.id}.`);
  const outcomesInitial = equipment.getOutcomes({ battleState, userId: user.id, target });

  const newBattleState = { ...battleState };
  let durationTotal = 0;
  const outcomesPerformed = outcomesInitial.map((outcome) => {
    let outcomePerformed: Outcome = { ...outcome };
    if (outcome.affectedId) {
      let affected = newBattleState.fighters[outcome.affectedId];
      if (!affected) {
        throw Error(`resolveCommand error: affected fighter not found for command ID${command.id}.`);
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
    commandResolved: { ...resolvedDefault, outcomes: outcomesPerformed },
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