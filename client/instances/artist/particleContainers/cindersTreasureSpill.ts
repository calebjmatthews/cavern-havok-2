import * as PIXI from 'pixi.js';

import type AnimationType from "@client/models/artist/animationType";
import Animation from "@client/models/artist/animation";
import range from "@common/functions/utils/range";
import getSpritePath from '@client/functions/artist/getSpritePath';
import random from '@common/functions/utils/random';
import { ANIMATION_TYPES } from "@client/enums";
import { PARTICLE_KINDS } from '@common/enums';

const DURATION = 2000;

const cindersTreasureSpill: AnimationType = {
  id: ANIMATION_TYPES.CINDERS_TREASURE_SPILL,
  duration: DURATION,
  interval: 1,
  getParticlesToCreate: (animation: Animation) => {
    const lastTickAt = animation.lastTickAt ?? 0;
    const particlesCreatedCount = animation.particlesCreatedCount ?? 0;
    const particleCountFinal = animation.particleCountFinal ?? 100;
    if (particlesCreatedCount >= particleCountFinal) return null;

    const frequency = 1 / ((animation.particleCountFinal ?? 100) / (DURATION / 2));
    let countToCreate = (Date.now() > lastTickAt + frequency) ? 1 : 0;

    const sinceLastCreation = (lastTickAt === 0) ? 1 : Date.now() - lastTickAt;
    if (frequency < sinceLastCreation) {
      countToCreate = Math.round(sinceLastCreation / frequency);
    }

    if (countToCreate <= 0) return null;
    
    return range(0, Math.floor(countToCreate - 1)).map(() => (new PIXI.Particle({
      texture: PIXI.Texture.from(getSpritePath(PARTICLE_KINDS.CINDER_TREASURE)),
      x: -1000,
      y: -1000,
    })));
  },
  particleContainerDynamicProperties: {
    position: true,
    uvs: true,
    color: true
  },
  getParticleAnimation: (animation: Animation, _elapsed: number, animationType: AnimationType) => {
    if (!animationType?.getVxStarting || !animationType?.getVyStarting) {
      throw Error('Missing CINDER_TREASURE animation type.');
    }
    const ix = (animation.ix ?? 0) + (-10 + random() * 20);
    return new Animation({
      type: ANIMATION_TYPES.CINDER_TREASURE,
      targets: animation.targets,
      ix,
      iy: animation.iy,
      px: ix,
      py: animation.iy,
      vx: animationType.getVxStarting(),
      vy: animationType.getVyStarting()
    }, cindersTreasureSpill)
  }
};

export default cindersTreasureSpill;