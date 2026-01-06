import { v4 as uuid } from 'uuid';

import type Command from '@common/models/command';
import type Equipment from '@common/models/equipment';
import type BattleState from '@common/models/battleState';
import cloneBattleState from '@common/functions/cloneBattleState';
import performCommands from '@common/functions/battleLogic/performCommands/performCommands';
import getOccupantIdFromCoords from '@common/functions/positioning/getOccupantIdFromCoords';

const applyPossibleCommand = (args: {
  battleState: BattleState,
  toCommand: string,
  equip: Equipment,
  targetSelected: [number, number]
}) => {
  const { battleState, toCommand, equip, targetSelected } = args;

  const targetId = (equip.targetType === 'id' && targetSelected)
    ? getOccupantIdFromCoords({ battleState, coords: targetSelected })
    : undefined;
  const targetCoords = (equip.targetType === 'coords' && targetSelected)
    ? targetSelected
    : undefined;

  const command: Command = {
    id: uuid(),
    fromId: toCommand,
    equipmentId: equip.id,
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
  const subCommandPossibleNext = results.subCommandsResolved.find((sc) => sc.commandId === command.id);

  return { battleStatePossibleNext, subCommandPossibleNext };
};

export default applyPossibleCommand;