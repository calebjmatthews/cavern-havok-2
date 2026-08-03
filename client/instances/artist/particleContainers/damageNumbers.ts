import * as PIXI from 'pixi.js';

import type AnimationType from "@client/models/artist/animationType";
import Animation from "@client/models/artist/animation";
import range from "@common/functions/utils/range";
import random from '@common/functions/utils/random';
import { ANIMATION_TYPES } from "@client/enums";

const DURATION = 2000;

const damageNumbers: AnimationType = {
  id: ANIMATION_TYPES.DAMAGE_NUMBERS,
  duration: DURATION,
  interval: 1,
  particleAnimationType: ANIMATION_TYPES.DAMAGE_NUMBER,
  getParticlesToCreate: (animation: Animation) => {
    const { particleSpriteNames, particleCountFinal, particlesCreatedCount } = animation;
    if (!particleSpriteNames || !particleCountFinal) return null;
    // Particles should only be created once; if they already have been, do nothing
    if ((particlesCreatedCount ?? 0) >= particleCountFinal) return null;

    const particles: PIXI.Particle[] = [];
    // Create one particle per number being shown
    range(0, Math.floor(particleCountFinal - 1)).forEach((index) => {
      const spriteName = particleSpriteNames[index];
      if (spriteName) particles.push(
        new PIXI.Particle({
          texture: PIXI.Texture.from(spriteName),
          x: animation.ix,
          y: animation.iy
        })
      );
    });

    return (particles.length > 0) ? particles : null;
  },
  particleContainerDynamicProperties: {
    position: true,
    uvs: true,
    color: true
  },
  getParticleAnimation: (args: {
    animation: Animation,
    animationType: AnimationType,
    index: number,
    totalCount: number,
    pixelScale: number
  }) => {
    const { animation, animationType, index, totalCount, pixelScale } = args;
    const spriteName = animation.particleSpriteNames?.[index];
    const texture = PIXI.Texture.from(spriteName ?? '');
    if (!animationType?.getVyStarting || !texture) throw Error('Missing DAMAGE_NUMBER data.');
    const totalWidth = (texture.width - 1) * totalCount * pixelScale;
    const singleWidth = (texture.width - 1) * pixelScale * index;
    const ix = Math.round((animation.ix ?? 0) - (totalWidth / 2) + singleWidth);
    const iy = Math.round((animation.iy ?? 0) - (texture.height / 1.5) * pixelScale);
    return new Animation({
      type: ANIMATION_TYPES.DAMAGE_NUMBER,
      targets: animation.targets,
      ix,
      iy,
      px: ix,
      py: iy,
      vy: animationType.getVyStarting(pixelScale),
      vx: 0.5 - random()
    }, damageNumbers);
  }
};

export default damageNumbers;