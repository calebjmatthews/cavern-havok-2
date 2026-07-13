import * as PIXI from 'pixi.js';

import type AnimationType from "@client/models/artist/animationType";
import Animation from "@client/models/artist/animation";
import range from "@common/functions/utils/range";
import { ANIMATION_TYPES } from "@client/enums";

const DURATION = 2000;
const X_OFFSET = -20;

const defenseNumbers: AnimationType = {
  id: ANIMATION_TYPES.DEFENSE_NUMBERS,
  duration: DURATION,
  interval: 1,
  particleAnimationType: ANIMATION_TYPES.DEFENSE_NUMBER,
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
          y: animation.iy,
          tint: '#7bc8ea'
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
    if (!animationType?.getVxStarting || !texture) throw Error('Missing DEFENSE_NUMBER data.');
    const totalWidth = (texture.width - 1) * totalCount * pixelScale;
    const singleWidth = (texture.width - 1) * pixelScale * index;
    const ix = Math.round((animation.ix ?? 0) - (totalWidth / 2) + singleWidth);
    const px = Math.round(X_OFFSET * pixelScale + ix);
    const iy = Math.round((animation.iy ?? 0) - (texture.height / 1.5) * pixelScale);
    console.log(`animationType.getVxStarting(pixelScale)`, animationType.getVxStarting(pixelScale));
    return new Animation({
      type: ANIMATION_TYPES.DEFENSE_NUMBER,
      targets: animation.targets,
      ix,
      iy,
      px,
      py: iy,
      vx: animationType.getVxStarting(pixelScale)
    }, defenseNumbers);
  }
};

export default defenseNumbers;