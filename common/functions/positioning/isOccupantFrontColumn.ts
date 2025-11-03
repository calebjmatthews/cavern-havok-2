import type BattleState from "@common/models/battleState";
import getOccupantById from "./getOccupantById";

const isOccupantFrontColumn = (args: {
  battleState: BattleState,
  occupantId: string
}) => {
  const { battleState } = args;
  const occupant = getOccupantById(args);
  if (!occupant) return false;

  const sideWidth = battleState.size[0];
  const sideAFrontColumnIndex = sideWidth - 1;
  const sideBFrontColumnIndex = sideWidth;

  return occupant.side === 'A'
    ? occupant.coords[0] === sideAFrontColumnIndex
    : occupant.coords[0] === sideBFrontColumnIndex;
};

export default isOccupantFrontColumn;