import type BattleState from "@common/models/battleState";
import type Action from "@common/models/action";
import equipments from "@common/instances/equipments";

const commandsIntoActions = (battleState: BattleState) => {
  const actions: Action[] = [];
  Object.values(battleState.commandsPending).forEach((command) => {
    const equipmentPiece = battleState.fighters[command.fromId]?.equipped
    .find((piece) => piece.id === command.pieceId);
    if (!equipmentPiece) {
      throw Error(`commandsIntoActions error: equipmentPiece for ID${command} not found.`);
    };
    const equipment = equipments[equipmentPiece.equipmentId];
    if (!equipment?.getActions) {
      throw Error(`commandsIntoActions error: getActions for ID${command} not found.`);
    };
    const actionsFromCommand = equipment.getActions({ battleState, command });
    actions.push(...actionsFromCommand);
  });

  return actions;
};

export default commandsIntoActions;