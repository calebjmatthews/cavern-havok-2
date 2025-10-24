import type BattleState from "@common/models/battle_state";

const getFrontColumn = (args: {
  battleState: BattleState,
  userId: string
}) => {
  const frontColumn: [number, number][] = [[0, 0], [0, 1], [0, 2]];
  return frontColumn;
};

export default getFrontColumn;