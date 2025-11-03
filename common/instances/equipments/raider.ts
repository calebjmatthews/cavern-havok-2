import type Equipment from "@common/models/equipment";
import type { GetActionsArgs } from "@common/models/equipment";
import type BattleState from "@common/models/battleState";
import getOccupantCoords from "@common/functions/positioning/getOccupantCoords";
import getSurroundingSpaces from "@common/functions/positioning/getSurroundingSpaces";
import getCoordsSetOfFirstInEnemyRows from "@common/functions/positioning/getCoordsSetOfFirstInEnemyRows";
import getCoordsOfFirstInEnemyRow from "@common/functions/positioning/getIdOfFirstInEnemyRow";
import getFrontColumn from "@common/functions/positioning/getFrontColumn";
import getFightersInCoordsSet from "@common/functions/positioning/getFighterIdsInCoordsSet";
import getEnemySide from "@common/functions/positioning/getEnemySide";
import alterations from '../alterations';
import { EQUIPMENTS, EQUIPMENT_SLOTS, CHARACTER_CLASSES, ACTION_PRIORITIES, ALTERATIONS }
from "@common/enums";
import { OUTCOME_DURATION_DEFAULT } from "@common/constants";
const EQU = EQUIPMENTS;
const EQS = EQUIPMENT_SLOTS;
const CHC = CHARACTER_CLASSES;
const ACP = ACTION_PRIORITIES;
const duration = OUTCOME_DURATION_DEFAULT;

const equipmentsRaider: { [id: string] : Equipment } = {

  // Horned Helmet (Head): ax power +2 if user is in front column
  [EQU.FLINT_HEMLET]: {
    id: EQU.FLINT_HEMLET,
    equippedBy: [CHC.RAIDER],
    slot: EQS.HEAD,
    description: 'Ax power +2 if user is in front column',
    alteration: alterations[ALTERATIONS.FLINT_HELMET]
  },

  // Hide Vest (Top): Defense +3
  [EQU.FLINT_SHOULDERGUARDS]: {
    id: EQU.FLINT_SHOULDERGUARDS,
    equippedBy: [CHC.RAIDER],
    slot: EQS.TOP,
    description: 'Defense +3',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const userCoords = getOccupantCoords({ ...args, occupantId: args.userId });
      return userCoords ? [userCoords] : []
    },
    targetType: 'id',
    getActions: (args: GetActionsArgs ) => (
      [{ priority: ACP.FIRST, commandId: args.commandId, outcomes: [
        { userId: args.userId, duration, affectedId: args.userId, defense: 3 }
      ] }]
    )
  },

  // Hob-nailed Boots (Bottom): Move 1-2
  [EQU.FLINT_BOOTS]: {
    id: EQU.FLINT_BOOTS,
    equippedBy: [CHC.RAIDER],
    slot: EQS.BOTTOM,
    description: 'Move 1-2',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getCanTarget error: user not found with ID${userId}`);
      return getSurroundingSpaces({
        battleState,
        origin: user.coords,
        min: 1,
        max: 2,
        onlyInSide: user.side,
        onlyOpenSpaces: true
      });
    },
    targetType: 'coords',
    getActions: (args: GetActionsArgs ) => (
      [{ commandId: args.commandId, outcomes: [
        { userId: args.userId, duration, affectedId: args.userId, moveTo: args.target }
      ] }]
    )
  },

  // Hatchet: 2 damage to first target in row
  [EQU.HATCHET]: {
    id: EQU.HATCHET,
    equippedBy: [CHC.RAIDER],
    slot: EQS.MAIN,
    description: '2 damage to first target in row',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getActions: (args: GetActionsArgs ) => {
      const { battleState, userId, target } = args;
      const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
      if (!affectedId) return [];
      return [{ commandId: args.commandId, outcomes: [
        { userId: args.userId, duration, affectedId, damage: 2 }
      ] }];
    }
  },

  // Sweep Ax: 1 damage to front column
  [EQU.SWEEP_AX]: {
    id: EQU.SWEEP_AX,
    equippedBy: [CHC.RAIDER],
    slot: EQS.MAIN,
    description: '1 damage to front column',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getFrontColumn({ ...args, side: getEnemySide(args) })
    ),
    targetType: 'coords',
    getActions: (args: GetActionsArgs ) => {
      const coordsSet = getFrontColumn({ ...args, side: getEnemySide(args) });
      const fightersEffectedIds = getFightersInCoordsSet({ battleState: args.battleState, coordsSet })
      if (fightersEffectedIds.length === 0) return [];
      return [{ commandId: args.commandId, outcomes: fightersEffectedIds.map((affectedId) => (
        { userId: args.userId, duration, affectedId, damage: 1 }
      )) }];
    }
  },

  // Cleaving Ax: 3 charge | 5 damage to first target in row
  [EQU.CLEAVING_AX]: {
    id: EQU.CLEAVING_AX,
    equippedBy: [CHC.RAIDER],
    slot: EQS.MAIN,
    description: '3 charge | 5 damage to first target in row',
    getCanUse: (args: { battleState: BattleState, userId: string }) => (
      (args.battleState.fighters[args.userId]?.charge || 0) >= 3
    ),
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getActions: (args: GetActionsArgs ) => {
      const { battleState, userId, target } = args;
      const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
      const chargeUsage = { userId: args.userId, duration, affectedId: args.userId, charge: -3 };
      if (!affectedId) return [{ commandId: args.commandId, outcomes: [chargeUsage] }];
      return [{ commandId: args.commandId, outcomes: [
        chargeUsage, { userId: args.userId, duration, affectedId, damage: 5 }
      ] }];
    }
  },
};

export default equipmentsRaider;