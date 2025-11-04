import type BattleState from "@common/models/battleState";
import type Action from "@common/models/action";
import { ACTION_PRIORITIES } from "@common/enums";

const priorityMap = {
  [ACTION_PRIORITIES.FIRST]: 1,
  [ACTION_PRIORITIES.SECOND]: 2,
  // If undefined, use as a default: 3,
  [ACTION_PRIORITIES.PENULTIMATE]: 4,
  [ACTION_PRIORITIES.LAST]: 5
}

const sortActions = (args: {
  battleState: BattleState,
  actions: Action[]
}) => {
  const { battleState, actions } = args;

  return [...actions].sort((a, b) => {
    let aActionPriority = a.priority ? priorityMap[a.priority] : 3;
    let bActionPriority = b.priority ? priorityMap[b.priority] : 3;

    if (aActionPriority !== bActionPriority) return (
      ((aActionPriority - bActionPriority) < 0) ? -1 : 1
    );
    
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