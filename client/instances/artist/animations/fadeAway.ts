import type AnimationType from "@client/models/artist/animationType"
import { ANIMATION_TYPES } from "@client/enums";

const DURATION = 500;

const fadeAway: AnimationType = {
  id: ANIMATION_TYPES.FADE_AWAY,
  duration: DURATION,
  interval: 1,
  getOpacity: ((elapsed) => {
    return (1 - (elapsed / DURATION))
  })
};

export default fadeAway;