import type BattleState from "@common/models/battleState";
import range from "../utils/range";
import getOccupantFromCoords from "./getOccupantFromCoords";

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
      const enemy = getOccupantFromCoords({ battleState, coords });
      if ((enemy?.health || -1) > 0) {
        firstInRows.push(coords);
        return;
      };
    };
  });

  return firstInRows;
};

export default getCoordsSetOfFirstInEnemyRows;