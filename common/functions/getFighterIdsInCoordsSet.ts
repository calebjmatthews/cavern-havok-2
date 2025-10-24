import type BattleState from "@common/models/battle_state";

const getFighterIdsInCoordsSet = (args: {
  battleState: BattleState,
  coordsSet: [number, number][]
}) => {
  const { battleState } = args;
  const fightersAffectedIds = Object.values(battleState.fighters).map((f) => f.id);

  return fightersAffectedIds;
};

export default getFighterIdsInCoordsSet;