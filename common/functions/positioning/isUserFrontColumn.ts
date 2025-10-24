import type BattleState from "@common/models/battle_state";

const isUserFrontColumn = (args: {
  battleState: BattleState,
  userId: string
}) => {
  return true;
};

export default isUserFrontColumn;