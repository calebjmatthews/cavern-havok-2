import type AnimationType from "./animationType";
import { genId } from '@common/functions/utils/random';

export default class Animation implements AnimationInterface {
  id: string;
  type: string;
  targets: string;
  startedAt: number = Date.now();
  duration?: number;
  expiresAt?: number;
  infinite?: boolean;
  delayUntil?: number;
  lastTickAt?: number;
  ix?: number; // Initial X
  iy?: number; // Initial Y
  io?: number; // Initial offset
  is?: number; // Initial spin
  px?: number; // Position current  X
  py?: number; // Position current  Y
  vx?: number; // Velocity X
  vy?: number; // Velocity Y
  cx?: number; // Closing X
  cy?: number; // Closing Y
  particleSpriteNames?: string[];
  particleCountFinal?: number;
  particlesCreatedCount?: number;

  constructor(animation: AnimationInterface, animationType?: AnimationType) {
    Object.assign(this, animation);

    this.id = animation.id ?? genId();
    this.type = animation.type;
    if (!this.px && this.ix) this.px = this.ix; 
    if (!this.py && this.iy) this.py = this.iy;
    if (!animation.infinite) {
      this.expiresAt = animation.expiresAt ?? Date.now() + (
        animation?.duration ?? animationType?.duration ?? 0
      );
    };
    this.targets = animation.targets;
    if (animation.delayUntil) this.startedAt = animation.delayUntil;
  };
};

interface AnimationInterface {
  id?: string;
  type: string;
  targets: string;
  startedAt?: number;
  duration?: number;
  expiresAt?: number;
  infinite?: boolean;
  delayUntil?: number;
  lastTickAt?: number;
  ix?: number;
  iy?: number;
  io?: number;
  is?: number;
  px?: number;
  py?: number;
  vx?: number;
  vy?: number;
  cx?: number;
  cy?: number;
  particleSpriteNames?: string[];
  particleCountFinal?: number;
  particlesCreatedCount?: number;
};