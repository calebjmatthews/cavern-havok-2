import type BattleState from "@common/models/battleState";

const getOccupantIdsInCoordsSet = (args: {
  battleState: BattleState,
  coordsSet: [number, number][]
}) => {
  const { battleState, coordsSet } = args;
  
  const coordsSetMap: { [coordsStr: string] : boolean } = {};
  coordsSet.forEach((coords) => coordsSetMap[JSON.stringify(coords)] = true);
  const occupantsAffectedIds = [
    ...Object.values(battleState.fighters),
    ...Object.values(battleState.obstacles),
    ...Object.values(battleState.creations),
  ].filter((occupant) => (
    coordsSetMap[JSON.stringify(occupant.coords)] === true
  )).map((f) => f.id);

  return occupantsAffectedIds;
};

export default getOccupantIdsInCoordsSet;