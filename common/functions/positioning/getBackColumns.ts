import type BattleState from "@common/models/battleState";
import getCoordsOnSide from "./getCoordsOnSide";
import getEnemySide from "./getEnemySide";

const getBackColumns = (args: {
  battleState: BattleState,
  userId: string,
  count: number
  onlyOccupiedSpaces?: boolean,
}): [number, number][] => {
  const { battleState, userId, count, onlyOccupiedSpaces } = args;
  const enemySide = getEnemySide({ battleState, userId });

  return getCoordsOnSide(
    { battleState, side: enemySide, onlyOccupiedSpaces }
  ).filter((coords) => (
    enemySide === 'B'
    ? coords[0] > (((battleState.size[0] * 2) - 1) - count)
    : coords[1] < count
  ));
};

export default getBackColumns;