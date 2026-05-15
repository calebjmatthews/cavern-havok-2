import type Fighter from "@common/models/fighter";
import type CycleLayer from "@client/models/artist/cycleLayer";
import LayeredAnimated from "@client/models/artist/layeredAnimated";
import cycleLayers from "@client/instances/artist/cycleLayers";
import cycleLayersToPixis from './cycleLayersToPixis';
import cycleLayersToSpriteMap from "./cycleLayersToSpriteMap";
import { LAYERED_ANIMATED_STATE_DEFAULT } from "@common/constants";

const fighterToLayeredAnimatedAndPixis = (fighter: Fighter) => {
  const cycleLayerArray = createCycleLayerArray(fighter);

  const { pixiContainer, pixiAnimatedSpriteMap } = cycleLayersToPixis(
    { cycleLayerArray, containerId: fighter.id, state: LAYERED_ANIMATED_STATE_DEFAULT }
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

export const fighterToCycleLayersAndPixi = (args: { fighter: Fighter, state: string }) => {
  const { fighter, state } = args;
  const cycleLayerArray = createCycleLayerArray(fighter);
  const pixiAnimatedSpriteMap = cycleLayersToSpriteMap(
    { cycleLayerArray, containerId: fighter.id, state }
  );
  return { cycleLayerArray, pixiAnimatedSpriteMap };
};

const createCycleLayerArray = (fighter: Fighter) => {
  const cycleLayerArray: CycleLayer[] = [];
  const slotsFilled: { [slot: string] : boolean } = {};
  fighter.equipped.reverse().forEach((piece) => {
    const cycleLayer = cycleLayers[piece.equipmentId];
    // ToDo: Handle arrays of cycleLayers
    if (cycleLayer && !slotsFilled[cycleLayer.slot]) {
      cycleLayerArray.push(cycleLayer);
      slotsFilled[cycleLayer.slot] = true;
    };
  });

  return cycleLayerArray;
};

export default fighterToLayeredAnimatedAndPixis;