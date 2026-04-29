import type AnimationType from "@client/models/artist/animationType"
import random from '@common/functions/utils/random';
import { ANIMATION_TYPES } from "@client/enums";
import { ANIMATION_GRAVITY } from "@common/constants";

const DURATION = 1500;
const VY_STARTING = -1600;
const VX_STARTING = 1200;

const cinderTreasure: AnimationType = {
  id: ANIMATION_TYPES.CINDER_TREASURE,
  duration: DURATION,
  interval: 1,
  getVxStarting: () => (-VX_STARTING + (random() * (VX_STARTING * 2))),
  getVyStarting: () => (VY_STARTING * 0.7 + (random() * VY_STARTING * 0.6)), 
  getPosition: (animation, elapsed) => {
    if (elapsed > DURATION || !animation.ix || !animation.iy || !animation.px || !animation.py
    || !animation.vx || !animation.vy) {
      return { x: -1000, y: -1000 };
    }

    animation.px += (animation.vx / 1000);
    animation.vx *= 0.97;
    
    animation.vy += (ANIMATION_GRAVITY / 12);
    animation.py += (animation.vy / 1000);

    // If at or below a bit below final vertical position, bounce
    if (animation.py >= (animation.iy + 20)) {
      animation.vy = -1 * animation.vy * 0.6;
    }
    
    return { x: animation.px, y: animation.py };
  }
};

export default cinderTreasure;