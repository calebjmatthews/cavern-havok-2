import { useMemo } from "react";

import getOccupantFromCoords from "@common/functions/positioning/getOccupantFromCoords";
import type BattleState from "@common/models/battleState";
import SpotOccupant from "./SpotOccupant";

export default function Spot(props: {
  coords: [number, number],
  battleState: BattleState,
  targetOptions: [number, number][],
  targetSelected: [number, number] | null,
  setTargetSelected: (nextTargetSelected: [number, number]) => void,
  targetsStaticallySelected: [number, number][]
}) {
  const { coords, battleState, targetOptions, targetSelected, setTargetSelected,
    targetsStaticallySelected } = props;

  const occupiedBy = useMemo(() => (
    getOccupantFromCoords({ battleState, coords })
  ), [battleState]);
  const canTarget = useMemo(() => (
    targetOptions.some((to) => to[0] === coords[0] && to[1] === coords[1])
  ), [coords, targetOptions]);
  const isTargetSelected = useMemo(() => (
    (targetSelected?.[0] === coords[0] && targetSelected?.[1] === coords[1])
    || (JSON.stringify(targetsStaticallySelected).includes(JSON.stringify(coords)))
  ), [coords, targetSelected]);

  
  const spotClassName = useMemo(() => {
    let className = 'battle-spot';
    if (isTargetSelected) className = `${className} target-selected`;
    else if (canTarget) {
      className = `${className} can-target`;
    }
    return className;
  }, [canTarget, isTargetSelected]);

  const clickSpot = () => {
    if (canTarget) setTargetSelected(coords);
  };

  return (
    <div
      id={`c${coords[0]}-r${coords[1]}-spot`}
      className={spotClassName}
      onClick={clickSpot}
    >
      {occupiedBy && <SpotOccupant occupant={occupiedBy} />}
    </div>
  )
};