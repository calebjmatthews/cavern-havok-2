import type BattleState from "./battleState";
import type Alteration from "./alteration";
import type Action from "./action";
import type { CHARACTER_CLASSES, EQUIPMENT_SLOTS } from "@common/enums";
import type Command from "./command";

export default interface Equipment {
  id: string;
  equippedBy: CHARACTER_CLASSES[];
  slot: EQUIPMENT_SLOTS;
  description: string;
  getCanUse?: (args: {
    battleState: BattleState;
    userId: string;
  }) => boolean;
  getCanTarget?: (args: {
    battleState: BattleState;
    userId: string;
  }) => [number, number][];
  getStaticTargets?: (args: {
    battleState: BattleState;
    userId: string;
  }) => [number, number][];
  targetType?: 'id' | 'coords';
  targetPreferred?: 'enemy' | 'ally';
  getActions?: (args: GetActionsArgs) => Action[];
  alteration?: Alteration;
  // getAnimationSteps
  // getDuration
};

export interface GetActionsArgs {
  battleState: BattleState;
  command: Command;
};