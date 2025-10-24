import type BattleState from "@common/models/battle_state";

const getFighterCoords = (args: {
  battleState: BattleState,
  userId: string
}) => {
  const { battleState, userId } = args;
  if (!battleState.fighters[userId]) throw Error(`Fighter ID${userId} coordinates not found.`);
  return battleState.fighters[userId].coords;
};

export default getFighterCoords;