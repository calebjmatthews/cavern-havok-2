import type Outcome from "@common/models/outcome";
import type Fighter from "@common/models/fighter";
import type Obstacle from "@common/models/obstacle";
import type Creation from "@common/models/creation";
import type { PixiEvent } from "@common/models/pixiEvent";
import { genId } from "../utils/random";

const moveIntoPixiEvents = (args: {
  outcome: Outcome,
  pixiEvents: PixiEvent[],
  target: Fighter | Obstacle | Creation | undefined,
  delayFromRoot: number
}) => {
  const { outcome, pixiEvents, target, delayFromRoot } = args;
  const coordsNext = outcome?.moveTo;
  if (!target || !coordsNext) return pixiEvents;

  pixiEvents.push({
    id: genId(),
    functionName: 'moveSpot',
    delay: (delayFromRoot + 200),
    args: { targetsId: target.id, coordsNext }
  });

  return pixiEvents;
};

export default moveIntoPixiEvents;