import type Obstacle from "./obstacle";
import type Fighter from "./fighter";
import type { CHARACTER_CLASSES, OBSTACLE_KINDS } from "@common/enums";

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
  wasHealed?: number;
  becameRevived?: boolean;
  becameOutOfDanger?: boolean;
  defense?: number;
  defenseFromEnchantment?: boolean;
  charge?: number;
  moveTo?: [number, number];
  becameStunned?: boolean;
  makeObstacle?: { kind: OBSTACLE_KINDS, coords: [number, number] };
  madeObstacle?: Obstacle;
  makeFighter?: { className: CHARACTER_CLASSES, coords: [number, number] };
  madeFighter?: Fighter;
  bless?: { alterationId: string, extent: number };
  blessingExpired?: string,
  curse?: { alterationId: string, extent: number };
  curseExpired?: string,
  obstacleDestroyed?: boolean;
  healthMax?: number;
  speed?: number;
  cindersGained?: number;
  cindersLost?: number;
  equipmentGained?: string;
  elements?: string[];

  damageEqualToUsersInjury?: number;
  healAfterDamage?: number;
  outcomeIfTargetKnockedOut?: Outcome;
};