import type BattleState from "./battleState";
import type Action from "./action";
import type Command from "./command";
import type EquipmentPiece from "./equipmentPiece";
import type RichText from "./richText";
import type { PixiEvent } from "@common/models/pixiEvent";
import type { ALTERATIONS, CHARACTER_CLASSES, ENCHANTMENT_GROUPS, ENCHANTMENTS, EQUIPMENT_SLOTS }
  from "@common/enums";
import type ActionResolved from "./actionResolved";

export default interface Equipment {
  id: string;
  name?: string;
  equippedBy: CHARACTER_CLASSES[];
  slot: EQUIPMENT_SLOTS;
  enchantmentsAllowed?: (ENCHANTMENT_GROUPS | ENCHANTMENTS)[];
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
  getPixiEvents?: (args: GetPixiEventsArgs) => { pixiEvents: PixiEvent[], duration: number };
  blessing?: { alterationId: ALTERATIONS, extent: number };
  isStyle?: boolean;
};

export interface GetActionsArgs {
  battleState: BattleState;
  command: Command;
  piece: EquipmentPiece;
};

export interface GetDescriptionArgs {
  battleState?: BattleState;
  userId?: string;
  piece: EquipmentPiece;
};

export interface GetPixiEventsArgs {
  actionResolved: ActionResolved,
  battleState: BattleState,
  battleStateNew: BattleState,
  delayFromRoot: number,
  attackerState?: string;
  swishFunctionName?: 'getSwingPixiEvent' | 'getThrowPixiEvents';
  delayBeforeDamaged?: number;
  intervalDuration?: number;
  finishingDuration?: number;
  index?: number;
  equipmentId?: string;
};