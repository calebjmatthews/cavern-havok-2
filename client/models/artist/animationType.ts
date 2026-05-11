import * as PIXI from 'pixi.js';

import type Animation from './animation';

export default interface AnimationType {
  id: string;
  duration: number;
  interval?: number;
  getVxStarting?: (pixelScale: number) => number;
  getVyStarting?: (pixelScale: number) => number;
  getPosition?: (args: {
    animation: Animation,
    elapsed: number,
    pixelScale: number
  }) => { x: number, y: number };
  getOpacity?: (elapsed: number) => number;
  getParticlesToCreate?: (animation: Animation, elapsed: number, animationType: AnimationType)
    => PIXI.Particle[] | null;
  particleContainerDynamicProperties?: (PIXI.ParticleProperties & Record<string, boolean>);
  getParticleAnimation?: (args: {
    animation: Animation,
    elapsed: number,
    animationType: AnimationType,
    pixelScale: number
  })
    => Animation
};