import type { CHARACTER_CLASSES, EQUIPMENT_SLOTS } from "@common/enums";
import type BattleState from "./battleState";
import type Action from "./action";
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
  getActions?: (args: GetActionsArgs) => Action[];
  getPassives?: (args: {
    battleState: BattleState;
    userId: string;
  }) => Passive[];
  // getAnimationSteps
  // getDuration
};

export interface GetActionsArgs {
  battleState: BattleState;
  commandId: string;
  userId: string;
  target: [number, number];
};