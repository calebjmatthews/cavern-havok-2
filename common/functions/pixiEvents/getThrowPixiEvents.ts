import type { PixiEvent } from "@common/models/pixiEvent";
import type { GetPixiEventsArgs } from "@common/models/equipment"
import { genId } from "../utils/random";
import { ANIMATION_SPEED, DELAY_BEFORE_DAMAGED_DEFAULT, INTERVAL_DURATION_DEFAULT } from "@common/constants";
import { ANIMATION_TYPES } from "@client/enums";

const createAnimatedSpriteLabel: 'createAnimatedSprite' = 'createAnimatedSprite';

const getThrowPixiEvents = (args: GetPixiEventsArgs): PixiEvent[] => {
  const { 
    actionResolved, delayFromRoot, delayBeforeDamaged: delayBeforeDamagedArg,
    intervalDuration: intervalDurationArg, index, equipmentId
  } = args;
  const outcomes = actionResolved.outcomes;
  const intervalDuration = intervalDurationArg ?? INTERVAL_DURATION_DEFAULT;
  
  const outcome = index !== undefined ? outcomes[index] : null;
  if (!outcome || index === undefined) return [];

  const firstDelay = delayFromRoot + (40 / ANIMATION_SPEED) + (intervalDuration * index);
  const secondDelay = delayFromRoot + (60 / ANIMATION_SPEED) + (intervalDuration * index);

  const pixiEvents: PixiEvent[] = [];

  if (!outcome.userId || !outcome.affectedId) return pixiEvents;

  pixiEvents.push({
    id: genId(),
    functionName: 'createAnimatedSprite',
    delay: firstDelay,
    args: {
      targetsId: outcome.userId,
      spriteNames: ['throw_swish.png'],
      offsets: [{ x: 4, y: -20 }],
      opacities: [0.8],
      durationOverall: 300,
      animationTypeId: ANIMATION_TYPES.DRIFT_AND_FADE,
      animationOptions: { vxStarting: (1200 * 3), vyStarting: (4000 * 3) }
    }
  });

  if (equipmentId) {
    pixiEvents.push(...[
      {
        id: genId(),
        functionName: createAnimatedSpriteLabel,
        delay: firstDelay,
        args: {
          targetsId: outcome.userId,
          spriteNames: [`${equipmentId?.toLowerCase()}.png`],
          offsets: [{ x: 8, y: -6 }],
          durationOverall: 1000,
          animationTypeId: ANIMATION_TYPES.MOVE,
          animationOptions: { vxStarting: (-1200 * 3), vyStarting: (-3200 * 3) }
        }
      }, {
        id: genId(),
        functionName: createAnimatedSpriteLabel,
        delay: secondDelay,
        args: {
          targetsId: outcome.affectedId,
          spriteNames:  [`${equipmentId?.toLowerCase()}.png`],
          offsets: [{ x: 10, y: 4 }],
          angles: [180],
          durationOverall: 1000,
          animationTypeId: ANIMATION_TYPES.REGRESS,
          animationOptions: { vxStarting: (-300 * 3), vyStarting: (-800 * 3) }
        }
      }
    ]);
  };

  return pixiEvents;
};

export default getThrowPixiEvents;