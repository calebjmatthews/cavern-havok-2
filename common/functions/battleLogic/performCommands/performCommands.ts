import type BattleState from "@common/models/battleState";
import type SubCommandResolved from "../../../models/subCommandResolved";
import type SubCommand from "@common/models/subCommand";
import commandsIntoSubCommands from "./commandsIntoSubCommands";
import cloneBattleState from "@common/functions/cloneBattleState";
import sortSubCommands from "./sortSubCommands";
import resolveSubCommand from "./resolveSubCommand";

const performCommands = (battleState: BattleState) => {
  const subCommands = commandsIntoSubCommands(cloneBattleState(battleState));

  const subCommandsResolved: SubCommandResolved[] = [];
  let newBattleState: BattleState = { ...battleState };
  let subCommandsRemaining = [ ...subCommands ];
  let delayFromRoot = 0;

  for (let looper = 0; looper < 1000; looper++) {
    const result = performOneSubCommand({
      battleState: newBattleState,
      subCommands: subCommandsRemaining,
      delayFromRoot
    });
    newBattleState = result.battleState;
    subCommandsResolved.push(result.subCommandResolved);
    delayFromRoot += result.durationTotal;
    subCommandsRemaining = result.subCommands.slice(1);

    if (subCommandsRemaining.length === 0) return {
      battleState: newBattleState,
      subCommandsResolved
    };
  };
  throw Error(`performCommands error: infinite commands for battle ID${battleState.battleId}`);
};

const performOneSubCommand = (args: {
  battleState: BattleState,
  subCommands: SubCommand[],
  delayFromRoot: number
}) => {
  const { battleState, delayFromRoot } = args;

  const sortedSubCommands = sortSubCommands(args);
  const subCommand = sortedSubCommands[0];
  if (!subCommand) throw Error(`performOneSubCommand error: subCommand not found.`);

  return {
    ...resolveSubCommand({ battleState, subCommand, delayFromRoot }),
    subCommands: sortedSubCommands
  };
};

export default performCommands;
