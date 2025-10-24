import type BattleState from "@common/models/battle_state";

const areCoordsOutOfBounds = (args: {
  battleState: BattleState,
  coords: [number, number]
}) => {
  const { battleState, coords } = args;
  const { size } = battleState;
  return (
    coords[0] < 0 || coords[1] < 0 || coords[0] >= (size[0] * 2) || coords[1] >= size[1]
  )
};

export default areCoordsOutOfBounds;