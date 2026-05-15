import * as PIXI from 'pixi.js';

import type CycleLayer from "@client/models/artist/cycleLayer";
import layerIntoPixiSpriteAnimated from './layerIntoPixiSpriteAnimated';

const cycleLayersToSpriteMap = (args: {
  cycleLayerArray: CycleLayer[],
  containerId: string,
  state: string,
}) => {
  const { cycleLayerArray, containerId, state } = args;
  cycleLayerArray.sort((a, b) => {
    if (a.isPrimary || b.isPrimary) return (a.isPrimary ? -10000 : 10000);
    return a.zIndex - b.zIndex;
  });
  
  const pixiAnimatedSpriteMap: { [cycleLayerId: string]: PIXI.AnimatedSprite } = {};
  cycleLayerArray.forEach((cycleLayer) => {
    const pixiAnimatedSprite = layerIntoPixiSpriteAnimated(cycleLayer, state);
    if (pixiAnimatedSprite) {
      pixiAnimatedSpriteMap[`${containerId}|${cycleLayer.id}`] = pixiAnimatedSprite;
    };
  });

  return pixiAnimatedSpriteMap;
};

export default cycleLayersToSpriteMap;