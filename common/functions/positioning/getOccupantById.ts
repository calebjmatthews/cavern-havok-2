import type BattleState from "@common/models/battleState";

const getOccupantById = (args: {
  battleState: BattleState,
  occupantId: string
}) => {
  const { battleState, occupantId } = args;

  return battleState.fighters[occupantId]
    || battleState.obstacles[occupantId]
    || battleState.creations[occupantId];
};

export default getOccupantById;