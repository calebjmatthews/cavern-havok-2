import * as PIXI from 'pixi.js';

import type Animation from './animation';

export default interface AnimationType {
  id: string;
  duration: number;
  interval?: number;
  getVxStarting?: () => number;
  getVyStarting?: () => number;
  getPosition?: (animation: Animation, elapsed: number) => { x: number, y: number };
  getOpacity?: (elapsed: number) => number;
  getParticlesToCreate?: (animation: Animation, elapsed: number, animationType: AnimationType)
    => PIXI.IParticle[] | null;
  particleContainerDynamicProperties?: (PIXI.ParticleProperties & Record<string, boolean>);
  getParticleAnimation?: (animation: Animation, elapsed: number, animationType: AnimationType)
    => Animation
};