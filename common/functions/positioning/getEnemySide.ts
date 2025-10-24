import type BattleState from "@common/models/battleState";

const getEnemySide = (args: {
  battleState: BattleState,
  userId: string
}) => {
  const { battleState, userId } = args;
  const user = battleState.fighters[userId];
  if (!user) throw Error(`getFrontColumn error: fighter not found with ID${userId}`);
  
  return user.side === 'A' ? 'B' : 'A';
};

export default getEnemySide;