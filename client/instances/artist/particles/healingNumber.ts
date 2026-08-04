import type AnimationType from "@client/models/artist/animationType";
import type Animation from "@client/models/artist/animation";
import { ANIMATION_TYPES } from "@client/enums";

const DURATION = 1500;
const VY_STARTING = -1625;
const SLOWDOWN = 64;

const healingNumber: AnimationType = {
  id: ANIMATION_TYPES.HEALING_NUMBER,
  duration: DURATION,
  interval: 1,
  getVyStarting: (pixelScale: number) => (VY_STARTING * pixelScale), 
  getPosition: (args: {
    animation: Animation,
    elapsed: number,
    pixelScale: number
  }) => {
    const { animation, elapsed, pixelScale } = args;
    if (elapsed > DURATION || !animation.ix || !animation.iy || !animation.px || !animation.py
    || animation.vy === undefined) {
      return { x: -1000, y: -1000 };
    }

    // const restingY = (animation.iy - (2 * pixelScale));
    if (elapsed > DURATION * 0.295) {
      animation.py = animation.iy;
      return { x: animation.px, y: animation.py };
    }
    
    animation.vy += (SLOWDOWN * pixelScale);
    animation.py += (animation.vy / 1000);
    
    return { x: animation.px, y: animation.py };
  },
  getOpacity: (elapsed) => {
    const percentComplete = elapsed / DURATION;
    if (percentComplete < 0.2) return (percentComplete * 5);
    if (percentComplete < .8) return 1;
    return (1 - ((percentComplete - .8) * 5));
  }
};

export default healingNumber;