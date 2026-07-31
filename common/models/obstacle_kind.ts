import type Obstacle from './obstacle';
import type RichText from './richText';
import { genId } from '@common/functions/utils/random';
import { OBSTACLE_KINDS } from "@common/enums";

export default class ObstacleKind implements ObstacleKindInterface{
  id: OBSTACLE_KINDS = OBSTACLE_KINDS.KIND_MISSING;
  description: (RichText | string)[] = [];
  health: number = 1;

  constructor(obstacleKind: ObstacleKindInterface) {
    Object.assign(this, obstacleKind);
  };

  makeObstacle(args: {
    name: string;
    createdBy: string;
    side: 'A'|'B';
    coords: [number, number];
    id?: string,
  }): Obstacle {
    return {
      id: args?.id ?? genId(),
      occupantKind: "obstacle",
      kind: this.id,
      healthStat: this.health,
      health: this.health,
      healthMax: this.health,
      defense: 0,
      ...args
    };
  };
};

interface ObstacleKindInterface {
  id: OBSTACLE_KINDS;
  description: (RichText | string)[];
  health: number;
};