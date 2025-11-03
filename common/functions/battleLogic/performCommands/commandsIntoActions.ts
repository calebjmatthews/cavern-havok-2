import type BattleState from "@common/models/battleState";
import type Command from "@common/models/command";
import type Action from "@common/models/action";
import equipments from "@common/instances/equipments";
import getOccupantById from "@common/functions/positioning/getOccupantById";

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
      const occupantTargeted = getOccupantById({ battleState, occupantId: command.targetId });
      if (!occupantTargeted) {
        throw Error(`commandsIntoActions error: occupantTargeted for command ID${command.id}.`);
      };
      target = occupantTargeted.coords;
    };
    if (!target) throw Error(`commandsIntoActions error: target not found for command ID${command.id}.`);

    const commandId = command.id;
    const userId = command.fromId;
    const actionsFromCommand = equipment.getActions({ battleState, commandId, userId, target });
    actionsFromCommand.forEach((action) => actions.push({ ...action, command }));
  });

  return actions;
};

export default commandsIntoActions;