import type Equipment from "@common/models/equipment";
import type BattleState from "@common/models/battleState";
import type { GetActionsArgs, GetDescriptionArgs } from "@common/models/equipment";
import RichText from "@common/models/richText";
import getOccupantCoords from "@common/functions/positioning/getOccupantCoords";
import getCoordsSetOfFirstInEnemyRows from "@common/functions/positioning/getCoordsSetOfFirstInEnemyRows";
import getCoordsOfFirstInEnemyRow from "@common/functions/positioning/getIdOfFirstInEnemyRow";
import getFrontColumn from "@common/functions/positioning/getFrontColumn";
import getFrontOccupiedColumn from "@common/functions/positioning/getFrontOccupiedColumn";
import getOccupantIdsInCoordsSet from "@common/functions/positioning/getOccupantIdsInCoordsSet";
import getEnemySide from "@common/functions/positioning/getEnemySide";
import createActions from "@common/functions/battleLogic/createActions";
import applyLevel from "@common/functions/battleLogic/applyLevel";
import describeWithCircumstances from "@common/functions/describeWithCircumstances";
import actionIntoPixiEvents from "@common/functions/pixiEvents/actionIntoPixiEvents";
import getCoordsOnSide from "@common/functions/positioning/getCoordsOnSide";
import getSideOpposite from "@common/functions/positioning/getSideOpposite";
import {
  EQUIPMENTS, EQUIPMENT_SLOTS, CHARACTER_CLASSES, ACTION_PRIORITIES, ALTERATIONS, TERMS,
  ENCHANTMENT_GROUPS, LAYERED_ANIMATED_STATES
} from "@common/enums";
import { OUTCOME_DURATION_DEFAULT } from "@common/constants";
import defendIntoPixiEvents from "@common/functions/pixiEvents/defendIntoPixiEvents";
const EQU = EQUIPMENTS;
const EQS = EQUIPMENT_SLOTS;
const CHC = CHARACTER_CLASSES;
const ACP = ACTION_PRIORITIES;
const ENG = ENCHANTMENT_GROUPS;
const LAS = LAYERED_ANIMATED_STATES;
const duration = OUTCOME_DURATION_DEFAULT;

