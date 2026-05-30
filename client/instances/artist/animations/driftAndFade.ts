import type AnimationType from "@client/models/artist/animationType"
import { ANIMATION_TYPES } from "@client/enums";

const DURATION = 300;

const driftAndFade: AnimationType = {
  id: ANIMATION_TYPES.DRIFT_AND_FADE,
  duration: DURATION,
  interval: 1,
  getVxStarting: (pixelScale) => (-1000 * pixelScale),
  getPosition: (args) => {
    const { animation } = args;
    console.log(`animation`, animation);
    if (!animation.px || !animation.vx || !animation.py) {
      return { x: animation.px ?? 0, y: animation.py ?? 0 };
    };

    const x = animation.px + (animation.vx / 1000);
    animation.vx *= (0.8);
    return { x, y: animation.py };
  },
  getOpacity: ((elapsed) => {
    return (1 - (elapsed / DURATION))
  })
};

export default driftAndFade;