import type { PixiEvent } from "@common/models/pixiEvent";
import type { GetPixiEventsArgs } from "@common/models/equipment";
import getHealthNumberProps from "@client/functions/artist/getHealthNumberProps";
import getChangedFighterState from "./getChangedFighterDefaultState";
import { genId } from "../utils/random";
import { LAYERED_ANIMATED_STATES } from "@common/enums";
import {
  DELAY_BEFORE_DAMAGED_DEFAULT, INTERVAL_DURATION_DEFAULT, FINISHING_DURATION_DEFAULT
} from "@common/constants";
import { ANIMATION_TYPES } from "@client/enums";
import getSwingPixiEvent from "./getSwingPixiEvent";
import getThrowPixiEvents from "./getThrowPixiEvents";

const LAS = LAYERED_ANIMATED_STATES;

// Also need separate PixiEvent creation for command selection, e.g. readying weapon

const attackIntoPixiEvents = (args: GetPixiEventsArgs) => {
  const { 
    actionResolved, battleState, battleStateNew, attackerState, swishFunctionName,
    delayBeforeDamaged: delayBeforeDamagedArg, intervalDuration: intervalDurationArg,
    finishingDuration: finishingDurationArg
  } = args;
  console.log(`args`, args);
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
    const outcomeDelay = intervalDuration * index;
    const outcomeDelayBeforeDamaged = outcomeDelay + delayBeforeDamaged;
      + (intervalDuration ?? INTERVAL_DURATION_DEFAULT * index);
    // Change attacker state
    if (attackerState && outcome.userId) pixiEvents.push({
      id: genId(),
      functionName: 'changeFighterState',
      delay: outcomeDelay,
      args: { targetsId: outcome.userId, fighterState: attackerState }
    });

    // Change target state to damaged depending on defense + damage
    if (outcome.affectedId && (outcome.sufferedDamage ?? 0) > 1) pixiEvents.push({
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
        ...getHealthNumberProps(outcome.damage)
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
  });

  // Possibly change default state depending on final health
  const outcomeMain = outcomes[outcomes.length-1];
  const target = battleState.fighters[outcomeMain?.affectedId ?? ''];
  const targetNew = battleStateNew.fighters[outcomeMain?.affectedId ?? ''];
  if (target && targetNew) {
    const changedFighterDefaultState = getChangedFighterState({
      battleState: battleStateNew, fighter: target, fighterNew: targetNew
    });
    if (changedFighterDefaultState) pixiEvents.push({
      id: genId(),
      functionName: 'changeFighterState',
      delay: delayBeforeDamaged ?? DELAY_BEFORE_DAMAGED_DEFAULT,
      args: { targetsId: target.id, fighterState: changedFighterDefaultState }
    });
  };

  const duration = (intervalDuration * outcomes.length) + finishingDuration;

  return { pixiEvents, duration };
};

export default attackIntoPixiEvents;