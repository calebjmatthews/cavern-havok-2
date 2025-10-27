import type BattleState from "@common/models/battleState";
import areCoordsOutOfBounds from "./areCoordsOutOfBounds";
import areCoordsInSide from "./areCoordsInSide";
import areCoordsOpen from "./areCoordsOpen";

/**
 * Grid positioning for default size of [5, 5], origin = [2, 3], min: 2, max: 3
 * 4 X X   X X |
 * 3 X   O   X | x
 * 2 X X   X X |
 * 1   X X X   |
 * 0     X     |
 *   0 1 2 3 4 | 5 6 7 8 9
 */
const getSurroundingSpaces = (args: {
  battleState: BattleState,
  origin: [number, number],
  min: number,
  max: number,
  onlyInSide?: 'A'|'B',
  onlyOpenSpaces?: boolean
}) => {
  const { battleState, origin, min, max, onlyInSide, onlyOpenSpaces } = args;
  const spaces: [number, number][] = [];
  
  for (let distance = min; distance <= max; distance++) {
    const coordsSet = getSurroundingCoords({ origin, distance });
    coordsSet.filter((coords) => (
      (!areCoordsOutOfBounds({ battleState, coords }))
      && (!onlyInSide || (
        areCoordsInSide({ battleState, coords, side: onlyInSide })
      ))
      && (!onlyOpenSpaces || (
        areCoordsOpen({ battleState, coords })
      ))
    )).forEach((coords) => spaces.push(coords));
  };

  return spaces;
};

// origin: [2, 3], distance: 1 => [[2, 4],  [3, 3], [2, 2],   [1, 3]]
//                          i.e. [[0, +1], [+1, 0], [0, -1], [-1, 0]]
// origin: [2, 3], distance: 2 => [[2, 5],   [3, 4],   [4, 3],  [3, 2],  [2, 1],  [1, 2], [0, 3], [1, 4]]
// i.e.                           [[0, +2], [+1, +1], [+2, 0], [+1, -1], [0, -2], [-1, -1] ...]
const getSurroundingCoords = (args: { origin: [number, number], distance: number }) => {
  const { origin, distance } = args;
  const [ox, oy] = origin;
  const coords: [number, number][] = [];

  // start at the top of the diamond
  let x = ox;
  let y = oy + distance;

  // walk the perimeter clockwise
  for (let i = 0; i < distance; i++) { coords.push([x + i, y - i]); } // upper-right
  for (let i = 0; i < distance; i++) { coords.push([ox + distance - i, oy - i]); } // right-down
  for (let i = 0; i < distance; i++) { coords.push([x - i, oy - distance + i]); } // lower-left
  for (let i = 0; i < distance; i++) { coords.push([ox - distance + i, y - distance + i]); } // left-up

  return coords;
}

export default getSurroundingSpaces;