import type AnimationType from "@client/models/artist/animationType"
import type Animation from "@client/models/artist/animation";
import { ANIMATION_TYPES } from "@client/enums";

const DROP_DURATION = 1500;
const DROP_VY_STARTING = 3600;
const GRAVITY = 500;

const dropFromAbove: AnimationType = {
  id: ANIMATION_TYPES.DROP_FROM_ABOVE,
  duration: DROP_DURATION,
  interval: 1,
  getVyStarting: (pixelScale: number) => (DROP_VY_STARTING * pixelScale), 
  getPosition: (args: {
    animation: Animation,
    elapsed: number,
    pixelScale: number
  }) => {
    const { animation, elapsed, pixelScale } = args;
    if (elapsed > DROP_DURATION || !animation.ix || !animation.iy || !animation.py || !animation.vy) {
      return { x: animation.ix ?? 0, y: animation.iy ?? 0 };
    }
    
    animation.vy += (GRAVITY * pixelScale);
    animation.py += (animation.vy / 1000);

    // If at or below final vertical position, bounce
    if ((animation.py >= animation.iy) && animation.vy > 0) {
      animation.py = animation.iy;
      if (Math.abs(animation.vy) > (DROP_VY_STARTING / 10)) {
        animation.vy = -1 * animation.vy * 0.5;
      }
    }
    
    return { x: animation.ix, y: animation.py };
  },
  getOpacity: (elapsed, animation) => {
    const { duration } = animation;
    const percentComplete = elapsed / (duration ?? DROP_DURATION);
    if (percentComplete < 0.1) return percentComplete * 10;
    return 1;
  }
};

export default dropFromAbove;