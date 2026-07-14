import type { GetPixiEventsArgs } from "@common/models/equipment";
import type { PixiEvent } from "@common/models/pixiEvent";
import { genId } from "../utils/random";
import { LAYERED_ANIMATED_STATES } from "@common/enums";
import { OUTCOME_DURATION_DEFAULT } from "@common/constants";

const moveIntoPixiEvents = (args: GetPixiEventsArgs) => {
  const { actionResolved, delayFromRoot } = args;

  const outcome = actionResolved.outcomes?.[0];
  const targetsId = outcome?.userId;
  const coordsNext = outcome?.moveTo;
  const pixiEvents: PixiEvent[] = [];
  if (!targetsId || !coordsNext) return {
    pixiEvents,
    duration: OUTCOME_DURATION_DEFAULT
  };

  pixiEvents.push({
    id: genId(),
    functionName: 'changeFighterState',
    delay: delayFromRoot,
    args: { targetsId, fighterState: LAYERED_ANIMATED_STATES.RESTING }
  });
  pixiEvents.push({
    id: genId(),
    functionName: 'moveSpot',
    delay: (delayFromRoot + 100),
    args: {
      targetsId,
      coordsNext
    }
  });

  return {
    pixiEvents,
    duration: OUTCOME_DURATION_DEFAULT
  };
};

export default moveIntoPixiEvents;