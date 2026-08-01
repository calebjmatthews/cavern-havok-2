import type { PixiEvent } from "@common/models/pixiEvent";
import type { GetPixiEventsArgs } from "@common/models/equipment";
import getHealthNumberProps from "@client/functions/artist/getHealthNumberProps";
import getChangedFighterState from "./getChangedFighterDefaultState";
import getSwingPixiEvent from "./getSwingPixiEvent";
import getThrowPixiEvents from "./getThrowPixiEvents";
import { genId } from "../utils/random";
import { LAYERED_ANIMATED_STATES } from "@common/enums";
import {
  DELAY_BEFORE_DAMAGED_DEFAULT, INTERVAL_DURATION_DEFAULT, FINISHING_DURATION_DEFAULT,
  HEALTH_BAR_TRANSITION_DURATION
} from "@common/constants";
import { ANIMATION_TYPES } from "@client/enums";

const LAS = LAYERED_ANIMATED_STATES;

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

  const pixiEvents: PixiEvent[] = [];
  outcomes.forEach((outcome, index) => {
    const outcomeDelay = delayFromRoot + (intervalDuration * index);
    const outcomeDelayBeforeDamaged = outcomeDelay + delayBeforeDamaged
      + (intervalDuration * index);
    const target = battleState.fighters[outcome.affectedId ?? ''];
    // Change actor state
    if (actorState && outcome.userId) pixiEvents.push({
      id: genId(),
      functionName: 'changeFighterState',
      delay: outcomeDelay,
      args: { targetsId: outcome.userId, fighterState: actorState }
    });

    // Change target state to damaged depending on defense + damage
    if (
      outcome.affectedId && (outcome.sufferedDamage ?? 0) > 1 && target?.occupantKind === 'fighter'
    ) pixiEvents.push({
      id: genId(),
      functionName: 'changeFighterState',
      delay: outcomeDelayBeforeDamaged,
      args: { targetsId: outcome.affectedId, fighterState: LAS.DAMAGED }
    });

    // Add target animation depending on defense + damage
    if (outcome.affectedId && (outcome.sufferedDamage ?? 0) > 0) pixiEvents.push({
      id: genId(),
      functionName: 'applyAnimation',
      delay: outcomeDelayBeforeDamaged,
      args: { targetsId: outcome.affectedId, animationTypeId: ANIMATION_TYPES.WOBBLE }
    });

    // Display damage numbers
    if (outcome.affectedId && outcome.damage !== undefined) pixiEvents.push({
      id: genId(),
      functionName: 'createParticleContainer',
      delay: outcomeDelayBeforeDamaged,
      args: {
        targetsId: outcome.affectedId,
        particleContainerName: ANIMATION_TYPES.HEALTH_NUMBERS,
        targetMirrored: (target?.side ?? 'B') === 'A',
        ...getHealthNumberProps(outcome.damage, { inverted: true })
      }
    });
    
    // Display swish, and other effects as defined by the equipment
    if (swishFunctionName === 'getSwingPixiEvent') {
      const swingPixiEvent = getSwingPixiEvent({ ...args, index });
      if (swingPixiEvent) pixiEvents.push(swingPixiEvent);
    }
    else if (swishFunctionName === 'getThrowPixiEvents') {
      pixiEvents.push(...getThrowPixiEvents({ ...args, index, equipmentId }))
    };

    if (isLunge && outcome.userId) pixiEvents.push({
      id: genId(),
      functionName: 'applyAnimation',
      delay: outcomeDelay,
      args: {
        targetsId: outcome.userId,
        animationTypeId: ANIMATION_TYPES.LUNGE,
        animationOptions: { cx: -21, cy: -12 }
      },
    });
  });

  // Possibly change default state depending on final health
  const outcomeMain = outcomes[outcomes.length-1];
  const target = (
    battleState.fighters[outcomeMain?.affectedId ?? '']
    || battleState.obstacles[outcomeMain?.affectedId ?? '']
  );
  const targetNew = (
    battleStateNew.fighters[outcomeMain?.affectedId ?? '']
    || battleStateNew.obstacles[outcomeMain?.affectedId ?? '']
  );
  if (target) {
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
  };

  const duration = (intervalDuration * outcomes.length) + finishingDuration;

  return { pixiEvents, duration };
};

export default actionIntoPixiEvents;