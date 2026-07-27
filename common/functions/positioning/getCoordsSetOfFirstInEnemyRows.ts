import type BattleState from "@common/models/battleState";
import range from "../utils/range";
import getOccupantFromCoords from "./getOccupantFromCoords";

const getCoordsSetOfFirstInEnemyRows = (args: {
  battleState: BattleState,
  userId: string
}) => {
  const { battleState, userId } = args;
  const firstInRows: [number, number][] = [];
  const firstUndownedInRows: [number, number][] = [];
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
      if (columnIndex === undefined) return;
      
      const coords: [number, number] = [columnIndex, rowIndex];
      const enemy = getOccupantFromCoords({ battleState, coords });
      if (enemy) {
        firstInRows.push(coords);
      }
      if (enemy && enemy.health > 0) {
        firstUndownedInRows.push(coords);
        return;
      };
    };
  });

  const firstInRowsToUse: [number, number][] = range(0, (battleState.size[1]-1)).flatMap((col) => {
    const firstUndownedInRow = firstUndownedInRows.filter((c) => c[1] === col);
    const firstInRow = firstInRows.filter((c) => c[1] === col);
    return firstUndownedInRow ?? firstInRow;
  }).filter((coords) => !!coords);

  return firstInRowsToUse;
};

export default getCoordsSetOfFirstInEnemyRows;