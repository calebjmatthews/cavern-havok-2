import ObstacleKind from "@common/models/obstacle_kind";
import boulder from "./boulder";
import { OBSTACLE_KINDS } from "@common/enums";

export const obstacleKinds: { [obstacleKindId: string]: ObstacleKind } = {
  [OBSTACLE_KINDS.BOULDER]: boulder
};

const getObstacleKind = (obstacleKindId: string) => {
  const obstacleKind = obstacleKinds[obstacleKindId];
  if (!obstacleKind) throw Error(`getObstacleKind error, ${obstacleKindId} not found.`);
  return obstacleKind;
};

export default getObstacleKind;