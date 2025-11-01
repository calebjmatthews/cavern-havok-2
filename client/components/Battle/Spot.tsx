import { useMemo } from "react";

import getFighterIdFromCoords from "@common/functions/positioning/getFighterIdFromCoords";
import type BattleState from "@common/models/battleState";
import { BATTLE_UI_STATES } from "@client/enums";
const BAS = BATTLE_UI_STATES;

export default function Spot(props: {
  coords: [number, number],
  uiState: BATTLE_UI_STATES,
  battleState: BattleState,
  targetOptions: [number, number][],
  targetSelected: [number, number] | null,
  setTargetSelected: (nextTargetSelected: [number, number]) => void
}) {
  const { coords, uiState, battleState, targetOptions, targetSelected, setTargetSelected } = props;

  const occupiedById = useMemo(() => (
    getFighterIdFromCoords({ battleState, coords })
  ), [battleState, coords]);
  const occupiedBy = useMemo(() => (
    battleState.fighters[occupiedById || '']
  ), [battleState, occupiedById]);
  const canTarget = useMemo(() => (
    targetOptions.some((to) => to[0] === coords[0] && to[1] === coords[1])
  ), [coords, targetOptions]);
  const isTargetSelected = useMemo(() => (
    targetSelected?.[0] === coords[0] && targetSelected?.[1] === coords[1]
  ), [coords, targetSelected]);

  const spotClassName = useMemo(() => {
    let className = 'battle-spot';
    if (isTargetSelected) className = `${className} target-selected`;
    else if (uiState === BAS.TARGET_SELECT && canTarget) className = `${className} can-target`;
    return className;
  }, [uiState, canTarget, isTargetSelected]);

  const clickSpot = () => {
    if (canTarget) setTargetSelected(coords);
  };

  return (
    <div
      id={`c${coords[0]}-r${coords[1]}-spot`}
      className={spotClassName}
      onClick={clickSpot}
    >
      {occupiedBy && (<>
        <div>{occupiedBy.name}</div>
        <div>{`H: ${occupiedBy.health}/${occupiedBy.healthMax}`}</div>
        <div>{`C: ${occupiedBy.charge}`}</div>
      </>)}
    </div>
  )
};