const equipmentsRaider: { [id: string] : Equipment } = {

  // Shard Helmet (Head): ax power +2 if user is in front column
  [EQU.SHARD_HELMET]: {
    id: EQU.SHARD_HELMET,
    equippedBy: [CHC.RAIDER],
    slot: EQS.HEAD,
    getDescription: (_args: GetDescriptionArgs) => new RichText({
      tag: 'span',
      contents: [`+2 Damage if target is in column directly in front of user`]
    }),
    blessing: { alterationId: ALTERATIONS.SHARD_HELMET, extent: 2 }
  },

  // Rookie Shoulderguards (Top): Defense +3
  [EQU.ROOKIE_SHOULDERGUARDS]: {
    id: EQU.ROOKIE_SHOULDERGUARDS,
    equippedBy: [CHC.RAIDER],
    slot: EQS.TOP,
    getDescription: (args: GetDescriptionArgs) => (
      describeWithCircumstances({ ...args, parts: [
        { extent: 3, kind: 'defense', appliesTo: 'user' },
      ]
    })),
    getAllowedTargets: (args: { battleState: BattleState, userId: string }) => {
      const userCoords = getOccupantCoords({ ...args, occupantId: args.userId });
      return userCoords ? [userCoords] : []
    },
    targetType: 'id',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, priority: ACP.FIRST, getOutcomes: ((args) => [
        { userId: args.userId, duration, affectedId: args.userId, defense: applyLevel(3, args) }
      ])
    }),
    getPixiEvents: (args) => defendIntoPixiEvents(args),
    hideMainLayer: true
  },

  // Hatchet: 3 damage to first target in row
  [EQU.HATCHET]: {
    id: EQU.HATCHET,
    equippedBy: [CHC.RAIDER],
    slot: EQS.MAIN,
    enchantmentsAllowed: [ENG.DAMAGING],
    getDescription: (args: GetDescriptionArgs) => (
      describeWithCircumstances({ ...args, parts: [
        { extent: 3, kind: 'damage', appliesTo: 'front' }
      ]
    })),
    getAllowedTargets: (args: { battleState: BattleState, userId: string }) => (
      getCoordsOnSide({ battleState: args.battleState, side: getSideOpposite(args) })
    ),
    getEmphasizedTargets: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
        return [{
          userId: args.userId, duration, affectedId, damage: applyLevel(3, args)
        }];
      }),
    }),
    getPixiEvents: (args) => actionIntoPixiEvents({
      ...args, actorState: LAS.SWINGING, swishFunctionName: 'getSwingPixiEvent'
    })
  },

  // 2 damage to first target in enemy row, if target is Knocked Out +1 maximum health to user
  [EQU.REVEL]: {
    id: EQU.REVEL,
    equippedBy: [CHC.RAIDER],
    slot: EQS.MAIN,
    enchantmentsAllowed: [ENG.DAMAGING],
    getDescription: (args: GetDescriptionArgs) => (
      describeWithCircumstances({ ...args, parts: [
        { extent: 2, kind: 'damage', appliesTo: 'front' },
        { tag: 'span', contents: [
          `if target is`,
          { tag: 'Term', contents: [TERMS.KNOCKED_OUT] },
          `+1 maximum health to user`,
        ] }
      ]
    })),
    getAllowedTargets: (args: { battleState: BattleState, userId: string }) => (
      getCoordsOnSide({ battleState: args.battleState, side: getSideOpposite(args) })
    ),
    getEmphasizedTargets: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
        return [{
          userId: args.userId, duration, affectedId, damage: applyLevel(2, args),
          outcomeIfTargetKnockedOut: {
            userId: args.userId, duration, affectedId: args.userId, healthMax: 1
          }
        }];
      }),
    }),
    getPixiEvents: (args) => actionIntoPixiEvents({
      ...args, actorState: LAS.SWINGING, swishFunctionName: 'getSwingPixiEvent'
    })
  },

  // Crescent: 2 damage to closest occupied enemy column
  [EQU.CRESCENT]: {
    id: EQU.CRESCENT,
    equippedBy: [CHC.RAIDER],
    slot: EQS.MAIN,
    enchantmentsAllowed: [ENG.DAMAGING],
    getDescription: (args: GetDescriptionArgs) => (
      describeWithCircumstances({ ...args, parts: [
        { extent: 2, kind: 'damage', appliesTo: 'frontColumn' }
      ]
    })),
    getStaticTargets: (args: { battleState: BattleState, userId: string }) => (
      getFrontOccupiedColumn({ ...args, side: getEnemySide(args), occupiedSpotsOnly: true })
    ),
    getStaticArea: (args: { battleState: BattleState, userId: string }) => (
      getFrontOccupiedColumn({ ...args, side: getEnemySide(args) })
    ),
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, getOutcomes: ((args) => {
        const coordsSet = getFrontOccupiedColumn({ ...args, side: getEnemySide(args) });
        const occupantsEffectedIds = getOccupantIdsInCoordsSet({ battleState: args.battleState, coordsSet })
        if (occupantsEffectedIds.length === 0) return [];
        return occupantsEffectedIds.map((affectedId) => (
          { userId: args.userId, duration, affectedId, damage: applyLevel(2, args) }
        ));
      })
    }),
    getPixiEvents: (args) => actionIntoPixiEvents({
      ...args, actorState: LAS.SWINGING, swishFunctionName: 'getSwingPixiEvent'
    })
  },

  // Cleaving Ax: 3 charge | 6 damage to first target in enemy row
  [EQU.AJAX]: {
    id: EQU.AJAX,
    equippedBy: [CHC.RAIDER],
    slot: EQS.MAIN,
    enchantmentsAllowed: [ENG.DAMAGING, ENG.CHARGE],
    getDescription: (args: GetDescriptionArgs) => (
      describeWithCircumstances({ ...args, parts: [
        { extent: 3, kind: 'chargeCost', appliesTo: 'user' },
        { extent: 6, kind: 'damage', appliesTo: 'front' },
      ]
    })),
    getCanUse: (args: { battleState: BattleState, userId: string }) => (
      (args.battleState.fighters[args.userId]?.charge || 0) >= 3
    ),
    getAllowedTargets: (args: { battleState: BattleState, userId: string }) => (
      getCoordsOnSide({ battleState: args.battleState, side: getSideOpposite(args) })
    ),
    getEmphasizedTargets: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
        const chargeUsage = { userId: args.userId, duration, affectedId: args.userId, charge: -3 };
        return [
          chargeUsage, { userId: args.userId, duration, affectedId, damage: applyLevel(6, args, 2) }
        ]
      })
    }),
    getPixiEvents: (args) => actionIntoPixiEvents({
      ...args, actorState: LAS.SWINGING, swishFunctionName: 'getSwingPixiEvent'
    })
  },

  // Feist: 2 charge | User's Injury in damage to first target in enemy row
  [EQU.FEIST]: {
    id: EQU.FEIST,
    equippedBy: [CHC.RAIDER],
    slot: EQS.MAIN,
    enchantmentsAllowed: [ENG.CHARGE],
    getDescription: (args: GetDescriptionArgs) => (
      describeWithCircumstances({ ...args, parts: [
        { extent: 3, kind: 'chargeCost', appliesTo: 'user' },
        { tag: 'span', contents: [
          `User's`,
          { tag: 'Term', contents: [TERMS.INJURY] },
          `in damage to a target in`,
          { tag: 'Term', contents: [TERMS.FRONT] }
        ] }
      ]
    })),
    getCanUse: (args: { battleState: BattleState, userId: string }) => (
      (args.battleState.fighters[args.userId]?.charge || 0) >= 2
    ),
    getAllowedTargets: (args: { battleState: BattleState, userId: string }) => (
      getCoordsOnSide({ battleState: args.battleState, side: getSideOpposite(args) })
    ),
    getEmphasizedTargets: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
        const chargeUsage = { userId: args.userId, duration, affectedId: args.userId, charge: -2 };
        return [
          chargeUsage, {
            userId: args.userId,
            duration,
            affectedId,
            damageEqualToUsersInjury: applyLevel(1, args, 0.5)
          }
        ]
      })
    }),
    getPixiEvents: (args) => actionIntoPixiEvents({
      ...args, actorState: LAS.SWINGING, swishFunctionName: 'getSwingPixiEvent'
    })
  },
};

export default equipmentsRaider;