import type BattleState from "@common/models/battleState";
import type ActionResolved from "../../../models/actionResolved";
import type Action from "@common/models/action";
import type Outcome from "@common/models/outcome";
import commandsIntoActions from "./commandsIntoActions";
import cloneBattleState from "@common/functions/cloneBattleState";
import sortActions from "./sortActions";
import resolveAction from "./resolveAction";
import resolveAlterationActive from "./resolveAlterationActive";
import { ALTERATION_SUB_COMMAND_RESOLVED } from "@common/constants";

const performCommands = (battleState: BattleState) => {
  const actions = commandsIntoActions(cloneBattleState(battleState));

  const actionsResolved: ActionResolved[] = [];
  let newBattleState: BattleState = { ...battleState };
  let actionsRemaining = [ ...actions ];
  let delayFromRoot = 0;

  if (actionsRemaining.length === 0) {
    return performRoundJuncture({
      battleState: newBattleState,
      actionsResolved,
      delayFromRoot,
      roundTimings: ['battleStart', 'roundStart']
    });
  };

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

    if (actionsRemaining.length === 0) {
      return performRoundJuncture({
        battleState: newBattleState,
        actionsResolved,
        delayFromRoot,
        roundTimings: ['roundEnd']
      });
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
  if (!action) throw Error(`performOneAction error: action not found.`);

  return {
    ...resolveAction({ battleState, action, delayFromRoot }),
    actions: sortedActions
  };
};

export const performRoundJuncture = (args: {
  battleState: BattleState,
  actionsResolved: ActionResolved[],
  delayFromRoot: number,
  roundTimings: ('usingAction' | 'targetedByAction' | 'roundStart' | 'roundEnd' | 'battleStart')[]
}): {
  battleState: BattleState,
  actionsResolved: ActionResolved[],
  delayFromRoot: number
} => {
  const { battleState, actionsResolved: actionsResolvedArgs, delayFromRoot, roundTimings } = args;
  const actionsResolved = [...actionsResolvedArgs];
  let newBattleState = cloneBattleState(battleState);

  const outcomesResolved: Outcome[] = [];
  Object.values(newBattleState.alterationsActive).forEach((alterationActive) => {
    const results = resolveAlterationActive({
      battleState,
      alterationActive,
      roundTimings
    });
    if (!results) return;

    newBattleState = results.newBattleState;

    if (results.newAlterationActive) {
      const newResults = resolveAlterationActive({
        battleState: newBattleState,
        alterationActive: results.newAlterationActive,
        roundTimings
      });
      if (newResults) {
        newBattleState = newResults.newBattleState;
        // If the new alteration active immediately expires, no need to add to battle state
        if (newResults.alterationActive.extent > 0) {
          newBattleState.alterationsActive[newResults.alterationActive.id] = newResults.alterationActive;
        };
        outcomesResolved.push(newResults.outcomePerformed);
      }
      else {
        newBattleState.alterationsActive[results.newAlterationActive.id] = results.newAlterationActive;
        console.log(`newBattleState`, newBattleState);
      };
    };
    
    if (results.alterationActive.extent === 0) {
      delete newBattleState.alterationsActive[alterationActive.id];
    }
    else {
      newBattleState.alterationsActive[results.alterationActive.id] = results.alterationActive;
    };
    outcomesResolved.push(results.outcomePerformed);
    actionsResolved.push({
      commandId: ALTERATION_SUB_COMMAND_RESOLVED,
      delayFromRoot,
      outcomes: outcomesResolved
    });
  });

  if (roundTimings.length === 1 && roundTimings[0] === 'roundEnd') {
    return performRoundJuncture({
      battleState: newBattleState,
      actionsResolved,
      delayFromRoot,
      roundTimings: ['roundStart']
    })
  }

  return {
    battleState: newBattleState,
    actionsResolved,
    delayFromRoot
  };
};

export default performCommands;
