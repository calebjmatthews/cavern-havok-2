import type { GetOutcomesArgs } from "@common/models/action";

const applyLevel = (value: number, args: GetOutcomesArgs, multiplier: number = 1) => {
  const { battleState, userId, pieceId } = args;
  const piece = battleState.fighters[userId]?.equipped.filter((p) => p.id === pieceId)?.[0];
  if (!piece) return value;
  return value + (piece.level ?? 0) * multiplier;
};

export default applyLevel;