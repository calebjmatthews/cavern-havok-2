import type BattleState from "@common/models/battleState";

const getOccupantCoords = (args: {
  battleState: BattleState,
  occupantId: string
}) => {
  const { battleState, occupantId } = args;
  const occupant = battleState.fighters[occupantId]
    || battleState.obstacles[occupantId]
    || battleState.creations[occupantId];
  if (!occupant) return null;
  return occupant.coords;
};

export default getOccupantCoords;