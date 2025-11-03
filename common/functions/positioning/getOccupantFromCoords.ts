import type BattleState from "@common/models/battleState"
import getOccupantIdFromCoords from "./getOccupantIdFromCoords";

const getOccupantFromCoords = (args: {
  battleState: BattleState,
  coords: [number, number]
}) => {
  const { battleState } = args;

  const occupantId = getOccupantIdFromCoords(args);
  const occupants = {
    ...battleState.fighters,
    ...battleState.obstacles,
    ...battleState.creations
  }
  return occupants[occupantId || ''];
};

export default getOccupantFromCoords;