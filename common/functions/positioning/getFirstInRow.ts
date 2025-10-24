import type BattleState from "@common/models/battle_state";

const getFirstInRow = (args: {
  battleState: BattleState,
  rowIndex: number
}) => {
  const { battleState } = args;
  const fighterAffected = Object.values(battleState.fighters)[0];
  
  return fighterAffected?.id;
};

export default getFirstInRow;