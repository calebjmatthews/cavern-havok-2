import type BattleState from "../../models/battleState";
import getOccupantIdFromCoords from "./getOccupantIdFromCoords";
import range from "../utils/range";

const getCoordsOnSide = (args: {
  battleState: BattleState,
  side: 'A' | 'B',
  onlyOpenSpaces?: boolean
}) => {
  const { battleState, side, onlyOpenSpaces } = args;
  const coordsSet: [number, number][] = [];

  const columnIndexes: [number, number] = (side === 'A')
    ? [0, (battleState.size[0] - 1)]
    : [battleState.size[0], ((battleState.size[0] * 2 ) - 1)]
  range(columnIndexes[0], columnIndexes[1]).forEach((col) => {
    range(0, (battleState.size[1] - 1)).forEach((row) => {
      if (onlyOpenSpaces) {
        const occupantId = getOccupantIdFromCoords({ battleState, coords: [col, row] });
        if (!occupantId) coordsSet.push([col, row]);
      }
      else {
        coordsSet.push([col, row]);
      }
    });
  });

  return coordsSet;
};

export default getCoordsOnSide;