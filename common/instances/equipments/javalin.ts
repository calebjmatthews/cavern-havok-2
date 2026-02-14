import type Equipment from "@common/models/equipment";
import type { GetActionsArgs, GetDescriptionArgs } from "@common/models/equipment";
import type BattleState from "@common/models/battleState";
import getOccupantCoords from "@common/functions/positioning/getOccupantCoords";
import getSurroundingSpaces from "@common/functions/positioning/getSurroundingSpaces";
import getEnemySide from "@common/functions/positioning/getEnemySide";
import areSurroundingsOccupied from "@common/functions/positioning/areSurroundingsOccupied";
import getCoordsOnSide from "@common/functions/positioning/getCoordsOnSide";
import getOccupantIdFromCoords from "@common/functions/positioning/getOccupantIdFromCoords";
import createActions from "@common/functions/battleLogic/createActions";
import applyLevel from "@common/functions/battleLogic/applyLevel";
import { EQUIPMENTS, EQUIPMENT_SLOTS, CHARACTER_CLASSES, ACTION_PRIORITIES, ALTERATIONS, TERMS }
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
    getDescription: (_args: GetDescriptionArgs) => ({
      tag: 'span',
      contents: [`Damage +1 if target is 7 or more columns away`]
    }),
    blessing: { alterationId: ALTERATIONS.FEATHER_CAP, extent: 1 }
  },

  // Down Vest (Top): Defense +3, an additional Defense +3 if all spaces around user are empty
  [EQU.DOWN_VEST]: {
    id: EQU.DOWN_VEST,
    equippedBy: [CHC.JAVALIN],
    slot: EQS.TOP,
    getDescription: (_args: GetDescriptionArgs) => ({
      tag: 'span',
      contents: [
        { tag: 'Term', contents: [TERMS.DEFENSE] },
        `+3, an additional`,
        { tag: 'Term', contents: [TERMS.DEFENSE] },
        `+3 if all spaces around user are empty`
      ]
    }),
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const userCoords = getOccupantCoords({ ...args, occupantId: args.userId });
      return userCoords ? [userCoords] : []
    },
    targetType: 'id',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, priority: ACP.FIRST, getOutcomes: ((args) => {
        const { battleState, userId } = args;
        const user = battleState.fighters[userId];
        if (!user) throw Error(`getActions error: user not found with ID${userId}`);
        const surroundingsEmpty = !areSurroundingsOccupied(
          { battleState, origin: user.coords, min: 1, max: 1, surroundingsFullyOccupied: true }
        );
        const defense = surroundingsEmpty ? applyLevel(6, args) : applyLevel(3, args);
        return [
          { userId, duration, affectedId: userId, defense }
        ];
      })
    })
  },

  // Tufted Sandals (Bottom): Move 1-2
  [EQU.TUFTED_SANDALS]: {
    id: EQU.TUFTED_SANDALS,
    equippedBy: [CHC.JAVALIN],
    slot: EQS.BOTTOM,
    getDescription: (_args: GetDescriptionArgs) => ({
      tag: 'span',
      contents: [`Move 1-2`]
    }),
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
    getActions: (args: GetActionsArgs) => createActions({
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
    getDescription: (_args: GetDescriptionArgs) => ({
      tag: 'span',
      contents: [`2 damage to target`]
    }),
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      return getCoordsOnSide(
        { battleState, side: getEnemySide({ battleState, userId }), onlyOccupiedSpaces: true }
      );
    },
    targetType: 'id',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affectedId = getOccupantIdFromCoords({ battleState, coords: target });
        return [ { userId, duration, affectedId, damage: applyLevel(2, args) } ];
      })
    })
  },

  // Blackbird: 3 damage to target | Slow
  [EQU.BLACKBIRD]: {
    id: EQU.BLACKBIRD,
    equippedBy: [CHC.JAVALIN],
    slot: EQS.MAIN,
    getDescription: (_args: GetDescriptionArgs) => ({
      tag: 'section',
      contents: [
        `3 damage to target`,
        { tag: 'Term', contents: [TERMS.SLOW] }
      ]
    }),
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      return getCoordsOnSide(
        { battleState, side: getEnemySide({ battleState, userId }), onlyOccupiedSpaces: true }
      );
    },
    targetType: 'id',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, priority: ACP.PENULTIMATE, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affectedId = getOccupantIdFromCoords({ battleState, coords: target });
        return [{ userId, duration, affectedId, damage: applyLevel(3, args) }];
      })
    })
  },

  // Heron: 2 charge | 1 damage to all targets on opposite side
  [EQU.HERON]: {
    id: EQU.HERON,
    equippedBy: [CHC.JAVALIN],
    slot: EQS.MAIN,
    getDescription: (_args: GetDescriptionArgs) => ({
      tag: 'section',
      contents: [
        { tag: 'span', contents: [
          `Costs 2`,
          { tag: 'Term', contents: [TERMS.CHARGE] }
        ] },
        `1 damage to all targets on opposite side`
      ]
    }),
    getCanUse: (args: { battleState: BattleState, userId: string }) => (
      (args.battleState.fighters[args.userId]?.charge || 0) >= 2
    ),
    getStaticTargets: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      return getCoordsOnSide(
        { battleState, side: getEnemySide({ battleState, userId }), onlyOccupiedSpaces: true }
      );
    },
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, priority: ACP.PENULTIMATE, getOutcomes: ((args) => {
        const { battleState, userId } = args;
        const coordsSet = getCoordsOnSide(
          { battleState, side: getEnemySide({ battleState, userId }), onlyOccupiedSpaces: true }
        );
        const chargeUsage = {
          userId: args.userId,
          duration,
          affectedId: args.userId,
          charge: -2 // -1 if level 1
        };
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
    getDescription: (_args: GetDescriptionArgs) => ({
      tag: 'span',
      contents: [`10 damage to all targets on opposite side`]
    }),
    getStaticTargets: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      return getCoordsOnSide(
        { battleState, side: getEnemySide({ battleState, userId }), onlyOccupiedSpaces: true }
      );
    },
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, priority: ACP.PENULTIMATE, getOutcomes: ((args) => {
        const { battleState, userId } = args;
        const coordsSet = getCoordsOnSide(
          { battleState, side: getEnemySide({ battleState, userId }), onlyOccupiedSpaces: true }
        );
        const affectedIds = coordsSet.map((coords) => getOccupantIdFromCoords({ battleState, coords }));
        return affectedIds.map((affectedId) => (
          { userId, duration, affectedId, damage: applyLevel(10, args) }
        ));
      })
    })
  },
};

export default equipmentsJavalin;