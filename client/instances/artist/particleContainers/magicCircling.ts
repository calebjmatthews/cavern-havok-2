import * as PIXI from 'pixi.js';

import type AnimationType from "@client/models/artist/animationType";
import Animation from "@client/models/artist/animation";
import range from "@common/functions/utils/range";
import getSpritePath from '@client/functions/artist/getSpritePath';
import random from '@common/functions/utils/random';
import { ANIMATION_TYPES } from "@client/enums";

const DURATION = 2000;

const magicCircling: AnimationType = {
  id: ANIMATION_TYPES.CINDERS_TREASURE_SPILL,
  duration: DURATION,
  interval: 1,
  particleAnimationType: ANIMATION_TYPES.MAGIC_BIT,
  getParticlesToCreate: (animation: Animation) => {
    const { particleSpriteNames, particleCountFinal, particlesCreatedCount } = animation;
    if (!particleSpriteNames || !particleCountFinal) return null;
    
    // Particles should only be created once; if they already have been, do nothing
    if ((particlesCreatedCount ?? 0) >= particleCountFinal) return null;
    
    return range(0, Math.floor(particleCountFinal - 1)).map(() => (new PIXI.Particle({
      texture: PIXI.Texture.from(getSpritePath(particleSpriteNames[0] ?? '')),
      x: animation.ix,
      y: animation.iy
    })));
  },
  particleContainerDynamicProperties: {
    position: true,
    uvs: true,
    color: true
  },
  getParticleAnimation: (args: {
    animation: Animation,
    animationType: AnimationType,
    pixelScale: number,
    index: number,
    totalCount: number
  }) => {
    const { animation, index, totalCount } = args;
    return new Animation({
      type: ANIMATION_TYPES.MAGIC_BIT,
      targets: animation.targets,
      ix: animation.ix,
      iy: animation.iy,
      io: (index / totalCount),
      px: animation.ix,
      py: animation.iy,
    }, magicCircling);
  }
};

export default magicCircling;