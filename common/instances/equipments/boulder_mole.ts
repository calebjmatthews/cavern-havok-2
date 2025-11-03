import type Equipment from "@common/models/equipment";
import type { GetActionsArgs } from "@common/models/equipment";
import type BattleState from "@common/models/battleState";
import getOccupantCoords from "@common/functions/positioning/getOccupantCoords";
import getSurroundingSpaces from "@common/functions/positioning/getSurroundingSpaces";
import getCoordsSetOfFirstInEnemyRows from "@common/functions/positioning/getCoordsSetOfFirstInEnemyRows";
import getCoordsOfFirstInEnemyRow from "@common/functions/positioning/getIdOfFirstInEnemyRow";
import getOccupantIdsInCoordsSet from '../../functions/positioning/getOccupantIdsInCoordsSet';
import { EQUIPMENTS, EQUIPMENT_SLOTS, CHARACTER_CLASSES, ACTION_PRIORITIES } from "@common/enums";
import { OUTCOME_DURATION_DEFAULT } from "@common/constants";
import getOccupantFromCoords from "@common/functions/positioning/getOccupantFromCoords";
const EQU = EQUIPMENTS;
const EQS = EQUIPMENT_SLOTS;
const CHC = CHARACTER_CLASSES;
const ACP = ACTION_PRIORITIES;
const duration = OUTCOME_DURATION_DEFAULT;

const equipmentsBoulderMole: { [id: string] : Equipment } = {
  // Rocky Hide (Top): Defense +6
  [EQU.ROCKY_HIDE]: {
    id: EQU.ROCKY_HIDE,
    equippedBy: [CHC.BOULDER_MOLE],
    slot: EQS.TOP,
    description: 'Defense +6',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const userCoords = getOccupantCoords({ ...args, occupantId: args.userId });
      return userCoords ? [userCoords] : []
    },
    targetType: 'id',
    getActions: (args: GetActionsArgs ) => (
      [{ priority: ACP.FIRST, commandId: args.commandId, outcomes: [
        { userId: args.userId, duration, affectedId: args.userId, defense: 6 }
      ] }]
    )
  },

  // Scrabbling Legs (Bottom): Move 1
  [EQU.SCRABBLING_LEGS]: {
    id: EQU.SCRABBLING_LEGS,
    equippedBy: [CHC.BOULDER_MOLE],
    slot: EQS.BOTTOM,
    description: 'Move 1',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getCanTarget error: user not found with ID${userId}`);
      return getSurroundingSpaces({
        battleState,
        origin: user.coords,
        min: 1,
        max: 1,
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

  // Rubble Toss: 1 damage to first target in row and a 1 space area around them
  [EQU.RUBBLE_TOSS]: {
    id: EQU.RUBBLE_TOSS,
    equippedBy: [CHC.BOULDER_MOLE],
    slot: EQS.MAIN,
    description: '1 damage to first target in row and a 1 space area around them',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getActions: (args: GetActionsArgs ) => {
      const { battleState, userId, target } = args;
      const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
      const affected = battleState.fighters[affectedId || ''];
      if (!affected) return [];
      const surroundingArea = getSurroundingSpaces({
        battleState,
        origin: affected.coords,
        min: 1,
        max: 1
      });
      const surroundingIds = getOccupantIdsInCoordsSet({ battleState, coordsSet: surroundingArea });
      return [{ commandId: args.commandId, outcomes: [
        { userId: args.userId, duration, affectedId, damage: 1 },
        ...surroundingIds.map((affectedId) => ({ userId: args.userId, duration, affectedId, damage: 1 }))
      ] }];
    }
  },

  // Stony Defense: Defense +5 to a target within 4 spaces
  [EQU.STONY_DEFENSE]: {
    id: EQU.STONY_DEFENSE,
    equippedBy: [CHC.BOULDER_MOLE],
    slot: EQS.MAIN,
    description: 'Defense +5 to a target within 4 spaces',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getCanTarget error: user not found with ID${userId}`);
      return getSurroundingSpaces({
        battleState,
        origin: user.coords,
        min: 1,
        max: 4,
        onlyOccupiedSpaces: true
      });
    },
    targetType: 'id',
    targetPreferred: 'ally',
    getActions: (args: GetActionsArgs ) => {
      const { battleState, userId, target } = args;
      const affected = getOccupantFromCoords({ battleState, coords: target });
      if (!affected) return [];
      return [{ priority: ACP.FIRST, commandId: args.commandId, outcomes: [
        { userId, duration, affectedId: affected.id, defense: 5 }
      ] }];
    }
  },

  // Boulder Drop: Drop a 3 HP boulder anywhere on the user's side
};

export default equipmentsBoulderMole;