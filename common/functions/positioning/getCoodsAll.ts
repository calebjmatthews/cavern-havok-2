import type BattleState from "@common/models/battleState";
import range from "../utils/range";

const getCoordsAll = (battleState: BattleState): [number, number][] => (
  range(0, ((battleState.size[0] * 2)-1)).flatMap((colIndex) => (
    range(0, (battleState.size[1]-1)).map((rowIndex) => {
      const coords: [number, number] = [colIndex, rowIndex];
      return coords;
    })
  ))
);

export default getCoordsAll;