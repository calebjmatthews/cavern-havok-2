import type BattleState from "@common/models/battleState";
import type SubCommand from "@common/models/subCommand";
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
  subCommands: SubCommand[]
}) => {
  const { battleState, subCommands } = args;

  return [...subCommands].sort((a, b) => {
    let aActionPriority = a.priority ? priorityMap[a.priority] : 3;
    let bActionPriority = b.priority ? priorityMap[b.priority] : 3;

    if (aActionPriority !== bActionPriority) return (
      ((aActionPriority - bActionPriority) < 0) ? -1 : 1
    );
    
    const fighterA = battleState.fighters[a.userId];
    const fighterB = battleState.fighters[b.userId];
    if (!fighterA) throw Error(`sortCommands fighter ID${a.userId} not found.`);
    if (!fighterB) throw Error(`sortCommands fighter ID${b.userId} not found.`);

    if (fighterA.speed > fighterB.speed) return -1;
    if (fighterB.speed > fighterA.speed) return 1;
    return Math.random() -0.5;
  });
};

export default sortActions;