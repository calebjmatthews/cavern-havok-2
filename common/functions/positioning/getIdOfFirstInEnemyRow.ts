import type BattleState from "@common/models/battleState";
import range from "../utils/range";
import getOccupantFromCoords from "./getOccupantFromCoords";

/**
 * Grid positioning for default size of [5, 5]
 * 4 
 * 3
 * 2
 * 1
 * 0
 *   0 1 2 3 4 | 5 6 7 8 9
 */

const getIdOfFirstInEnemyRow = (args: {
  battleState: BattleState,
  userId: string,
  rowIndex: number
}) => {
  const { battleState, userId, rowIndex } = args;
  const user = battleState.fighters[userId];
  if (!user) throw Error(`getCoordsOfFirstInEnemyRow error: Missing user ID${userId}`);
  
  const sideWidth = battleState.size[0];
  const rowCoordsSet: [number, number][] = (user.side === 'A')
  //? range(5, 9).map((columnIndex) => [columnIndex, rowIndex])
    ? range(sideWidth, (sideWidth * 2 - 1)).map((columnIndex) => [columnIndex, rowIndex])
  //: range(4, 0, -1).map((columnIndex) => [columnIndex, rowIndex]);
    : range((sideWidth - 1), 0, -1).map((columnIndex) => [columnIndex, rowIndex]);
  for (let index = 0; index < rowCoordsSet.length; index++) {
    const coords = rowCoordsSet[index];
    if (coords) {
      const enemy = getOccupantFromCoords({ battleState, coords });
      console.log(`getIdOfFirstInEnemyRow; coords: ${coords}; enemy: `, enemy);
      if (enemy && enemy.health > 0) return enemy.id;
    };
  };
  
  return undefined;
};

export default getIdOfFirstInEnemyRow;