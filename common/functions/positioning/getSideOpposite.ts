import type BattleState from "@common/models/battleState"

const getSideOpposite = (args: {
  battleState: BattleState,
  userId: string
}): 'A' | 'B' => {
  const { battleState, userId } = args;
  const occupant = battleState.fighters[userId] ?? battleState.obstacles[userId]
    ?? battleState.creations[userId];
  if (!occupant) return 'B';
  return (occupant.side === 'A') ? 'B' : 'A';
};

export default getSideOpposite;