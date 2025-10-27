import type { CHARACTER_CLASSES, EQUIPMENT_SLOTS } from "@common/enums";
import type BattleState from "./battleState";
import type Effect from "./effect";
import type Passive from "./passive";

export default interface Equipment {
  id: string;
  equippedBy: CHARACTER_CLASSES;
  slot: EQUIPMENT_SLOTS;
  getCanUse?: (args: {
    battleState: BattleState;
    userId: string;
  }) => boolean;
  getCanTarget: (args: {
    battleState: BattleState;
    userId: string;
  }) => [number, number][];
  targetType: 'id' | 'coords';
  getEffects?: (args: {
    battleState: BattleState;
    userId: string;
    target: [number, number];
  }) => Effect[];
  getPassives?: (args: {
    battleState: BattleState;
    userId: string;
  }) => Passive[];
  // getAnimationSteps
  // getDuration
};