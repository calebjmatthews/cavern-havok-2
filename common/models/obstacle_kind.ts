import type Obstacle from './obstacle';
import type RichText from './richText';
import type { SpriteSet } from './spriteSet';
import { genId } from '@common/functions/utils/random';
import { OBSTACLE_KINDS } from "@common/enums";

export default class ObstacleKind implements ObstacleKindInterface{
  id: OBSTACLE_KINDS = OBSTACLE_KINDS.KIND_MISSING;
  description: (RichText | string)[] = [];
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
      id: genId(),
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
  spriteSet: SpriteSet;
};