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
  getAllowedTargets?: (args: {
    battleState: BattleState;
    userId: string;
  }) => [number, number][];
  getEmphasizedTargets?: (args: {
    battleState: BattleState;
    userId: string;
  }) => [number, number][];
  getStaticTargets?: (args: {
    battleState: BattleState;
    userId: string;
  }) => [number, number][];
  getStaticArea?: (args: {
    battleState: BattleState;
    userId: string;
  }) => [number, number][];
  targetType?: 'id' | 'coords';
  targetPreferred?: 'enemy' | 'ally';
  getActions?: (args: GetActionsArgs) => Action[];
  blessing?: { alterationId: ALTERATIONS, extent: number };

  getPixiEvents?: (args: GetPixiEventsArgs) => { pixiEvents: PixiEvent[], duration: number };
  commandReadyState?: string;
  hideMainLayer?: boolean;

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
  actorState?: string;
  swishFunctionName?: 'getSwingPixiEvent' | 'getThrowPixiEvents' | 'getMagicPixiEvents';
  singleActorStateChange?: boolean;
  isLunge?: boolean;
  delayBeforeDamaged?: number;
  intervalDuration?: number;
  finishingDuration?: number;
  index?: number;
  equipmentId?: string;
  particleSpriteNames?: string[];
};