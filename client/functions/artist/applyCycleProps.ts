import * as PIXI from 'pixi.js';

import type Cycle from '@client/models/artist/cycle';
import type CycleLayer from '@client/models/artist/cycleLayer';

const applyCycleLayerProps = (
  pixiAnimatedSprite: PIXI.AnimatedSprite,
  cycleLayer: CycleLayer,
  cycle: Cycle
) => {
  pixiAnimatedSprite.zIndex = cycleLayer.zIndex;
  if (cycleLayer.isPrimary) {pixiAnimatedSprite.loop = Boolean(cycle.loop);}
  if (cycleLayer.tint) pixiAnimatedSprite.tint = cycleLayer.tint;

  if ((cycle.angles || cycle.offsets || cycle.opacities) && cycle.spriteNames.length > 1) {
    pixiAnimatedSprite.angle = cycle.angles?.[0] ?? 0;
    pixiAnimatedSprite.position = cycle.offsets?.[0] ?? { x: 0, y: 0 };
    pixiAnimatedSprite.alpha = cycle.opacities?.[0] ?? 1;

    pixiAnimatedSprite.onFrameChange = ((frame) => {
      const angle = cycle.angles?.[frame];
      if (angle) pixiAnimatedSprite.angle = angle;
      const offset = cycle.offsets?.[frame];
      if (offset) pixiAnimatedSprite.position = offset;
      const opacity = cycle.opacities?.[frame];
      if (opacity) pixiAnimatedSprite.alpha = opacity;
    });
  }
  else {
    pixiAnimatedSprite.angle = cycle.angles?.[0] ?? 0;
    pixiAnimatedSprite.position = cycle.offsets?.[0] ?? { x: 0, y: 0 };
    pixiAnimatedSprite.alpha = cycle.opacities?.[0] ?? 1;
  };

  return pixiAnimatedSprite;
};

export default applyCycleLayerProps;