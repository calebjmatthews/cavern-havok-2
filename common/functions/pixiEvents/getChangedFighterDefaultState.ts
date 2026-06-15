import type BattleState from "@common/models/battleState";
import type Fighter from "@common/models/fighter";
import getFighterDefaultState from "./getFighterDefaultState";

// ToDo: Needs BattleState to determine whether fighter should be clenching or casting
const getChangedFighterState = (args: {
  battleState: BattleState,
  fighter: Fighter,
  fighterNew: Fighter
}) => {
  const { battleState, fighter, fighterNew } = args;
  const fighterDefaultState = getFighterDefaultState({ battleState, fighter });
  const fighterNextDefaultState = getFighterDefaultState({ battleState, fighter: fighterNew });
  if (fighterDefaultState !== fighterNextDefaultState) return fighterNextDefaultState;
  return null;
};

export default getChangedFighterState;