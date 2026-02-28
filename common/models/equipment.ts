import type BattleState from "./battleState";
import type Action from "./action";
import type Command from "./command";
import type EquipmentPiece from "./equipmentPiece";
import type RichText from "./richText";
import type { ALTERATIONS, CHARACTER_CLASSES, EQUIPMENT_SLOTS } from "@common/enums";

export default interface Equipment {
  id: string;
  name?: string;
  equippedBy: CHARACTER_CLASSES[];
  slot: EQUIPMENT_SLOTS;
  getDescription: (args: GetDescriptionArgs) => RichText;
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
  blessing?: { alterationId: ALTERATIONS, extent: number };
  // getAnimationSteps
  // getDuration
};

export interface GetActionsArgs {
  battleState: BattleState;
  command: Command;
  piece: EquipmentPiece;
};

export interface GetDescriptionArgs {
  battleState?: BattleState;
  userId: string;
  piece: EquipmentPiece;
}