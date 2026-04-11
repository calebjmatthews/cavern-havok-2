import type AnimationType from "@client/models/artist/animationType"
import { ANIMATION_TYPES } from "@client/enums";
import random from "@common/functions/utils/random";

const WOBBLE_DURATION = 1000;
const WOBBLE_EXTENT = 10;

const wobble: AnimationType = {
  id: ANIMATION_TYPES.WOBBLE,
  duration: WOBBLE_DURATION,
  getPosition: (initial, elapsed) => {
    const remainingRatio = 1 - (elapsed / WOBBLE_DURATION);
    const xOffset = ((-0.5 + random()) * WOBBLE_EXTENT * remainingRatio);
    const x = initial.x + xOffset;
    const yOffset = ((-0.5 + random()) * WOBBLE_EXTENT * remainingRatio);
    const y = initial.y + yOffset;
    return { x, y };
  }
};

export default wobble;