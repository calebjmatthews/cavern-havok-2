import type AnimationType from "@client/models/artist/animationType";
import type Animation from "@client/models/artist/animation";
import random from '@common/functions/utils/random';
import { ANIMATION_TYPES } from "@client/enums";

const DURATION = 800;
const VY_STARTING = -2000;
const VX_STARTING = 1200;

const magicBit: AnimationType = {
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
    const duration = animation.duration ?? DURATION;
    if (elapsed > (duration) || !animation.ix || !animation.iy || !(animation.io !== undefined)) {
      return { x: -1000, y: -1000 };
    }

    const radius = 1 + ((elapsed / 200) * pixelScale) + (elapsed * elapsed * 0.00004);
    const theta = (
      ((elapsed + (animation.io * (duration * (1 / 0.6)))) / 200)
      + (elapsed * elapsed * 0.000005)
    );
    // sin = opp / hyp
    // sin * hyp = opp
    const opposite = Math.sin(theta) * radius;

    // tan = opp / adj
    // opp / tan = adj
    const adjacent = opposite / Math.tan(theta);

    animation.px = animation.ix + opposite;
    animation.py = animation.iy + adjacent;
    
    return { x: animation.px, y: animation.py };
  },
  getAngle: (elapsed, animation) => {
    if (!animation.is) return 0;
    return Math.floor((animation.is * elapsed) % 360);
  },
  getOpacity: (elapsed, animation) => {
    const duration = animation.duration ?? DURATION;
    const percentComplete = elapsed / duration;
    if (percentComplete < 0.8) return 1;
    return (1 - ((percentComplete - 0.8) * 5));
  }
};

export default magicBit;