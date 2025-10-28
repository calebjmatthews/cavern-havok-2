import type BattleState from "@common/models/battleState";
import type Action from "@common/models/action";
import { ACTION_PRIORITIES } from "@common/enums";

const sortActions = (args: {
  battleState: BattleState,
  actions: Action[]
}) => {
  const { battleState, actions } = args;

  return [...actions].sort((a, b) => {
    if (a.priority === ACTION_PRIORITIES.FIRST) return -1;
    if (b.priority === ACTION_PRIORITIES.FIRST) return 1;
    
    const anOutcomeA = a.outcomes[0];
    const anOutcomeB = b.outcomes[0];
    if (!anOutcomeA) throw Error(`sortCommands outcome from battle ID${battleState.battleId} not found.`);
    if (!anOutcomeB) throw Error(`sortCommands outcome from battle ID${battleState.battleId} not found.`);
    const fighterA = battleState.fighters[anOutcomeA.userId];
    const fighterB = battleState.fighters[anOutcomeB.userId];
    if (!fighterA) throw Error(`sortCommands fighter ID${anOutcomeA.userId} not found.`);
    if (!fighterB) throw Error(`sortCommands fighter ID${anOutcomeB.userId} not found.`);

    if (fighterA.speed > fighterB.speed) return -1;
    if (fighterB.speed > fighterA.speed) return 1;
    return Math.random() -0.5;
  });
};

export default sortActions;