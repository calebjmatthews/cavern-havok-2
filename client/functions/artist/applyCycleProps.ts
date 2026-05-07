import * as PIXI from 'pixi.js';

import type Cycle from '@client/models/artist/cycle';
import type CycleLayer from '@client/models/artist/cycleLayer';

const applyCycleLayerProps = (
  pixiAnimatedSprite: PIXI.AnimatedSprite,
  cycleLayer: CycleLayer,
  cycle: Cycle
) => {
  pixiAnimatedSprite.zIndex = cycleLayer.zIndex;
  if (cycleLayer.tint) pixiAnimatedSprite.tint = cycleLayer.tint;
  if (cycle.offsets?.[0]) pixiAnimatedSprite.position = cycle.offsets[0];
  if (!cycle.durations) {
    pixiAnimatedSprite.animationSpeed = .075;
  }

  return pixiAnimatedSprite;
};

export default applyCycleLayerProps;