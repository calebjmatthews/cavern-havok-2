export default interface Outcome {
  userId: string;
  affectedId?: string;
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
};