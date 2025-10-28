import type BattleState from "@common/models/battleState";
import type ActionResolved from '../../../models/actionResolved';
import type Action from "@common/models/action";
import sortActions from "./sortActions";
import commandsIntoActions from "./commandsIntoActions";
import resolveAction from "./resolveAction";

const performCommands = (battleState: BattleState) => {
  const commands = Object.values(battleState.commandsPending);
  const actions = commandsIntoActions({ battleState, commands });

  const actionsResolved: ActionResolved[] = [];
  let newBattleState: BattleState = { ...battleState };
  let actionsRemaining = [ ...actions ];
  let delayFromRoot = 0;

  for (let looper = 0; looper < 1000; looper++) {
    const result = performOneAction({
      battleState: newBattleState,
      actions: actionsRemaining,
      delayFromRoot
    });
    newBattleState = result.battleState;
    actionsResolved.push(result.actionResolved);
    delayFromRoot += result.durationTotal;
    actionsRemaining = result.actions.slice(1);

    if (actionsRemaining.length === 0) return {
      battleState: newBattleState,
      actionsResolved
    };
  };
  throw Error(`performCommands error: infinite commands for battle ID${battleState.battleId}`);
};

const performOneAction = (args: {
  battleState: BattleState,
  actions: Action[],
  delayFromRoot: number
}) => {
  const { battleState, delayFromRoot } = args;

  const sortedActions = sortActions(args);
  const action = sortedActions[0];
  if (!action) throw Error(`performOneAction error: command not found.`);

  return { ...resolveAction({ battleState, action, delayFromRoot }), actions: sortedActions };
};

export default performCommands;
