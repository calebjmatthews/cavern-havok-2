import { v4 as uuid } from 'uuid';

import type Obstacle from './obstacle';
import type { SpriteSet } from './spriteSet';
import { OBSTACLE_KINDS } from "@common/enums";

export default class ObstacleKind implements ObstacleKindInterface{
  id: OBSTACLE_KINDS = OBSTACLE_KINDS.KIND_MISSING;
  health: number = 1;
  spriteSet: SpriteSet = {};

  constructor(obstacleKind: ObstacleKindInterface) {
    Object.assign(this, obstacleKind);
  };

  makeObstacle(args: {
    name: string;
    createdBy: string;
    side: 'A'|'B';
    coords: [number, number];
  }): Obstacle {
    return {
      id: uuid(),
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
  health: number;
  spriteSet: SpriteSet;
};