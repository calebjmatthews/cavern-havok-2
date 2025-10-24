import type BattleState from "@common/models/battle_state";

const isFighterFrontColumn = (args: {
  battleState: BattleState,
  fighterId: string
}) => {
  const { battleState, fighterId } = args;
  const fighter = battleState.fighters[fighterId];
  if (!fighter) throw Error(`isFighterFrontColumn error: missing fighter with ID${fighterId}`);

  const sideWidth = battleState.size[0];
  const sideAFrontColumnIndex = sideWidth - 1;
  const sideBFrontColumnIndex = sideWidth;

  return fighter.side === 'A'
    ? fighter.coords[0] === sideAFrontColumnIndex
    : fighter.coords[0] === sideBFrontColumnIndex;
};

export default isFighterFrontColumn;