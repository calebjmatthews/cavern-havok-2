import type { PixiEvent } from "@common/models/pixiEvent";
import type { GetPixiEventsArgs } from "@common/models/equipment";
import getChangedFighterState from "./getChangedFighterDefaultState";
import getSwingPixiEvent from "./getSwingPixiEvent";
import getThrowPixiEvents from "./getThrowPixiEvents";
import attackIntoPixiEvents from "./attackIntoPixiEvents";
import defendIntoPixiEvents from "./defendIntoPixiEvents";
import moveIntoPixiEvents from "./moveIntoPixiEvents";
import { genId } from "../utils/random";
import {
  DELAY_BEFORE_DAMAGED_DEFAULT, INTERVAL_DURATION_DEFAULT, FINISHING_DURATION_DEFAULT,
  HEALTH_BAR_TRANSITION_DURATION
} from "@common/constants";
import { ANIMATION_TYPES } from "@client/enums";

const actionIntoPixiEvents = (args: GetPixiEventsArgs) => {
  const { 
    actionResolved, battleState, battleStateNew, delayFromRoot, actorState, swishFunctionName,
    delayBeforeDamaged: delayBeforeDamagedArg, intervalDuration: intervalDurationArg,
    finishingDuration: finishingDurationArg, isLunge
  } = args;
  const outcomes = actionResolved.outcomes;
  const command = battleState.commandsPending[actionResolved.commandId];
  const user = battleState.fighters[command?.fromId ?? ''];
  const equipmentId = [...(user?.equipped ?? []), ...(user?.inventory ?? [])]
  .filter((p) => p.id === command?.pieceId)?.[0]?.equipmentId;
  const delayBeforeDamaged = delayBeforeDamagedArg ?? DELAY_BEFORE_DAMAGED_DEFAULT;
  const intervalDuration = intervalDurationArg ?? INTERVAL_DURATION_DEFAULT;
  const finishingDuration = finishingDurationArg ?? FINISHING_DURATION_DEFAULT;

  let pixiEvents: PixiEvent[] = [];
  outcomes.forEach((outcome, index) => {
    const outcomeDelay = delayFromRoot + (intervalDuration * index);
    const outcomeDelayBeforeDamaged = outcomeDelay + delayBeforeDamaged
      + (intervalDuration * index);
    const target = (
      battleState.fighters[outcome.affectedId ?? '']
      ?? battleState.obstacles[outcome.affectedId ?? '']
      ?? battleState.creations[outcome.affectedId ?? '']
    );
    // Change actor state
    if (actorState && outcome.userId) pixiEvents.push({
      id: genId(),
      functionName: 'changeFighterState',
      delay: outcomeDelay,
      args: { targetsId: outcome.userId, fighterState: actorState }
    });

    pixiEvents = attackIntoPixiEvents({
      outcome, pixiEvents, target, outcomeDelayBeforeDamaged, outcomeDelay, isLunge
    });
    pixiEvents = defendIntoPixiEvents({
      outcome, pixiEvents, target, delayFromRoot
    });
    pixiEvents = moveIntoPixiEvents({
      outcome, pixiEvents, target, delayFromRoot
    });
    
    // Display swish, and other effects as defined by the equipment
    if (swishFunctionName === 'getSwingPixiEvent') {
      const swingPixiEvent = getSwingPixiEvent({ ...args, index });
      if (swingPixiEvent) pixiEvents.push(swingPixiEvent);
    }
    else if (swishFunctionName === 'getThrowPixiEvents') {
      pixiEvents.push(...getThrowPixiEvents({ ...args, index, equipmentId }))
    };

    // Possibly change default state depending on final health
    const targetNew = (
      battleStateNew.fighters[outcome?.affectedId ?? '']
      || battleStateNew.obstacles[outcome?.affectedId ?? '']
    );
    if (!target || !(outcome.sufferedDamage || outcome.wasHealed)) return;
    if (target.occupantKind === 'fighter' && targetNew?.occupantKind === 'fighter') {
      const outcomeDelay = (
        delayFromRoot + (intervalDuration * (outcomes.length - 1)) + delayBeforeDamaged
      );
      const changedFighterDefaultState = getChangedFighterState({
        battleState: battleStateNew, fighter: target, fighterNew: targetNew
      });
      if (changedFighterDefaultState) pixiEvents.push({
        id: genId(),
        functionName: 'changeFighterState',
        delay: outcomeDelay,
        args: { targetsId: target.id, fighterState: changedFighterDefaultState }
      });
    };
    
    if (target.occupantKind === 'obstacle' && !targetNew) {
      const outcomeDelay = delayFromRoot + (intervalDuration * (outcomes.length - 1));
      const outcomeDelayBeforeDamaged = outcomeDelay + delayBeforeDamaged
        + (intervalDuration * (outcomes.length - 1));
      pixiEvents.push({
        id: genId(),
        functionName: 'applyAnimation',
        delay: outcomeDelayBeforeDamaged,
        args: { targetsId: target.id, animationTypeId: ANIMATION_TYPES.FADE_AWAY }
      });
      pixiEvents.push({
        id: genId(),
        functionName: 'removeContainer',
        delay: outcomeDelayBeforeDamaged + HEALTH_BAR_TRANSITION_DURATION,
        args: { targetsId: target.id }
      });
    };
  });

  const duration = (intervalDuration * outcomes.length) + finishingDuration;

  return { pixiEvents, duration };
};

export default actionIntoPixiEvents;