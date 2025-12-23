import ObstacleKind from "@common/models/obstacle_kind";
import { OBSTACLE_KINDS, SPRITE_STATES } from "@common/enums";
const SPS = SPRITE_STATES;

const boulder = new ObstacleKind({
  id: OBSTACLE_KINDS.BOULDER,
  health: 3,
  spriteSet: {
    [SPS.RESTING]: { src: "/public/sprites/rock.png", width: 17, height: 19 }
  },
});

export default boulder;