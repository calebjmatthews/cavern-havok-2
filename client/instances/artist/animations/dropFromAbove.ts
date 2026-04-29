import type AnimationType from "@client/models/artist/animationType"
import { ANIMATION_TYPES } from "@client/enums";
import { ANIMATION_GRAVITY } from "@common/constants";

const DROP_DURATION = 1000;
const DROP_VY_STARTING = 2400;

const dropFromAbove: AnimationType = {
  id: ANIMATION_TYPES.DROP_FROM_ABOVE,
  duration: DROP_DURATION,
  interval: 1,
  getVyStarting: () => DROP_VY_STARTING, 
  getPosition: (animation, elapsed) => {
    if (elapsed > DROP_DURATION || !animation.ix || !animation.iy || !animation.py || !animation.vy) {
      return { x: animation.ix ?? 0, y: animation.iy ?? 0 };
    }
    
    animation.vy += ANIMATION_GRAVITY;
    animation.py += (animation.vy / 1000);

    // If at or below final vertical position, bounce
    if (animation.py >= animation.iy) {
      animation.py = animation.iy;
      if (Math.abs(animation.vy) > (DROP_VY_STARTING / 10)) {
        animation.vy = -1 * animation.vy * 0.4;
      }
    }
    
    return { x: animation.ix, y: animation.py };
  }
};

export default dropFromAbove;