import type BattleState from "@common/models/battleState";
import type Fighter from "@common/models/fighter";
import { ALTERATIONS } from "@common/enums";

const getSpeedEffective = (args: {
  battleState: BattleState
  fighter: Fighter
}) => {
  const { battleState, fighter } = args;
  let speedEffective = fighter.speed;
  Object.values(battleState.alterationsActive).forEach((aa) => {
    if (aa.ownedBy === fighter.id) {
      if (aa.alterationId === ALTERATIONS.QUICK) speedEffective += aa.extent;
      if (aa.alterationId === ALTERATIONS.LAG) speedEffective -= aa.extent;
    };
  });

  return speedEffective;
};

export default getSpeedEffective;