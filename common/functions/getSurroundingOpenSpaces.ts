import type BattleState from "@common/models/battle_state";

const getSurroundingOpenSpaces = (args: {
  battleState: BattleState,
  origin: [number, number],
  min: number,
  max: number
}) => {
  const { origin } = args;
  return [origin];
};

export default getSurroundingOpenSpaces;