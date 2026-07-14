import type BattleState from "@common/models/battleState";
import type Fighter from "@common/models/fighter";
import getFighterStateDefault from "./getFighterStateDefault";

// ToDo: Needs BattleState to determine whether fighter should be clenching or casting
const getChangedFighterState = (args: {
  battleState: BattleState,
  fighter: Fighter,
  fighterNew: Fighter
}) => {
  const { battleState, fighter, fighterNew } = args;
  const fighterStateDefault = getFighterStateDefault({ battleState, fighter });
  const fighterNextDefaultState = getFighterStateDefault({ battleState, fighter: fighterNew });
  if (fighterStateDefault !== fighterNextDefaultState) return fighterNextDefaultState;
  return null;
};

export default getChangedFighterState;