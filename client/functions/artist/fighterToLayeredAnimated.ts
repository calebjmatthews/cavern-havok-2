import type Fighter from "@common/models/fighter";
import type CycleLayer from "@client/models/artist/cycleLayer";
import LayeredAnimated from "@client/models/artist/layeredAnimated";
import cycleLayers from "@client/instances/artist/cycleLayers";
import { SPRITE_NAMES } from "@client/enums";
import { LAYERED_ANIMATED_STATES } from "@common/enums";
const LAS = LAYERED_ANIMATED_STATES;

// spriteNames: string[];
// durations?: number[];
// offsets?: { x: number, y: number }[];
// rotations?: number[];
// loop?: boolean;

const fighterToLayeredAnimated = (fighter: Fighter) => {
  const cycleLayersForFighter: CycleLayer[] = [];
  fighter.equipped.forEach((piece) => {
    const cycleLayer = cycleLayers[piece.equipmentId];
    if (cycleLayer) cycleLayersForFighter.push(cycleLayer);
  });

  return new LayeredAnimated({
    id: fighter.id,
    intialState: LAS.RESTING,
    cycleLayers: cycleLayersForFighter
  });
};

export default fighterToLayeredAnimated;