import type BattleState from "@common/models/battleState";
import getEnemySide from '@common/functions/positioning/getEnemySide';
import range from "../utils/range";
import getOccupantFromCoords from "./getOccupantFromCoords";

const getEnemyRowMatching = (args: {
  battleState: BattleState,
  userId: string,
  occupiedSpotsOnly?: boolean
}) => {
  const { battleState, userId, occupiedSpotsOnly } = args;

  const occupant = (
    battleState.fighters[userId] ?? battleState.obstacles[userId] ?? battleState.creations[userId]
  );
  if (!occupant) throw Error('Missing occupant in getEnemyRowMatching');
  
  const side = getEnemySide({ battleState, userId });
  const min = (side === 'A') ? 0 : (battleState.size[0]);
  const max = (side === 'A') ? (battleState.size[0] - 1) : ((battleState.size[0] * 2) - 1);
  return range(min, max)
  .map((col) => {
    const coords: [number, number] = [col, occupant.coords[1]];
    return coords
  })
  .filter((coords) => ((
    !occupiedSpotsOnly || (getOccupantFromCoords({ battleState, coords })) !== undefined)
  ))
};

export default getEnemyRowMatching;