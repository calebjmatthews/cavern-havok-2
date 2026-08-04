import type { PixiEvent } from "@common/models/pixiEvent";
import type { GetPixiEventsArgs } from "@common/models/equipment"
import { genId } from "../utils/random";
import { DELAY_BEFORE_DAMAGED_DEFAULT, INTERVAL_DURATION_DEFAULT } from "@common/constants";
import { ANIMATION_TYPES } from "@client/enums";

const getSwingPixiEvent = (args: GetPixiEventsArgs): PixiEvent | null => {
  const { 
    actionResolved, delayFromRoot, delayBeforeDamaged: delayBeforeDamagedArg,
    intervalDuration: intervalDurationArg, index
  } = args;
  const outcomes = actionResolved.outcomes;
  const delayBeforeDamaged = delayBeforeDamagedArg ?? DELAY_BEFORE_DAMAGED_DEFAULT;
  const intervalDuration = intervalDurationArg ?? INTERVAL_DURATION_DEFAULT;
  
  const outcome = index !== undefined ? outcomes[index] : null;
  if (!outcome || index === undefined) return null;

  const outcomeDelay = delayFromRoot + (intervalDuration * index);
  const outcomeDelayBeforeAffected = outcomeDelay + delayBeforeDamaged;
  if (outcome.userId) return {
    id: genId(),
    functionName: 'createAnimatedSprite',
    delay: outcomeDelayBeforeAffected,
    args: {
      targetsId: outcome.userId,
      spriteNames: ['swing_swish.png'],
      offsets: [{ x: - 6, y: -5 }],
      opacities: [0.8],
      durationOverall: 300,
      animationTypeId: ANIMATION_TYPES.DRIFT_AND_FADE
    }
  };
  
  return null;
};

export default getSwingPixiEvent;