import type BattleState from "@common/models/battle_state";

const getFighterIdsInCoordsSet = (args: {
  battleState: BattleState,
  coordsSet: [number, number][]
}) => {
  const { battleState, coordsSet } = args;
  
  const coordsSetStr = coordsSet.map((c) => JSON.stringify(c));
  const fightersAffectedIds = Object.values(battleState.fighters).filter((fighter) => (
    coordsSetStr.includes(JSON.stringify(fighter.coords))
  )).map((f) => f.id);

  return fightersAffectedIds;
};

export default getFighterIdsInCoordsSet;