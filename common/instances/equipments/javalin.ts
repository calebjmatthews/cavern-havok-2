import type Equipment from "@common/models/equipment";
import type { GetSubCommandsArgs } from "@common/models/equipment";
import type BattleState from "@common/models/battleState";
import getOccupantCoords from "@common/functions/positioning/getOccupantCoords";
import getSurroundingSpaces from "@common/functions/positioning/getSurroundingSpaces";
import getEnemySide from "@common/functions/positioning/getEnemySide";
import areSurroundingsOccupied from "@common/functions/positioning/areSurroundingsOccupied";
import getCoordsOnSide from "@common/functions/positioning/getCoordsOnSide";
import getOccupantIdFromCoords from "@common/functions/positioning/getOccupantIdFromCoords";
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

const equipmentsJavalin: { [id: string] : Equipment } = {

  // Feather Cap (Head): Damage +1 if target is 7 or more columns away
  [EQU.FEATHER_CAP]: {
    id: EQU.FEATHER_CAP,
    equippedBy: [CHC.JAVALIN],
    slot: EQS.HEAD,
    description: 'Damage +1 if target is 7 or more columns away',
    alteration: alterations[ALTERATIONS.FEATHER_CAP]
  },

  // Down Vest (Top): Defense +3, an additional Defense +3 if all spaces around user are empty
  [EQU.DOWN_VEST]: {
    id: EQU.DOWN_VEST,
    equippedBy: [CHC.JAVALIN],
    slot: EQS.TOP,
    description: 'Defense +2, an additional Defense +2 if all spaces around user are empty',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const userCoords = getOccupantCoords({ ...args, occupantId: args.userId });
      return userCoords ? [userCoords] : []
    },
    targetType: 'id',
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, priority: ACP.FIRST, getOutcomes: ((args) => {
        const { battleState, userId } = args;
        const user = battleState.fighters[userId];
        if (!user) throw Error(`getSubCommands error: user not found with ID${userId}`);
        const surroundingsEmpty = !areSurroundingsOccupied(
          { battleState, origin: user.coords, min: 1, max: 1, surroundingsFullyOccupied: true }
        );
        return [
          { userId, duration, affectedId: userId, defense: surroundingsEmpty ? 6 : 3 }
        ];
      })
    })
  },

  // Tufted Sandals (Bottom): Move 1-2
  [EQU.TUFTED_SANDALS]: {
    id: EQU.TUFTED_SANDALS,
    equippedBy: [CHC.JAVALIN],
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

  // Swallow: 2 damage to target
  [EQU.SWALLOW]: {
    id: EQU.SWALLOW,
    equippedBy: [CHC.JAVALIN],
    slot: EQS.MAIN,
    description: '2 damage to target',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      return getCoordsOnSide(
        { battleState, side: getEnemySide({ battleState, userId }), onlyOccupiedSpaces: true }
      );
    },
    targetType: 'id',
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affectedId = getOccupantIdFromCoords({ battleState, coords: target });
        return [ { userId, duration, affectedId, damage: 2 } ];
      })
    })
  },

  // Blackbird: 3 damage to target at end of round
  [EQU.BLACKBIRD]: {
    id: EQU.BLACKBIRD,
    equippedBy: [CHC.JAVALIN],
    slot: EQS.MAIN,
    description: '3 damage to target at end of round',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      return getCoordsOnSide(
        { battleState, side: getEnemySide({ battleState, userId }), onlyOccupiedSpaces: true }
      );
    },
    targetType: 'id',
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, priority: ACP.PENULTIMATE, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affectedId = getOccupantIdFromCoords({ battleState, coords: target });
        return [{ userId, duration, affectedId, damage: 3 }];
      })
    })
  },

  // Heron: 2 charge | 1 damage to all targets on opposite side
  [EQU.HERON]: {
    id: EQU.HERON,
    equippedBy: [CHC.JAVALIN],
    slot: EQS.MAIN,
    description: '2 charge | 1 damage to all targets on opposite side',
    getCanUse: (args: { battleState: BattleState, userId: string }) => (
      (args.battleState.fighters[args.userId]?.charge || 0) >= 2
    ),
    getStaticTargets: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      return getCoordsOnSide(
        { battleState, side: getEnemySide({ battleState, userId }), onlyOccupiedSpaces: true }
      );
    },
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, priority: ACP.PENULTIMATE, getOutcomes: ((args) => {
        const { battleState, userId } = args;
        const coordsSet = getCoordsOnSide(
          { battleState, side: getEnemySide({ battleState, userId }), onlyOccupiedSpaces: true }
        );
        const chargeUsage = { userId: args.userId, duration, affectedId: args.userId, charge: -2 };
        const affectedIds = coordsSet.map((coords) => getOccupantIdFromCoords({ battleState, coords }));
        return [ chargeUsage, ...affectedIds.map((affectedId) => (
          { userId, duration, affectedId, damage: 1 }
        )) ];
      })
    })
  },

  // Debug: 10 damage to all targets on opposite side
  [EQU.DEBUG]: {
    id: EQU.DEBUG,
    equippedBy: [],
    slot: EQS.MAIN,
    description: '10 damage to all targets on opposite side',
    getStaticTargets: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      return getCoordsOnSide(
        { battleState, side: getEnemySide({ battleState, userId }), onlyOccupiedSpaces: true }
      );
    },
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, priority: ACP.PENULTIMATE, getOutcomes: ((args) => {
        const { battleState, userId } = args;
        const coordsSet = getCoordsOnSide(
          { battleState, side: getEnemySide({ battleState, userId }), onlyOccupiedSpaces: true }
        );
        const affectedIds = coordsSet.map((coords) => getOccupantIdFromCoords({ battleState, coords }));
        return affectedIds.map((affectedId) => (
          { userId, duration, affectedId, damage: 10 }
        ));
      })
    })
  },
};

export default equipmentsJavalin;