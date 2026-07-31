import type Equipment from "@common/models/equipment";
import type BattleState from "@common/models/battleState";
import type Outcome from "@common/models/outcome";
import type { GetActionsArgs, GetDescriptionArgs } from "@common/models/equipment";
import RichText from "@common/models/richText";
import getOccupantCoords from "@common/functions/positioning/getOccupantCoords";
import getSurroundingSpaces from "@common/functions/positioning/getSurroundingSpaces";
import getOccupantIdFromCoords from "@common/functions/positioning/getOccupantIdFromCoords";
import createActions from "@common/functions/battleLogic/createActions";
import applyLevel from "@common/functions/battleLogic/applyLevel";
import describeWithCircumstances from "@common/functions/describeWithCircumstances";
import attackIntoPixiEvents from "@common/functions/pixiEvents/attackIntoPixiEvents";
import defendIntoPixiEvents from "@common/functions/pixiEvents/defendIntoPixiEvents";
import { ANIMATION_SPEED, OUTCOME_DURATION_DEFAULT } from "@common/constants";
import {
  EQUIPMENTS, EQUIPMENT_SLOTS, CHARACTER_CLASSES, ACTION_PRIORITIES, ALTERATIONS, TERMS, 
  ENCHANTMENT_GROUPS, LAYERED_ANIMATED_STATES
} from "@common/enums";
const EQU = EQUIPMENTS;
const EQS = EQUIPMENT_SLOTS;
const CHC = CHARACTER_CLASSES;
const ACP = ACTION_PRIORITIES;
const ENG = ENCHANTMENT_GROUPS;
const LAS = LAYERED_ANIMATED_STATES;
const ALT = ALTERATIONS;
const duration = OUTCOME_DURATION_DEFAULT;

const equipmentsBlueMage: { [id: string] : Equipment } = {

  // Rainfall Hood (Head): Healing and regen effects +1 to targets other than user
  [EQU.RAINFALL_HOOD]: {
    id: EQU.RAINFALL_HOOD,
    equippedBy: [CHC.BLUE_MAGE],
    slot: EQS.HEAD,
    getDescription: (_args: GetDescriptionArgs) => new RichText({
      tag: 'span',
      contents: [`Healing and Regen effects +1`]
    }),
    // ToDo: Add second blessing for Regen effects
    blessing: { alterationId: ALT.RAINFALL_HOOD_HEALING, extent: 1 }
  },

  // Droplet Robe (Top): Defense +3
  [EQU.DROPLET_ROBE]: {
    id: EQU.DROPLET_ROBE,
    equippedBy: [CHC.BLUE_MAGE],
    slot: EQS.TOP,
    getDescription: (args: GetDescriptionArgs) => (
      describeWithCircumstances({ ...args, parts: [
        { extent: 3, kind: 'defense', appliesTo: 'user' }
      ]
    })),
    getAllowedTargets: (args: { battleState: BattleState, userId: string }) => {
      const userCoords = getOccupantCoords({ ...args, occupantId: args.userId });
      return userCoords ? [userCoords] : []
    },
    targetType: 'id',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, priority: ACP.FIRST, givesDefenseOutcome: true, getOutcomes: ((args) => {
        const { battleState, userId } = args;
        const user = battleState.fighters[userId];
        if (!user) throw Error(`getActions error: user not found with ID${userId}`);
        const outcomeBase: Outcome = { userId, duration, affectedId: userId };
        const outcomes: Outcome[] = [{ ...outcomeBase, defense: applyLevel(3, args) }];
        return outcomes;
      })
    }),
    getPixiEvents: (args) => defendIntoPixiEvents(args),
    hideMainLayer: true
  },

  // Coldburst: 1 Water damage and Curse with 1 Lag to target within 5 Range
  [EQU.COLDBURST]: {
    id: EQU.COLDBURST,
    equippedBy: [CHC.BLUE_MAGE],
    slot: EQS.MAIN,
    enchantmentsAllowed: [ENG.DAMAGING],
    getDescription: (args: GetDescriptionArgs) => (
      describeWithCircumstances({ ...args, parts: [
        { extent: 1, kind: 'damage', appliesTo: 'target' },
        { extent: 1, kind: 'giveCurse', alterationId: ALT.SLOW, appliesTo: 'target' },
      ]
    })),
    getAllowedTargets: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getAllowedTargets error: user not found with ID${userId}`);
      return getSurroundingSpaces({ battleState, origin: user.coords, min: 1, max: 5 });
    },
    getEmphasizedTargets: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getEmphasizedTargets error: user not found with ID${userId}`);
      return getSurroundingSpaces({
        battleState,
        origin: user.coords,
        min: 1,
        max: 5,
        onlyInSide: user.side === 'A' ? 'B' : 'A',
        onlyOccupiedSpaces: true
      });
    },
    targetType: 'id',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affectedId = getOccupantIdFromCoords({ battleState, coords: target });
        return [
          { userId, duration, affectedId, damage: applyLevel(1, args) },
          { userId, duration, affectedId, curse: {
            alterationId: ALT.SLOW, extent: applyLevel(1, args)
          } },
        ];
      })
    }),
    getPixiEvents: (args) => attackIntoPixiEvents({
      ...args, attackerState: LAS.CASTING, swishFunctionName: 'getSwingPixiEvent',
      delayBeforeDamaged: (40 / ANIMATION_SPEED),
      finishingDuration: (40 / ANIMATION_SPEED)
    })
  },

  // Gentle Rain: 1 Water healing and 2 Defense to target within 3 Range
  [EQU.GENTLE_RAIN]: {
    id: EQU.GENTLE_RAIN,
    equippedBy: [CHC.BLUE_MAGE],
    slot: EQS.MAIN,
    enchantmentsAllowed: [ENG.SUPPORT_TARGET],
    getDescription: (args: GetDescriptionArgs) => (
      describeWithCircumstances({ ...args, parts: [
        { extent: 1, kind: 'healing', appliesTo: 'target' },
        { extent: 2, kind: 'defense', appliesTo: 'target' },
      ]
    })),
    getAllowedTargets: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getAllowedTargets error: user not found with ID${userId}`);
      return getSurroundingSpaces({ battleState, origin: user.coords, min: 1, max: 3 });
    },
    getEmphasizedTargets: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getEmphasizedTargets error: user not found with ID${userId}`);
      return getSurroundingSpaces({
        battleState, origin: user.coords, min: 1, max: 3, onlyInSide: user.side, onlyOccupiedSpaces: true
      });
    },
    targetType: 'id',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affectedId = getOccupantIdFromCoords({ battleState, coords: target });
        return [
          { userId, duration, affectedId, healing: applyLevel(1, args) },
          { userId, duration, affectedId, defense: applyLevel(1, args) }
        ];
      })
    }),
    getPixiEvents: (args) => attackIntoPixiEvents({
      ...args, attackerState: LAS.CASTING, swishFunctionName: 'getSwingPixiEvent',
      delayBeforeDamaged: (40 / ANIMATION_SPEED),
      finishingDuration: (40 / ANIMATION_SPEED)
    })
  },
};

export default equipmentsBlueMage;