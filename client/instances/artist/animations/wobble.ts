import type AnimationType from "@client/models/artist/animationType"
import { ANIMATION_TYPES } from "@client/enums";
import random from "@common/functions/utils/random";

const WOBBLE_DURATION = 400;
const WOBBLE_EXTENT = 6;

const wobble: AnimationType = {
  id: ANIMATION_TYPES.WOBBLE,
  duration: WOBBLE_DURATION,
  getPosition: (animation, elapsed) => {
    if (elapsed > WOBBLE_DURATION || !animation.ix || !animation.iy) {
      return { x: animation.ix ?? 0, y: animation.iy ?? 0 };
    }
    const remainingRatio = 1 - (elapsed / WOBBLE_DURATION);
    const xOffset = ((-0.5 + random()) * WOBBLE_EXTENT * remainingRatio);
    const x = animation.ix + xOffset;
    const yOffset = ((-0.5 + random()) * WOBBLE_EXTENT * remainingRatio);
    const y = animation.iy + yOffset;
    return { x, y };
  }
};

export default wobble;