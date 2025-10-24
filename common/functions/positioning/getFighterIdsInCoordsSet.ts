import type BattleState from "@common/models/battleState";

const getFighterIdsInCoordsSet = (args: {
  battleState: BattleState,
  coordsSet: [number, number][]
}) => {
  const { battleState, coordsSet } = args;
  
  const coordsSetMap: { [coordsStr: string] : boolean } = {};
  coordsSet.forEach((coords) => coordsSetMap[JSON.stringify(coords)] = true);
  const fightersAffectedIds = Object.values(battleState.fighters).filter((fighter) => (
    coordsSetMap[JSON.stringify(fighter.coords)] === true
  )).map((f) => f.id);

  return fightersAffectedIds;
};

export default getFighterIdsInCoordsSet;