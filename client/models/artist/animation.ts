import type AnimationType from "./animationType";
import { genId } from '@common/functions/utils/random';

export default class Animation implements AnimationInterface {
  id: string;
  type: string;
  startedAt: number = Date.now();
  expiresAt: number;
  targets: string;
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
  };
};

interface AnimationInterface {
  id?: string;
  type: string;
  startedAt?: number;
  expiresAt?: number;
  targets: string;
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