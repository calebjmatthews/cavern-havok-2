import type AnimationType from "@client/models/artist/animationType"
import { ANIMATION_TYPES } from "@client/enums";

const DURATION = 1000;

const move: AnimationType = {
  id: ANIMATION_TYPES.MOVE,
  duration: DURATION,
  interval: 1,
  getPosition: (args) => {
    const { animation } = args;
    if (!animation.px || !animation.py) {
      return { x: animation.px ?? 0, y: animation.py ?? 0 };
    };

    let x = animation.px;
    if (animation.vx) {
      x = animation.px + (animation.vx / 1000);
      animation.px = x;
      animation.vx *= (0.925);
    }
    let y = animation.py;
    if (animation.vy) {
      y = animation.py + (animation.vy / 1000);
      animation.py = y;
      animation.vy *= (0.925);
    }
    return { x, y };
  }
};

export default move;