import ObstacleKind from "@common/models/obstacle_kind";
import { OBSTACLE_KINDS } from "@common/enums";

const boulder = new ObstacleKind({
  id: OBSTACLE_KINDS.BOULDER,
  description: [`Just big enough to hide behind.`],
  health: 3,
});

export default boulder;