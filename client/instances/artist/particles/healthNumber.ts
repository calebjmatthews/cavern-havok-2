import type AnimationType from "@client/models/artist/animationType";
import type Animation from "@client/models/artist/animation";
import random from '@common/functions/utils/random';
import { ANIMATION_TYPES } from "@client/enums";

const DURATION = 1500;
const VY_STARTING = -2000;
const GRAVITY = 98;

const healthNumber: AnimationType = {
  id: ANIMATION_TYPES.HEALTH_NUMBER,
  duration: DURATION,
  interval: 1,
  getVyStarting: (pixelScale: number) => (
    (VY_STARTING * 0.9 + (random() * VY_STARTING * 0.2)) * pixelScale
  ), 
  getPosition: (args: {
    animation: Animation,
    elapsed: number,
    pixelScale: number
  }) => {
    const { animation, elapsed, pixelScale } = args;
    if (elapsed > DURATION || !animation.ix || !animation.iy || !animation.px || !animation.py
    || !animation.vy) {
      return { x: -1000, y: -1000 };
    }

    if (animation.py >= (animation.iy + 2)) return { x: animation.px, y: animation.py };
    
    animation.vy += (GRAVITY * pixelScale);
    animation.py += (animation.vy / 1000);
    
    return { x: animation.px, y: animation.py };
  },
  getOpacity: (elapsed) => {
    const percentComplete = elapsed / DURATION;
    if (percentComplete < .8) return 1;
    return (1 - ((percentComplete - .8) * 5));
  }
};

export default healthNumber;