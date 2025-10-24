import type BattleState from "@common/models/battle_state";
import range from "../utils/range";
import getFighterIdFromCoords from "./getFighterIdFromCoords";

const getCoordsSetOfFirstInEnemyRows = (args: {
  battleState: BattleState,
  userId: string
}) => {
  const { battleState, userId } = args;
  const firstInRows: [number, number][] = [];
  const user = battleState.fighters[userId];
  if (!user) throw Error(`getCoordsOfFirstInEnemyRow error: Missing user ID${userId}`);

  const sideWidth = battleState.size[0];
  const columnIndexes: number[] = (user.side === 'A')
    ? range(sideWidth, (sideWidth * 2 - 1))
    : range((sideWidth - 1), 0, -1);

  const sideHeight = battleState.size[1];
  range(0, sideHeight).forEach((rowIndex) => {
    for (let cii = 0; cii < columnIndexes.length; cii++) {
      const columnIndex = columnIndexes[cii];
      if (!columnIndex) return;
      
      const coords: [number, number] = [columnIndex, rowIndex];
      const enemyId = getFighterIdFromCoords({ battleState, coords });
      if (enemyId) {
        firstInRows.push(coords);
        return;
      };
    };
  });

  return firstInRows;
};

export default getCoordsSetOfFirstInEnemyRows;