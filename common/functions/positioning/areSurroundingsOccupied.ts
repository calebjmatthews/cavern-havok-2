import type BattleState from "@common/models/battleState";
import getSurroundingSpaces from "./getSurroundingSpaces";
import getOccupantIdFromCoords from "./getOccupantIdFromCoords";

const areSurroundingsOccupied = (args: {
  battleState: BattleState,
  origin: [number, number],
  min: number,
  max: number,
  onlyInSide?: 'A'|'B',
  surroundingsFullyOccupied?: boolean
}) => {
  const { battleState, surroundingsFullyOccupied } = args;

  const surroundingSpaces = getSurroundingSpaces(args);
  const occupiedSpaces = surroundingSpaces.map((coords) => (
    getOccupantIdFromCoords({ battleState, coords })
  ));
  return surroundingsFullyOccupied
    ? surroundingSpaces.length === occupiedSpaces.length
    : occupiedSpaces.length > 0
};

export default areSurroundingsOccupied;