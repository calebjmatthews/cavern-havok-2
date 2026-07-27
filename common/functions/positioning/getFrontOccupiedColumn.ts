import type BattleState from "@common/models/battleState";
import range from "../utils/range";
import areCoordsOpen from "./areCoordsOpen";

const getFrontOccupiedColumn = (args: {
  battleState: BattleState,
  side: 'A' | 'B',
  occupiedSpotsOnly?: boolean
}): [number, number][] => {
  const { battleState, side, occupiedSpotsOnly } = args;
  const sideWidth = battleState.size[0];
  const sideHeight = battleState.size[1];
  let occupiedColumnIndex = -1;
  const columnsToCheck = (side === 'A')
    ? range(0, (sideWidth-1))
    : range(sideWidth, ((sideWidth * 2)-1)).reverse();
  columnsToCheck.forEach((columnIndex) => {
    range(0, (sideHeight-1)).forEach((rowIndex) => {
      if (!areCoordsOpen({ battleState, coords: [columnIndex, rowIndex] })) {
        occupiedColumnIndex = columnIndex;
      };
    });
  });
  return range(0, (sideHeight-1)).map((rowIndex): [number, number] => ( [occupiedColumnIndex, rowIndex] ))
  .filter((coords) => !occupiedSpotsOnly || !areCoordsOpen({ battleState, coords }));
};

export default getFrontOccupiedColumn;