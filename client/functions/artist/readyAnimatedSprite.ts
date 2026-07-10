import * as PIXI from 'pixi.js';

import type Cycle from '@client/models/artist/cycle';
import type CycleLayer from '@client/models/artist/cycleLayer';
import getAnimationTextures from './getAnimationTextures';
import applyCycleLayerProps from './applyCycleProps';

const readyAnimatedSprite = (
  pixiAnimatedSprite: PIXI.AnimatedSprite,
  cycle: Cycle,
  cycleLayer?: CycleLayer
) => {
  const textures = getAnimationTextures(cycle);
  pixiAnimatedSprite.stop();
  pixiAnimatedSprite.currentFrame = 0;

  pixiAnimatedSprite.textures = textures;
  pixiAnimatedSprite = applyCycleLayerProps(pixiAnimatedSprite, cycle, cycleLayer);
  if (cycle.loop !== undefined) pixiAnimatedSprite.loop = cycle.loop;

  pixiAnimatedSprite.play();

  return pixiAnimatedSprite;
};

export default readyAnimatedSprite;