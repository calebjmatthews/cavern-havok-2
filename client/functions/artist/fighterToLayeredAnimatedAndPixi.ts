import * as PIXI from 'pixi.js';

import type Fighter from "@common/models/fighter";
import type CycleLayer from "@client/models/artist/cycleLayer";
import LayeredAnimated from "@client/models/artist/layeredAnimated";
import cycleLayers from "@client/instances/artist/cycleLayers";
import cycleLayersToPixi from './cycleLayersToPixis';
import { LAYERED_ANIMATED_STATE_DEFAULT } from "@common/constants";

const fighterToLayeredAnimatedAndPixis = (fighter: Fighter) => {
  const cycleLayerArray: CycleLayer[] = [];
  fighter.equipped.forEach((piece) => {
    const cycleLayer = cycleLayers[piece.equipmentId];
    // ToDo: Handle arrays of cycleLayers
    if (cycleLayer) cycleLayerArray.push(cycleLayer);
  });

  const { pixiContainer, pixiAnimatedSpriteMap } = cycleLayersToPixi(
    { cycleLayerArray, state: LAYERED_ANIMATED_STATE_DEFAULT }
  );

  return {
    layeredAnimated: new LayeredAnimated({
      id: fighter.id,
      state: LAYERED_ANIMATED_STATE_DEFAULT,
      stateDefault: LAYERED_ANIMATED_STATE_DEFAULT,
      cycleLayers: cycleLayerArray
    }),
    pixiContainer,
    pixiAnimatedSpriteMap
  };
};

export default fighterToLayeredAnimatedAndPixis;