import type AnimationType from "@client/models/artist/animationType"
import { ANIMATION_TYPES } from "@client/enums";

const pulseTint: AnimationType = {
  id: ANIMATION_TYPES.PULSE_TINT,
  infinite: true,
  interval: 1,
  getTint: ((elapsed) => {
    const extent = (0.5 + (Math.sin((elapsed) / 200) * 0.5)) * 255;
    return `rgb(${255 - (extent * 0.25)},${255 - (extent * 0.5)},${255 - (extent * 0.75)})`;
  })
};

export default pulseTint;