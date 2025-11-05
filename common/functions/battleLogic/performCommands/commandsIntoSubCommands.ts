import type BattleState from "@common/models/battleState";
import type SubCommand from "@common/models/subCommand";
import equipments from "@common/instances/equipments";

const commandsIntoSubCommands = (battleState: BattleState) => {
  const subCommands: SubCommand[] = [];
  Object.values(battleState.commandsPending).forEach((command) => {
    const equipment = equipments[command.equipmentId];
    if (!equipment?.getSubCommands) {
      throw Error(`commandsIntoSubCommands error: getSubCommands for ID${command} not found.`);
    };
    const subCommandsFromCommand = equipment.getSubCommands({ battleState, command });
    subCommands.push(...subCommandsFromCommand);
  });

  return subCommands;
};

export default commandsIntoSubCommands;