import type BattleState from "@common/models/battleState"
import getOccupantById from "./getOccupantById";

const getColumnsBetweenIds = (args: {
  battleState: BattleState,
  fromId: string,
  toId: string
}) => {
  const { battleState, fromId, toId } = args;
  const fromOccupant = getOccupantById({ battleState, occupantId: fromId });
  const toOccupant = getOccupantById({ battleState, occupantId: toId });

  if (!fromOccupant || !toOccupant) return null;

  console.log(`getColumnsBetweenIds: `, Math.abs(fromOccupant.coords[0] - toOccupant.coords[0]));
  return Math.abs(fromOccupant.coords[0] - toOccupant.coords[0]);
};

export default getColumnsBetweenIds;