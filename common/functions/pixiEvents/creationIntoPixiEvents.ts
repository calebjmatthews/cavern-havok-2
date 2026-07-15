import type { GetPixiEventsArgs } from "@common/models/equipment";
import type { PixiEvent } from "@common/models/pixiEvent";
import { genId } from "../utils/random";
import { FINISHING_DURATION_DEFAULT, INTERVAL_DURATION_DEFAULT } from "@common/constants";

const creationIntoPixiEvents = (args: GetPixiEventsArgs) => {
  const {
    actionResolved, delayFromRoot, intervalDuration: intervalDurationArg,
    finishingDuration: finishingDurationArg,
  } = args;
  const intervalDuration = intervalDurationArg ?? INTERVAL_DURATION_DEFAULT;
  const finishingDuration = finishingDurationArg ?? FINISHING_DURATION_DEFAULT;
  const outcomes = actionResolved.outcomes;
  const pixiEvents: PixiEvent[] = [];

  outcomes.forEach((outcome, index) => {
    const outcomeDelay = delayFromRoot + (intervalDuration * index);
    if (outcome.madeObstacle) {
      pixiEvents.push({
        id: genId(),
        functionName: 'drawObstacle',
        delay: outcomeDelay,
        args: {
          obstacle: outcome.madeObstacle
        }
      })
    };
  });

  const duration = (intervalDuration * outcomes.length) + finishingDuration;
  return {
    pixiEvents,
    duration
  }
};

export default creationIntoPixiEvents;