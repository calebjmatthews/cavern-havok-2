import type { ALTERATIONS, CHARACTER_CLASSES, OBSTACLE_KINDS } from "@common/enums";

export default interface Outcome {
  userId?: string;
  affectedId?: string;
  alterationId?: string;
  duration: number; // to match UI changes up with animations
  damage?: number;
  defenseDamaged?: number;
  defenseBroken?: boolean;
  sufferedDamage?: number;
  becameInDanger?: boolean;
  becameDowned?: boolean;
  skippedBecauseDowned?: boolean;
  skippedBecauseStunned?: boolean;
  healing?: number;
  becameRevived?: boolean;
  becameOutOfDanger?: boolean;
  defense?: number;
  charge?: number;
  moveTo?: [number, number];
  becameStunned?: boolean;
  makeObstacle?: { kind: OBSTACLE_KINDS, coords: [number, number] };
  makeFighter?: { className: CHARACTER_CLASSES, coords: [number, number] };
  bless?: { alterationId: ALTERATIONS, extent: number };
  blessingExpired?: string,
  curse?: { alterationId: ALTERATIONS, extent: number };
  curseExpired?: string,
  obstacleDestroyed?: boolean;

  damageEqualToUsersInjury?: number;
};