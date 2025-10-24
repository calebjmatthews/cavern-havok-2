import type BattleState from "@common/models/battle_state";

const areCoordsOutInSide = (args: {
  battleState: BattleState,
  coords: [number, number]
}) => {
  const { battleState, coords } = args;
  return Object.values(battleState.fighters).some((f) => (
    f.coords[0] === coords[0] && f.coords[1] === coords[1]
  ));
};

export default areCoordsOutInSide;