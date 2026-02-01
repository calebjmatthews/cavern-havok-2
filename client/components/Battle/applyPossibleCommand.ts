import type Command from '@common/models/command';
import type BattleState from '@common/models/battleState';
import type EquipmentPiece from '@common/models/equipmentPiece';
import cloneBattleState from '@common/functions/cloneBattleState';
import performCommands from '@common/functions/battleLogic/performCommands/performCommands';
import getOccupantIdFromCoords from '@common/functions/positioning/getOccupantIdFromCoords';
import equipments, { equipmentMissing } from '@common/instances/equipments';
import { genId } from '@common/functions/utils/random';

const applyPossibleCommand = (args: {
  battleState: BattleState,
  toCommand: string,
  piece: EquipmentPiece,
  targetSelected: [number, number]
}) => {
  const { battleState, toCommand, piece, targetSelected } = args;

  const equipment = equipments[piece.equipmentId] ?? equipmentMissing;
  const targetId = (equipment.targetType === 'id' && targetSelected)
    ? getOccupantIdFromCoords({ battleState, coords: targetSelected })
    : undefined;
  const targetCoords = (equipment.targetType === 'coords' && targetSelected)
    ? targetSelected
    : undefined;

  const command: Command = {
    id: genId(),
    fromId: toCommand,
    pieceId: piece.id,
    targetId,
    targetCoords
  };
  const battleStateWithCommand: BattleState = {
    ...cloneBattleState(battleState),
    commandsPending: {
      ...battleState.commandsPending,
      [command.id]: command
    }
  };
  const results = performCommands(battleStateWithCommand);
  const battleStatePossibleNext = results.battleState
  const actionPossibleNext = results.actionsResolved.find((sc) => sc.commandId === command.id);

  return { battleStatePossibleNext, actionPossibleNext };
};

export default applyPossibleCommand;