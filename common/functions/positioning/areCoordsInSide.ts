import type BattleState from "@common/models/battleState";

// Assumes the coordinates are not out of bounds
const areCoordsOutInSide = (args: {
  battleState: BattleState,
  coords: [number, number],
  side: 'A' | 'B'
}) => {
  const { battleState, coords, side } = args;
  const sideWidth = battleState.size[0];
  return side === 'A' ? coords[0] < sideWidth : coords[0] >= sideWidth;
};

export default areCoordsOutInSide;