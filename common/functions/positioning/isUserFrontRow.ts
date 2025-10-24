import type BattleState from "@common/models/battle_state";

const isUserFrontRow = (args: {
  battleState: BattleState,
  userId: string
}) => {
  return true;
};

export default isUserFrontRow;