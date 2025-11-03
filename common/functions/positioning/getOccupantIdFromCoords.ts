import type BattleState from "@common/models/battleState";

const getOccupantIdFromCoords = (args: {
  battleState: BattleState,
  coords: [number, number]
}) => {
  const { battleState, coords } = args;

  const occupants = [
    ...Object.values(battleState.fighters),
    ...Object.values(battleState.obstacles),
    ...Object.values(battleState.creations),
  ];
  for (let index = 0; index < occupants.length; index++) {
    const occupant = occupants[index];
    if (occupant?.coords[0] === coords[0] && occupant?.coords[1] === coords[1]) {
      return occupant.id;
    };
  };

  return undefined;
};

export default getOccupantIdFromCoords;