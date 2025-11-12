import type Obstacle from "@common/models/obstacle";
import type BattleState from "@common/models/battleState";
import randomFrom from "@common/functions/utils/randomFrom";
import randomFromBag from "@common/functions/utils/randomFromBag";
import getCoordsOnSide from "@common/functions/positioning/getCoordsOnSide";
import cloneBattleState from "@common/functions/cloneBattleState";
import getObstacleKind from "@common/instances/obstacle_kinds";
import range from "@common/functions/utils/range";
import { FIGHTER_CONTROL_AUTO } from "@common/constants";

const getEncounterObstacles = (args: {
  battleState: BattleState,
  obstacleKinds: string[],
  quantityA: number,
  quantityB: number,
  omitBackRows?: boolean
}) => {
  const { battleState: battleStateArgs, obstacleKinds, quantityA, quantityB, omitBackRows } = args;
  const battleState = cloneBattleState(battleStateArgs);

  const obstacles: { [obstacleId: string] : Obstacle } = {};

  [
    ...range(0, (quantityA - 1)).map((): { side: "A" | "B" } => ({ side: "A" })),
    ...range(0, (quantityB - 1)).map((): { side: "A" | "B" } => ({ side: "B" }))
  ]
  .forEach(({ side }) => {
    const obstacleKind = obstacleKinds.length > 1
      ? randomFromBag(obstacleKinds)
      : obstacleKinds[0];
    if (!obstacleKind) throw Error("obstacleKind not found during getEncounterObstacles.");
    const existingOfKindCount = Object.values(battleState.obstacles)
    .filter((o) => o.kind === obstacleKind).length;
    const obstacle = getObstacleKind(obstacleKind).makeObstacle({
      name: `${obstacleKind} ${existingOfKindCount + 1}`,
      createdBy: FIGHTER_CONTROL_AUTO,
      side,
      coords: randomFrom(getCoordsOnSide({ battleState, side, onlyOpenSpaces: true }))
    });
    battleState.obstacles[obstacle.id] = obstacle;
    obstacles[obstacle.id] = obstacle;
  });

  return obstacles;
};

export default getEncounterObstacles;