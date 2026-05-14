import * as PIXI from 'pixi.js';

import type CycleLayer from "@client/models/artist/cycleLayer";
import layerIntoPixiSpriteAnimated from './layerIntoPixiSpriteAnimated';

const cycleLayersToPixis = (args: {
  cycleLayerArray: CycleLayer[],
  state: string
}) => {
  const { cycleLayerArray, state } = args;
  cycleLayerArray.sort((a, b) => {
    if (a.isPrimary || b.isPrimary) return (a.isPrimary ? -10000 : 10000);
    return a.zIndex - b.zIndex;
  });
  
  const pixiContainer = new PIXI.Container();
  const pixiAnimatedSpriteMap: { [cycleLayerId: string]: PIXI.AnimatedSprite } = {};
  cycleLayerArray.forEach((cycleLayer) => {
    const pixiAnimatedSprite = layerIntoPixiSpriteAnimated(cycleLayer, state);
    if (pixiAnimatedSprite) pixiContainer.addChild(pixiAnimatedSprite);
  });

  return { pixiContainer, pixiAnimatedSpriteMap };
};

export default cycleLayersToPixis;