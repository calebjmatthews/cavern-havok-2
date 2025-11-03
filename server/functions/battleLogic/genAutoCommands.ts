import type BattleState from "@common/models/battleState";
import type Command from "@common/models/command";
import type Fighter from "@common/models/fighter";
import getCharacterClass from "@common/instances/character_classes";
import ais from "../ai";
import defaultAi from "../ai/default_ai";
import { FIGHTER_CONTROL_AUTO } from "@common/constants";

const genAutoCommands = (battleState: BattleState) => {
  const commands: { [id: string] : Command } = {};

  Object.values(battleState.fighters).forEach((fighter) => {
    if (fighter.controlledBy === FIGHTER_CONTROL_AUTO && fighter.health > 0) {
      const command = genAutoCommand({ battleState, fighter });
      if (command) { commands[command.fromId] = command; }
      else { console.log(`No command possible for ${fighter.id}.`); }
    };
  });

  return commands;
};

const genAutoCommand = (args: { battleState: BattleState, fighter: Fighter }) => {
  const { battleState, fighter } = args;
  const characterClass = getCharacterClass(fighter.characterClass);
  const ai = ais[characterClass.aiId] || defaultAi;
  return ai({ battleState, userId: fighter.id });
};

export default genAutoCommands;