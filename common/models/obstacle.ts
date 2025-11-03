import type { OBSTACLE_KINDS } from "@common/enums";

export default interface Obstacle {
  id: string;
  name: string;
  createdBy: string;
  kind: OBSTACLE_KINDS;
  healthStat: number;
  side: 'A'|'B';
  coords: [number, number];
  health: number;
  healthMax: number;
  defense: number;
};