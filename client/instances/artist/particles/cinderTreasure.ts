import type AnimationType from "@client/models/artist/animationType";
import type Animation from "@client/models/artist/animation";
import random from '@common/functions/utils/random';
import { ANIMATION_TYPES } from "@client/enums";

const DURATION = 1500;
const VY_STARTING = -2000;
const VX_STARTING = 1200;
const GRAVITY = 98;

const cinderTreasure: AnimationType = {
  id: ANIMATION_TYPES.CINDER_TREASURE,
  duration: DURATION,
  interval: 1,
  getVxStarting: (pixelScale: number) => (
    (-VX_STARTING + (random() * (VX_STARTING * 2))) * pixelScale
  ),
  getVyStarting: (pixelScale: number) => (
    (VY_STARTING * 0.7 + (random() * VY_STARTING * 0.6)) * pixelScale
  ), 
  getPosition: (args: {
    animation: Animation,
    elapsed: number,
    pixelScale: number
  }) => {
    const { animation, elapsed, pixelScale } = args;
    if (elapsed > DURATION || !animation.ix || !animation.iy || !animation.px || !animation.py
    || !animation.vx || !animation.vy) {
      return { x: -1000, y: -1000 };
    }

    animation.px += (animation.vx / 1000);
    animation.vx *= 0.97;
    
    animation.vy += (GRAVITY * pixelScale);
    animation.py += (animation.vy / 1000);

    // If at or below a bit below final vertical position, bounce
    if (animation.py >= (animation.iy + 20) && animation.vy > 0) {
      animation.vy = -1 * animation.vy * 0.6;
    }
    
    return { x: animation.px, y: animation.py };
  },
  getOpacity: (elapsed) => {
    const percentComplete = elapsed / DURATION;
    if (percentComplete < .8) return 1;
    return (1 - ((percentComplete - .8) * 5));
  }
};

export default cinderTreasure;