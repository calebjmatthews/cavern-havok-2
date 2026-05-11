import type Fighter from "@common/models/fighter";
import type CycleLayer from "@client/models/artist/cycleLayer";
import LayeredAnimated from "@client/models/artist/layeredAnimated";
import cycleLayers from "@client/instances/artist/cycleLayers";
import { LAYERED_ANIMATED_STATE_DEFAULT } from "@common/constants";

const fighterToLayeredAnimated = (fighter: Fighter) => {
  console.log(`fighter`, fighter);
  const cycleLayersForFighter: CycleLayer[] = [];
  fighter.equipped.forEach((piece) => {
    const cycleLayer = cycleLayers[piece.equipmentId];
    if (cycleLayer) cycleLayersForFighter.push(cycleLayer);
  });

  return new LayeredAnimated({
    id: fighter.id,
    state: LAYERED_ANIMATED_STATE_DEFAULT,
    stateDefault: LAYERED_ANIMATED_STATE_DEFAULT,
    cycleLayers: cycleLayersForFighter
  });
};

export default fighterToLayeredAnimated;