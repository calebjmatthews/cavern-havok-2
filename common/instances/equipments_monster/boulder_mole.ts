import type Equipment from "@common/models/equipment";
import type { GetActionsArgs, GetSubCommandsArgs } from "@common/models/equipment";
import type BattleState from "@common/models/battleState";
import getOccupantCoords from "@common/functions/positioning/getOccupantCoords";
import getSurroundingSpaces from "@common/functions/positioning/getSurroundingSpaces";
import getCoordsSetOfFirstInEnemyRows from "@common/functions/positioning/getCoordsSetOfFirstInEnemyRows";
import getCoordsOfFirstInEnemyRow from "@common/functions/positioning/getIdOfFirstInEnemyRow";
import getOccupantIdsInCoordsSet from '@common/functions/positioning/getOccupantIdsInCoordsSet';
import getOccupantFromCoords from "@common/functions/positioning/getOccupantFromCoords";
import getCoordsOnSide from "@common/functions/positioning/getCoordsOnSide";
import createSubCommands from "@common/functions/battleLogic/createSubCommands";
import { EQUIPMENTS, EQUIPMENT_SLOTS, CHARACTER_CLASSES, ACTION_PRIORITIES, OBSTACLE_KINDS }
  from "@common/enums";
import { OUTCOME_DURATION_DEFAULT } from "@common/constants";
const EQU = EQUIPMENTS;
const EQS = EQUIPMENT_SLOTS;
const CHC = CHARACTER_CLASSES;
const ACP = ACTION_PRIORITIES;
const OBK = OBSTACLE_KINDS;
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
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, priority: ACP.FIRST, getOutcomes: ((args) => [
        { userId: args.userId, duration, affectedId: args.userId, defense: 6 }
      ])
    })
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
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, getOutcomes: ((args) => [
        { userId: args.userId, duration, affectedId: args.userId, moveTo: args.target }
      ])
    })
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
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
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
        return [
          { userId: args.userId, duration, affectedId, damage: 1 },
          ...surroundingIds.map((affectedId) => (
            { userId: args.userId, duration, affectedId, damage: 1 }
          ))
        ];
      })
    })
  },

  // Stony Defense: Charge 2 | Defense +8 to a target within 4 spaces
  [EQU.STONY_DEFENSE]: {
    id: EQU.STONY_DEFENSE,
    equippedBy: [CHC.BOULDER_MOLE],
    slot: EQS.MAIN,
    description: 'Charge 2 | Defense +8 to a target within 4 spaces',
    getCanUse: (args: { battleState: BattleState, userId: string }) => (
      (args.battleState.fighters[args.userId]?.charge || 0) >= 2
    ),
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
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affected = getOccupantFromCoords({ battleState, coords: target });
        if (!affected) return [];
        const chargeUsage = { userId, duration, affectedId: userId, charge: -2 };
        return [
          chargeUsage, 
          { userId, duration, affectedId: affected.id, defense: 8 }
        ];
      })
    })
  },

  // Boulder Drop: Drop a 3 HP boulder anywhere on the user's side
  [EQU.BOULDER_DROP]: {
    id: EQU.BOULDER_DROP,
    equippedBy: [CHC.BOULDER_MOLE],
    slot: EQS.MAIN,
    description: `Drop a 3 HP boulder anywhere on the user's side`,
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getCanTarget error: user not found with ID${userId}`);
      return getCoordsOnSide({ battleState, side: user.side, onlyOpenSpaces: true });
    },
    targetType: 'coords',
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, getOutcomes: ((args) => {
        const { userId, target } = args;
        if (!target) return [];
        return [{ userId, duration, makeObstacle: { kind: OBK.BOULDER, coords: target } }];
      } )
    })
  },
};

export default equipmentsBoulderMole;