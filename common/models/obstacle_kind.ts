import { v4 as uuid } from 'uuid';

import type Obstacle from './obstacle';
import { OBSTACLE_KINDS } from "@common/enums";

export default class ObstacleKind implements ObstacleKindInterface{
  id: OBSTACLE_KINDS = OBSTACLE_KINDS.KIND_MISSING;
  health: number = 1;

  constructor(obstacleKind: ObstacleKindInterface) {
    Object.assign(this, obstacleKind);
  };

  // name: string;
  // createdBy: string;
  // kind: OBSTACLE_KINDS;
  // healthStat: number;
  // side: 'A'|'B';
  // coords: [number, number];
  // health: number;
  // healthMax: number;
  // defense: number;
  makeObstacle(args: {
    createdBy: string;
    side: 'A'|'B';
    coords: [number, number];
  }): Obstacle {
    return {
      id: uuid(),
      occupantKind: "obstacle",
      name: this.id,
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
};