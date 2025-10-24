import type BattleState from "@common/models/battle_state";
import range from "../utils/range";

const getFrontColumn = (args: {
  battleState: BattleState,
  side: 'A' | 'B'
}): [number, number][] => {
  const { battleState, side } = args;
  const sideWidth = battleState.size[0];
  const sideHeight = battleState.size[1];
  const sideAFrontColumnIndex = sideWidth - 1;
  const sideBFrontColumnIndex = sideWidth;
  return range(0, sideHeight-1).map((rowIndex) => (
    [(side === 'A' ? sideAFrontColumnIndex : sideBFrontColumnIndex), rowIndex]
  ));
};

export default getFrontColumn;