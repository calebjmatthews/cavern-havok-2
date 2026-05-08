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
  if (!cycle.durations) {
    pixiAnimatedSprite.animationSpeed = .075;
  };
  if (cycle.angle) {
    pixiAnimatedSprite.angle = cycle.angle;
  }
  else if (pixiAnimatedSprite.angle !== 0) {
    pixiAnimatedSprite.angle = 0;
  }

  if (cycle.offsets && cycle.spriteNames.length > 1) {
    if (cycle.offsets[0]) pixiAnimatedSprite.position = cycle.offsets[0];
    pixiAnimatedSprite.onFrameChange = ((frame) => {
      const offset = cycle.offsets?.[frame];
      if (!offset) throw Error(`Missing offset in ${JSON.stringify(cycle)}`);
      pixiAnimatedSprite.position = offset;
    });
  }
  else if (cycle.offsets?.[0]) {
    pixiAnimatedSprite.position = cycle.offsets[0];
  }
  else {
    pixiAnimatedSprite.position = { x: 0, y: 0 };
  }

  return pixiAnimatedSprite;
};

export default applyCycleLayerProps;