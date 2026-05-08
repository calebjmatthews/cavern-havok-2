import * as PIXI from 'pixi.js';

import type Cycle from '@client/models/artist/cycle';
import type CycleLayer from '@client/models/artist/cycleLayer';
import getAnimationTextures from './getAnimationTextures';
import applyCycleLayerProps from './applyCycleProps';

const readyAnimatedSprite = (
  pixiAnimatedSprite: PIXI.AnimatedSprite,
  cycleLayer: CycleLayer,
  cycle: Cycle
) => {
  const textures = getAnimationTextures(cycle);
  pixiAnimatedSprite.stop();
  pixiAnimatedSprite.currentFrame = 0;

  pixiAnimatedSprite.textures = textures;
  pixiAnimatedSprite = applyCycleLayerProps(pixiAnimatedSprite, cycleLayer, cycle);

  pixiAnimatedSprite.play();

  return pixiAnimatedSprite;
};

export default readyAnimatedSprite;