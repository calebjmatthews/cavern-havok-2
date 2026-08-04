import * as PIXI from 'pixi.js';

import type Animation from './animation';

export default interface AnimationType {
  id: string;
  duration?: number;
  infinite?: boolean;
  interval?: number;
  getVxStarting?: (pixelScale: number) => number;
  getVyStarting?: (pixelScale: number) => number;
  getPosition?: (args: {
    animation: Animation,
    elapsed: number,
    pixelScale: number
  }) => { x: number, y: number };
  getOpacity?: (elapsed: number, animation: Animation) => number;
  getTint?: (elapsed: number, animation: Animation) => string;
  getAngle?: (elapsed: number, animation: Animation) => number;
  particleAnimationType?: string;
  getParticlesToCreate?: (animation: Animation, elapsed: number, animationType: AnimationType)
    => PIXI.Particle[] | null;
  particleContainerDynamicProperties?: (PIXI.ParticleProperties & Record<string, boolean>);
  getParticleAnimation?: (args: {
    animation: Animation,
    elapsed: number,
    index: number,
    totalCount: number,
    animationType: AnimationType,
    pixelScale: number
  })
  => Animation
};