import type BattleState from "@common/models/battleState";

const areCoordsOpen = (args: {
  battleState: BattleState,
  coords: [number, number]
}) => {
  const { battleState, coords } = args;
  const fighterOnCoords = Object.values(battleState.fighters).some((f) => (
    f.coords[0] === coords[0] && f.coords[1] === coords[1]
  ));
  const obstacleOnCoords = Object.values(battleState.obstacles).some((o) => (
    o.coords[0] === coords[0] && o.coords[1] === coords[1]
  ));
  const creationOnCoords = Object.values(battleState.creations).some((c) => (
    c.coords[0] === coords[0] && c.coords[1] === coords[1]
  ));
  return (!fighterOnCoords && !obstacleOnCoords && !creationOnCoords);
};

export default areCoordsOpen;