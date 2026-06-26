import type AnimationType from "@client/models/artist/animationType"
import { ANIMATION_TYPES } from "@client/enums";

const DURATION = 300;

const lunge: AnimationType = {
  id: ANIMATION_TYPES.LUNGE,
  duration: DURATION,
  interval: 1,
  getPosition: (args) => {
    const { animation } = args;
    if (!animation.px || !animation.py || !animation.ix || !animation.iy || !animation.cx || 
      !animation.cy || args.elapsed >= DURATION) {
      return { x: animation.ix ?? 0, y: animation.iy ?? 0 };
    };
    const percentageElapsed = args.elapsed / DURATION;
    
    const diffFromThreeQuarter = (percentageElapsed < 0.75
      ? (percentageElapsed * 1.5)
      : (1 - percentageElapsed) * 4);
    animation.py = animation.iy + (animation.cy * Math.sqrt(diffFromThreeQuarter));

    const diffFromOneQuarter = (percentageElapsed < 0.25
      ? (percentageElapsed * 4)
      : (1 - percentageElapsed) * 1.5);
    animation.px = animation.ix + (animation.cx * Math.sqrt(diffFromOneQuarter));
    
    return { x: animation.px, y: animation.py };
  }
};

export default lunge;