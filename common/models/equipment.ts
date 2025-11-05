import type BattleState from "./battleState";
import type Action from "./action";
import type Alteration from "./alteration";
import type SubCommand from "./subCommand";
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
  getSubCommands?: (args: GetSubCommandsArgs) => SubCommand[];
  alteration?: Alteration;
  // getAnimationSteps
  // getDuration
};

export interface GetActionsArgs {
  battleState: BattleState;
  commandId: string;
  userId: string;
  target: [number, number];
};

export interface GetSubCommandsArgs {
  battleState: BattleState;
  command: Command;
};