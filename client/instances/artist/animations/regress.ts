import type AnimationType from "@client/models/artist/animationType";
import { ANIMATION_TYPES } from "@client/enums";

const DURATION = 600;

const regress: AnimationType = {
  id: ANIMATION_TYPES.REGRESS,
  duration: DURATION,
  interval: 1,
  getPosition: (args) => {
    const { animation, elapsed } = args;
    if (!animation.ix || !animation.iy || !animation.px || !animation.py) {
      return { x: animation.px ?? 0, y: animation.py ?? 0 };
    };

    const diff = ((DURATION / 2) - elapsed);
    const remaining = diff > 0 ? diff : 0;

    if (animation.vx) animation.px = animation.ix + (animation.vx / 1000) * (remaining / 4);
    if (animation.vy) animation.py = animation.iy + (animation.vy / 1000) * (remaining / 4);
    return { x: animation.px, y: animation.py };
  },
  getOpacity: ((elapsed) => {
    const percentElapsed = elapsed / (DURATION * 1.33);
    if (percentElapsed < 0.8) return 1;
    if (percentElapsed > 1) return 0;
    return (1 - percentElapsed) * 5;
  })
};

export default regress;