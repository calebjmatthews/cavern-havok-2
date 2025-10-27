import type BattleState from "@common/models/battleState";
import type Command from "@common/models/command";
import type Fighter from "@common/models/fighter";
import { FIGHTER_CONTROL_AUTO } from "@common/constants";

const genAutoCommands = (battleState: BattleState) => {
  const commands: Command[] = [];

  Object.values(battleState.fighters).forEach((fighter) => {
    if (fighter.controlledBy === FIGHTER_CONTROL_AUTO) {

    };
  });

  return commands;
};

const genAutoCommand = (args: { battleState: BattleState, fighter: Fighter }) => {
  
};

export default genAutoCommands;