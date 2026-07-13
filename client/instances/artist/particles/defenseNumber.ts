import type AnimationType from "@client/models/artist/animationType";
import type Animation from "@client/models/artist/animation";
import { ANIMATION_TYPES } from "@client/enums";

const DURATION = 1500;
const VX_STARTING = 1500;
const SLOWDOWN = -60;

const defenseNumber: AnimationType = {
  id: ANIMATION_TYPES.DEFENSE_NUMBER,
  duration: DURATION,
  interval: 1,
  getVxStarting: (pixelScale: number) => (VX_STARTING * pixelScale), 
  getPosition: (args: {
    animation: Animation,
    elapsed: number,
    pixelScale: number
  }) => {
    const { animation, elapsed, pixelScale } = args;
    if (elapsed > DURATION || !animation.ix || !animation.iy || !animation.px || !animation.py
    || animation.vx === undefined) {
      return { x: -1000, y: -1000 };
    }

    const restingX = (animation.ix - (2 * pixelScale));
    if (animation.px >= restingX) {
      animation.px = restingX;
      return { x: animation.px, y: animation.py };
    }
    
    animation.vx += (SLOWDOWN * pixelScale);
    animation.px += (animation.vx / 1000);
    
    return { x: animation.px, y: animation.py };
  },
  getOpacity: (elapsed) => {
    const percentComplete = elapsed / DURATION;
    if (percentComplete < 0.2) return (percentComplete * 5);
    if (percentComplete < .8) return 1;
    return (1 - ((percentComplete - .8) * 5));
  }
};

export default defenseNumber;