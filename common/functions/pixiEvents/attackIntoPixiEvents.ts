import type { PixiEvent } from "@common/models/pixiEvent";
import type { GetPixiEventsArgs } from "@common/models/equipment";
import getHealthNumberProps from "@client/functions/artist/getHealthNumberProps";
import getChangedFighterState from "./getChangedFighterDefaultState";
import { genId } from "../utils/random";
import { LAYERED_ANIMATED_STATES } from "@common/enums";
import { ANIMATION_SPEED } from "@common/constants";
import { ANIMATION_TYPES } from "@client/enums";

const LAS = LAYERED_ANIMATED_STATES;
const DELAY_BEFORE_DAMAGED_DEFAULT = (30 / ANIMATION_SPEED);
const INTERVAL_DURATION_DEFAULT = (20 / ANIMATION_SPEED);
const FINISHING_DURATION_DEFAULT = (40 / ANIMATION_SPEED);

// Also need separate PixiEvent creation for command selection, e.g. readying weapon

const attackIntoPixiEvents = (args: GetPixiEventsArgs) => {
  const { 
    actionResolved, battleState, battleStateNew, attackerState,
    delayBeforeDamaged: delayBeforeDamagedArg, intervalDuration: intervalDurationArg,
    finishingDuration: finishingDurationArg
  } = args;
  const outcomes = actionResolved.outcomes;
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
    if (outcome.userId) pixiEvents.push({
      id: genId(),
      functionName: 'createAnimatedSprite',
      delay: outcomeDelayBeforeDamaged,
      args: {
        targetsId: outcome.userId,
        spriteNames: ['swing_swish.png'],
        offsets: [{ x: - 6, y: -5 }],
        opacities: [0.8],
        durationOverall: 300,
        animationTypeId: ANIMATION_TYPES.DRIFT_AND_FADE
      }
    });
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