import type { GetPixiEventsArgs } from "@common/models/equipment";
import type { PixiEvent } from "@common/models/pixiEvent";
import { genId } from "../utils/random";
import { LAYERED_ANIMATED_STATES } from "@common/enums";

const moveIntoPixiEvents = (args: GetPixiEventsArgs): PixiEvent[] => {
  const { actionResolved, delayFromRoot } = args;

  const outcome = actionResolved.outcomes?.[0];
  const targetsId = outcome?.userId;
  const coordsNext = outcome?.moveTo;
  if (!targetsId || !coordsNext) return [];

  return [{
      id: genId(),
      functionName: 'changeFighterState',
      delay: delayFromRoot,
      args: { targetsId, fighterState: LAYERED_ANIMATED_STATES.RESTING }
    }, {
    id: genId(),
    functionName: 'moveSpot',
    delay: (delayFromRoot + 100),
    args: {
      targetsId,
      coordsNext
    }
  }];
};

export default moveIntoPixiEvents;