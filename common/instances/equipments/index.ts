import equipmentRaider from "./raider";
import equipmentBubble from "./bubble";
import type Equipment from "@common/models/equipment";
import { EQUIPMENT_SLOTS, EQUIPMENTS } from "@common/enums";

// id: string;
// equippedBy: CHARACTER_CLASSES;
// slot: EQUIPMENT_SLOTS;
// getCanUse?: (args: {
//   battleState: BattleState;
//   userId: string;
// }) => boolean;
// getCanTarget: (args: {
//   battleState: BattleState;
//   userId: string;
// }) => [number, number][];
// targetType: 'id' | 'coords';
// getActions?: (args: GetActionsArgs) => Action[];
// getPassives?: (args: {
//   battleState: BattleState;
//   userId: string;
// }) => Passive[];
// // getAnimationSteps
// // getDuration

const equipments: { [id: string] : Equipment } = {
  ...equipmentRaider,
  ...equipmentBubble,
  [EQUIPMENTS.MISSING]: {
    id: '',
    equippedBy: [],
    slot: EQUIPMENT_SLOTS.MAIN,
    getCanTarget: () => [],
    targetType: 'coords'
  }
};

export default equipments;