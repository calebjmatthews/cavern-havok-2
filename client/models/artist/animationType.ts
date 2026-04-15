import type Animation from './animation';

export default interface AnimationType {
  id: string;
  duration: number;
  interval?: number;
  getVxStarting?: () => number;
  getVyStarting?: () => number;
  getPosition?: (animation: Animation, elapsed: number) => { x: number, y: number };
};