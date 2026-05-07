import * as PIXI from 'pixi.js';

import type CycleLayer from '@client/models/artist/cycleLayer';
import getAnimationTextures from './getAnimationTextures';
import applyCycleLayerProps from './applyCycleProps';

const layerIntoPixiSpriteAnimated = (cycleLayer?: CycleLayer, initialState?: string) => {
  if (!cycleLayer || !initialState) throw Error('Missing data for layerIntoPixiSpriteAnimated');
  const cycle = cycleLayer?.layers[initialState];
  if (!cycle) throw Error(`Missing cycle for: ${JSON.stringify(this)}`);

  const textures = getAnimationTextures(cycle);
  const pixiAnimatedSprite = new PIXI.AnimatedSprite(textures);

  return applyCycleLayerProps(pixiAnimatedSprite, cycleLayer, cycle);
};

export default layerIntoPixiSpriteAnimated