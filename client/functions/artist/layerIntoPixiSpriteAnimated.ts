import * as PIXI from 'pixi.js';

import type CycleLayer from '@client/models/artist/cycleLayer';
import getAnimationTextures from './getAnimationTextures';
import randomFrom from '@common/functions/utils/randomFrom';
import readyAnimatedSprite from './readyAnimatedSprite';
import { ANIMATION_SPEED } from '@common/constants';

const layerIntoPixiSpriteAnimated = (cycleLayer?: CycleLayer, initialState?: string) => {
  if (!cycleLayer || !initialState) throw Error('Missing data for layerIntoPixiSpriteAnimated');
  const cycleOrCycles = cycleLayer?.layers[initialState];
  const cycle = Array.isArray(cycleOrCycles) ? randomFrom(cycleOrCycles) : cycleOrCycles;
  if (!cycle) return;

  const textures = getAnimationTextures(cycle);
  const pixiAnimatedSpriteRaw = new PIXI.AnimatedSprite(textures);
  pixiAnimatedSpriteRaw.animationSpeed = ANIMATION_SPEED;

  const pixiAnimatedSprite = readyAnimatedSprite(pixiAnimatedSpriteRaw, cycleLayer, cycle);

  return pixiAnimatedSprite;
};

export default layerIntoPixiSpriteAnimated