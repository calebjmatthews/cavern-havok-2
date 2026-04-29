import type AnimationType from "./animationType";
import { genId } from '@common/functions/utils/random';

export default class Animation implements AnimationInterface {
  id: string;
  type: string;
  targets: string;
  startedAt: number = Date.now();
  expiresAt: number;
  delayUntil?: number;
  lastTickAt?: number;
  ix?: number;
  iy?: number;
  px?: number;
  py?: number;
  vx?: number;
  vy?: number;
  particleCountFinal?: number;
  particlesCreatedCount?: number;

  constructor(animation: AnimationInterface, animationType?: AnimationType) {
    Object.assign(this, animation);

    this.id = animation.id ?? genId();
    this.type = animation.type;
    this.expiresAt = animation.expiresAt ?? Date.now() + (animationType?.duration ?? 0);
    this.targets = animation.targets;
    if (animation.delayUntil) this.startedAt = animation.delayUntil;
  };
};

interface AnimationInterface {
  id?: string;
  type: string;
  targets: string;
  startedAt?: number;
  expiresAt?: number;
  delayUntil?: number;
  lastTickAt?: number;
  ix?: number;
  iy?: number;
  px?: number;
  py?: number;
  vx?: number;
  vy?: number;
  particleCountFinal?: number;
  particlesCreatedCount?: number;
};