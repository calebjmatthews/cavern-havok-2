import type { OBSTACLE_KINDS } from "@common/enums";

export default interface Creation {
  id: string;
  occupantKind: "creation";
  name: string;
  createdBy: string;
  kind: OBSTACLE_KINDS; // ToDo: Replace with CREATION_KINDS
  healthStat: number;
  side: 'A'|'B';
  coords: [number, number];
  health: number;
  healthMax: number;
  speed: number;
  defense: number;
  isStunned: boolean;
};