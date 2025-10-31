import getFighterIdFromCoords from "@common/functions/positioning/getFighterIdFromCoords";
import type BattleState from "@common/models/battleState";

export default function Spot(props: {
  coords: [number, number],
  battleState: BattleState
}) {
  const { coords, battleState } = props;

  const occupiedById = getFighterIdFromCoords({ battleState, coords });
  const occupiedBy = battleState.fighters[occupiedById || ''];

  return (
    <div id={`c${coords[0]}-r${coords[1]}-spot`} className="battle-spot">
      {occupiedBy && (<>
        <div>{occupiedBy.name}</div>
        <div>{`H: ${occupiedBy.health}/${occupiedBy.healthMax}`}</div>
        <div>{`C: ${occupiedBy.charge}`}</div>
      </>)}
    </div>
  )
};