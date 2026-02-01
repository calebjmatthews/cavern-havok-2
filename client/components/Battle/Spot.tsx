import { useMemo } from "react";

import type BattleState from "@common/models/battleState";
import type ActionResolved from "@common/models/actionResolved";
import type Outcome from "@common/models/outcome";
import type { Modal } from "@client/models/modal";
import getOccupantFromCoords from "@common/functions/positioning/getOccupantFromCoords";
import SpotOccupant from "./SpotOccupant";
import getPixelScale from "@client/functions/getPixelScale";
import { genId } from "@common/functions/utils/random";
import { MODAL_KINDS } from "@client/enums";

export default function Spot(props: {
  coords: [number, number],
  battleState: BattleState,
  battleStateFuture: BattleState | null,
  actionsResolvedFuture: ActionResolved[] | null,
  targetOptions: [number, number][],
  targetSelected: [number, number] | null,
  setTargetSelected: (nextTargetSelected: [number, number]) => void,
  targetsStaticallySelected: [number, number][],
  setModalToAdd: (modal: Modal) => void
}) {
  const { coords, battleState, battleStateFuture, actionsResolvedFuture, targetOptions, 
    targetSelected, setTargetSelected, targetsStaticallySelected, setModalToAdd } = props;

  const occupiedBy = useMemo(() => (
    getOccupantFromCoords({ battleState, coords })
  ), [battleState]);
  
  const { occupantFuture, occupantAffectedFuture, occupantActingFuture } = useMemo(() => {
    const occupantFuture = battleStateFuture?.fighters?.[occupiedBy?.id || ''];

    if (!occupiedBy || !battleStateFuture || !actionsResolvedFuture || !occupantFuture) {
      return { occupantFuture: null, occupantAffectedFuture: null, occupantActingFuture: null };
    }

    const occupantAffectedFuture: Outcome[] = [];
    actionsResolvedFuture.forEach((scrf) => {
      scrf.outcomes.forEach((outcome) => {
        if (outcome.affectedId === occupiedBy.id) occupantAffectedFuture.push(outcome);
      });
    });

    const occupantActingFuture: Outcome[] = [];
    actionsResolvedFuture.forEach((scrf) => {
      scrf.outcomes.forEach((outcome) => {
        if (outcome.userId === occupiedBy.id) occupantActingFuture.push(outcome);
      });
    });

    return { occupantFuture, occupantAffectedFuture, occupantActingFuture };
  }, [occupiedBy, battleStateFuture]);

  const canTarget = useMemo(() => (
    targetOptions.some((to) => to[0] === coords[0] && to[1] === coords[1])
  ), [coords, targetOptions]);

  const isTargetSelected = useMemo(() => (
    (targetSelected?.[0] === coords[0] && targetSelected?.[1] === coords[1])
    || (JSON.stringify(targetsStaticallySelected).includes(JSON.stringify(coords)))
  ), [coords, targetSelected]);

  const terrainClassName = useMemo(() => {
    let className = 'spot-terrain-sprite';
    if (isTargetSelected) className = `${className} target-selected`;
    else if (canTarget) {
      className = `${className} can-target`;
    }
    return className;
  }, [canTarget, isTargetSelected]);

  const clickSpot = () => {
    if (canTarget) setTargetSelected(coords);
    else if (occupiedBy) {
      setModalToAdd({
        id: genId(),
        kind: MODAL_KINDS.OCCUPANT_DETAIL,
        battleState,
        battleStateFuture: battleStateFuture ?? undefined,
        occupant: occupiedBy
      });
    }
  };

  const pixelScale = getPixelScale(window.innerWidth);

  return (
    <div
      id={`c${coords[0]}-r${coords[1]}-spot`}
      className='battle-spot'
      style={{ width: 27 * pixelScale, height: 21 * pixelScale }}
      onClick={clickSpot}
    >
      <img className={terrainClassName} src="/public/sprites/dirt.png" />
      {occupiedBy && (
        <SpotOccupant
          occupant={occupiedBy}
          occupantFuture={occupantFuture}
          occupantAffectedFuture={occupantAffectedFuture}
          occupantActingFuture={occupantActingFuture}
          battlefieldSize={battleState.size}
          canTarget={canTarget}
          isTargetSelected={isTargetSelected}
        />
      )}
    </div>
  )
};