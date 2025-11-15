import type Equipment from "@common/models/equipment";
import type { GetSubCommandsArgs } from "@common/models/equipment";
import type BattleState from "@common/models/battleState";
import getOccupantCoords from "@common/functions/positioning/getOccupantCoords";
import getSurroundingSpaces from "@common/functions/positioning/getSurroundingSpaces";
import getCoordsSetOfFirstInEnemyRows from "@common/functions/positioning/getCoordsSetOfFirstInEnemyRows";
import getCoordsOfFirstInEnemyRow from "@common/functions/positioning/getIdOfFirstInEnemyRow";
import getFrontColumn from "@common/functions/positioning/getFrontColumn";
import getOccupantIdsInCoordsSet from "@common/functions/positioning/getOccupantIdsInCoordsSet";
import getEnemySide from "@common/functions/positioning/getEnemySide";
import createSubCommands from "@common/functions/battleLogic/createSubCommands";
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

  // Flint Helmet (Head): ax power +2 if user is in front column
  [EQU.FLINT_HEMLET]: {
    id: EQU.FLINT_HEMLET,
    equippedBy: [CHC.RAIDER],
    slot: EQS.HEAD,
    description: ' +2 Damage if target is in column directly in front of user',
    alteration: alterations[ALTERATIONS.FLINT_HELMET]
  },

  // Flint Shoulderguards (Top): Defense +4
  [EQU.FLINT_SHOULDERGUARDS]: {
    id: EQU.FLINT_SHOULDERGUARDS,
    equippedBy: [CHC.RAIDER],
    slot: EQS.TOP,
    description: 'Defense +4',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const userCoords = getOccupantCoords({ ...args, occupantId: args.userId });
      return userCoords ? [userCoords] : []
    },
    targetType: 'id',
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, priority: ACP.FIRST, getOutcomes: ((args) => [
        { userId: args.userId, duration, affectedId: args.userId, defense: 4 }
      ])
    })
  },

  // Flint Boots (Bottom): Move 1-2
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
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, getOutcomes: ((args) => [
        { userId: args.userId, duration, affectedId: args.userId, moveTo: args.target }
      ])
    })
  },

  // Hatchet: 3 damage to first target in row
  [EQU.HATCHET]: {
    id: EQU.HATCHET,
    equippedBy: [CHC.RAIDER],
    slot: EQS.MAIN,
    description: '3 damage to first target in row',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
        return [{ userId: args.userId, duration, affectedId, damage: 3 }];
      })
    })
  },

  // Sweep Ax: 2 damage to front column
  [EQU.SWEEP_AX]: {
    id: EQU.SWEEP_AX,
    equippedBy: [CHC.RAIDER],
    slot: EQS.MAIN,
    description: '1 damage to front column',
    getStaticTargets: (args: { battleState: BattleState, userId: string }) => (
      getFrontColumn({ ...args, side: getEnemySide(args) })
    ),
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, getOutcomes: ((args) => {
        const coordsSet = getFrontColumn({ ...args, side: getEnemySide(args) });
        const occupantsEffectedIds = getOccupantIdsInCoordsSet({ battleState: args.battleState, coordsSet })
        if (occupantsEffectedIds.length === 0) return [];
        return occupantsEffectedIds.map((affectedId) => (
          { userId: args.userId, duration, affectedId, damage: 2 }
        ));
      })
    })
  },

  // Cleaving Ax: 3 charge | 6 damage to first target in enemy row
  [EQU.CLEAVING_AX]: {
    id: EQU.CLEAVING_AX,
    equippedBy: [CHC.RAIDER],
    slot: EQS.MAIN,
    description: '3 charge | 5 damage to first target in enemy row',
    getCanUse: (args: { battleState: BattleState, userId: string }) => (
      (args.battleState.fighters[args.userId]?.charge || 0) >= 3
    ),
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
        const chargeUsage = { userId: args.userId, duration, affectedId: args.userId, charge: -3 };
        return [
          chargeUsage, { userId: args.userId, duration, affectedId, damage: 6 }
        ]
      })
    })
  },

  // Scrappy Ax: 2 charge | User's Injury in damage to first target in enemy row
  [EQU.SCRAPPY_AX]: {
    id: EQU.SCRAPPY_AX,
    equippedBy: [CHC.RAIDER],
    slot: EQS.MAIN,
    description: `2 charge | Damage first target in enemy row equal to User's Injury`,
    getCanUse: (args: { battleState: BattleState, userId: string }) => (
      (args.battleState.fighters[args.userId]?.charge || 0) >= 2
    ),
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
        const chargeUsage = { userId: args.userId, duration, affectedId: args.userId, charge: -2 };
        return [
          chargeUsage, { userId: args.userId, duration, affectedId, damageEqualToUsersInjury: 1 }
        ]
      })
    })
  },
};

export default equipmentsRaider;