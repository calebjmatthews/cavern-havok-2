import type AnimationType from "@client/models/artist/animationType"
import { ANIMATION_TYPES } from "@client/enums";

const pulseOpacity: AnimationType = {
  id: ANIMATION_TYPES.PULSE_OPACITY,
  infinite: true,
  interval: 1,
  getOpacity: ((elapsed) => {
    const opacityNext = 1 - (0.5 + (Math.sin((200 - elapsed) / 200) * 0.5));
    return opacityNext;
  })
};

export default pulseOpacity;