import type BattleState from "@common/models/battle_state";

const getFighterCoords = (args: {
  battleState: BattleState,
  fighterId: string
}) => {
  const { battleState, fighterId } = args;
  if (!battleState.fighters[fighterId]) {
    throw Error(`getFighterCoords error: Fighter ID${fighterId} coordinates not found.`);
  }
  return battleState.fighters[fighterId].coords;
};

export default getFighterCoords;