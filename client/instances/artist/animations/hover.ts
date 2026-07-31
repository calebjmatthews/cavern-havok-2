import type AnimationType from "@client/models/artist/animationType"
import type Animation from "@client/models/artist/animation";
import { ANIMATION_TYPES } from "@client/enums";

const HOVER_EXTENT = 0.667;

const hover: AnimationType = {
  id: ANIMATION_TYPES.HOVER,
  infinite: true,
  getPosition: (args: {
    animation: Animation,
    elapsed: number,
    pixelScale: number
  }) => {
    const { animation, elapsed, pixelScale } = args;
    if (!animation.ix || !animation.iy) {
      return { x: animation.ix ?? 0, y: animation.iy ?? 0 };
    };

    const yOffset = Math.sin(elapsed / 600) * (HOVER_EXTENT * pixelScale);
    const y = animation.iy + yOffset;
    return { x: animation.ix, y };
  }
};

export default hover;