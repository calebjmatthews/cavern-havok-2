import type Equipment from "@common/models/equipment";
import type BattleState from "@common/models/battleState";
import type Outcome from "@common/models/outcome";
import type { GetActionsArgs, GetDescriptionArgs } from "@common/models/equipment";
import RichText from "@common/models/richText";
import getOccupantCoords from "@common/functions/positioning/getOccupantCoords";
import getSurroundingSpaces from "@common/functions/positioning/getSurroundingSpaces";
import getOccupantIdFromCoords from "@common/functions/positioning/getOccupantIdFromCoords";
import getEnemyRowMatching from "@common/functions/positioning/getEnemyRowMatching";
import createActions from "@common/functions/battleLogic/createActions";
import applyLevel from "@common/functions/battleLogic/applyLevel";
import describeWithCircumstances from "@common/functions/description/describeWithCircumstances";
import actionIntoPixiEvents from "@common/functions/pixiEvents/actionIntoPixiEvents";
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
    getPixiEvents: (args) => actionIntoPixiEvents({ ...args, actorState: LAS.DEFENDING }),
    hideMainLayer: true
  },

  // Coldburst: 2 Water damage and 2 Lag to target within 6 Range
  [EQU.COLDBURST]: {
    id: EQU.COLDBURST,
    equippedBy: [CHC.BLUE_MAGE],
    slot: EQS.MAIN,
    enchantmentsAllowed: [ENG.DAMAGING],
    getDescription: (args: GetDescriptionArgs) => (
      describeWithCircumstances({ ...args, parts: [
        { extent: 2, kind: 'damage', appliesTo: 'target', range: [0, 6] },
        { extent: 2, kind: 'giveCurse', alterationId: ALT.LAG, appliesTo: 'target', range: [0, 6] },
      ]
    })),
    getAllowedTargets: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getAllowedTargets error: user not found with ID${userId}`);
      return getSurroundingSpaces({
        battleState, origin: user.coords, min: 1, max: 6, includeSelf: true
      });
    },
    getEmphasizedTargets: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getEmphasizedTargets error: user not found with ID${userId}`);
      return getSurroundingSpaces({
        battleState,
        origin: user.coords,
        min: 1,
        max: 6,
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
          { userId, duration, affectedId, damage: applyLevel(2, args) },
          { userId, duration, affectedId, curse: {
            alterationId: ALT.LAG, extent: applyLevel(2, args)
          } },
        ];
      })
    }),
    getPixiEvents: (args) => actionIntoPixiEvents({
      ...args,
      actorState: LAS.INVOKING,
      swishFunctionName: 'getMagicPixiEvents',
      particleSpriteNames: [`flakelet.png`],
      delayBeforeDamaged: (40 / ANIMATION_SPEED),
      finishingDuration: (40 / ANIMATION_SPEED),
      singleActorStateChange: true
    }),
    commandReadyState: LAS.CASTING
  },

  // Gentle Rain: 1 Water healing and 2 Defense to target within 3 Range
  [EQU.GENTLE_RAIN]: {
    id: EQU.GENTLE_RAIN,
    equippedBy: [CHC.BLUE_MAGE],
    slot: EQS.MAIN,
    enchantmentsAllowed: [ENG.SUPPORT_TARGET],
    getDescription: (args: GetDescriptionArgs) => (
      describeWithCircumstances({ ...args, parts: [
        { extent: 1, kind: 'healing', appliesTo: 'target', range: [0, 3] },
        { extent: 2, kind: 'defense', appliesTo: 'target', range: [0, 3] },
      ]
    })),
    getAllowedTargets: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getAllowedTargets error: user not found with ID${userId}`);
      return getSurroundingSpaces({
        battleState, origin: user.coords, min: 1, max: 3, includeSelf: true
      });
    },
    getEmphasizedTargets: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getEmphasizedTargets error: user not found with ID${userId}`);
      return getSurroundingSpaces({
        battleState,
        origin: user.coords,
        min: 1,
        max: 3,
        onlyInSide: user.side,
        onlyOccupiedSpaces: true,
        includeSelf: true
      });
    },
    targetType: 'id',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, priority: ACP.FIRST, givesDefenseOutcome: true, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        const user = battleState.fighters[userId];
        if (!user || !target) return [];
        const affectedId = getOccupantIdFromCoords({ battleState, coords: target });
        const outcomeBase: Outcome = { userId, duration, affectedId };
        const outcomes: Outcome[] = [
          { ...outcomeBase, healing: applyLevel(1, args) },
          { ...outcomeBase, defense: applyLevel(2, args) }
        ];
        return outcomes;
      })
    }),
    getPixiEvents: (args) => actionIntoPixiEvents({
      ...args,
      actorState: LAS.INVOKING,
      swishFunctionName: 'getMagicPixiEvents',
      particleSpriteNames: [`droplet.png`],
      delayBeforeDamaged: (40 / ANIMATION_SPEED),
      finishingDuration: (40 / ANIMATION_SPEED),
      singleActorStateChange: true
    }),
    commandReadyState: LAS.CASTING
  },

  // Current Spiral: 2 Water healing and 3 Defense to self and targets within 1 Range
  [EQU.CURRENT_SPIRAL]: {
    id: EQU.CURRENT_SPIRAL,
    equippedBy: [CHC.BLUE_MAGE],
    slot: EQS.MAIN,
    enchantmentsAllowed: [ENG.SUPPORT_TARGET],
    getDescription: (args: GetDescriptionArgs) => (
      describeWithCircumstances({ ...args, parts: [
        { extent: 2, kind: 'healing', appliesTo: 'target' },
        { extent: 3, kind: 'defense', appliesTo: 'target' },
      ]
    })),
    getStaticTargets: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getAllowedTargets error: user not found with ID${userId}`);
      return getSurroundingSpaces({
        battleState,
        origin: user.coords,
        min: 1,
        max: 1,
        includeSelf: true,
        onlyOccupiedSpaces: true,
        onlyInSide: user.side
      });
    },
    getStaticArea: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getAllowedTargets error: user not found with ID${userId}`);
      return getSurroundingSpaces({
        battleState, origin: user.coords, min: 1, max: 1, includeSelf: true, onlyInSide: user.side
      });
    },
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, priority: ACP.FIRST, givesDefenseOutcome: true, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        const user = battleState.fighters[userId];
        if (!user || !target) return [];
        const affectedId = getOccupantIdFromCoords({ battleState, coords: target });
        const outcomeBase: Outcome = { userId, duration, affectedId };
        const outcomes: Outcome[] = [
          { ...outcomeBase, healing: applyLevel(2, args) },
          { ...outcomeBase, defense: applyLevel(3, args) }
        ];
        return outcomes;
      })
    }),
    getPixiEvents: (args) => actionIntoPixiEvents({
      ...args,
      actorState: LAS.INVOKING,
      swishFunctionName: 'getMagicPixiEvents',
      particleSpriteNames: [`droplet.png`],
      delayBeforeDamaged: (40 / ANIMATION_SPEED),
      finishingDuration: (40 / ANIMATION_SPEED),
      singleActorStateChange: true
    }),
    commandReadyState: LAS.CASTING
  },

  // Rushing Helix: 1 Charge Up and 2 Defense to self and targets within 1 Range
  [EQU.RUSHING_HELIX]: {
    id: EQU.RUSHING_HELIX,
    equippedBy: [CHC.BLUE_MAGE],
    slot: EQS.MAIN,
    enchantmentsAllowed: [ENG.SUPPORT_TARGET],
    getDescription: (args: GetDescriptionArgs) => (
      describeWithCircumstances({ ...args, parts: [
        { extent: 1, kind: 'chargeUp', appliesTo: 'target' },
        { extent: 2, kind: 'defense', appliesTo: 'target' },
      ]
    })),
    getStaticTargets: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getAllowedTargets error: user not found with ID${userId}`);
      return getSurroundingSpaces({
        battleState,
        origin: user.coords,
        min: 1,
        max: 1,
        includeSelf: true,
        onlyOccupiedSpaces: true,
        onlyInSide: user.side
      });
    },
    getStaticArea: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getAllowedTargets error: user not found with ID${userId}`);
      return getSurroundingSpaces({
        battleState, origin: user.coords, min: 1, max: 1, includeSelf: true, onlyInSide: user.side
      });
    },
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, priority: ACP.FIRST, givesDefenseOutcome: true, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        const user = battleState.fighters[userId];
        if (!user || !target) return [];
        const affectedId = getOccupantIdFromCoords({ battleState, coords: target });
        const outcomeBase: Outcome = { userId, duration, affectedId };
        const outcomes: Outcome[] = [
          { ...outcomeBase, charge: applyLevel(1, args) },
          { ...outcomeBase, defense: applyLevel(2, args) }
        ];
        return outcomes;
      })
    }),
    getPixiEvents: (args) => actionIntoPixiEvents({
      ...args,
      actorState: LAS.INVOKING,
      swishFunctionName: 'getMagicPixiEvents',
      particleSpriteNames: [`droplet.png`],
      delayBeforeDamaged: (40 / ANIMATION_SPEED),
      finishingDuration: (40 / ANIMATION_SPEED),
      singleActorStateChange: true
    }),
    commandReadyState: LAS.CASTING
  },

  // Consecrate: 5 Annointed to self and targets within 1 Range
  [EQU.CONSECRATE]: {
    id: EQU.CONSECRATE,
    equippedBy: [CHC.BLUE_MAGE],
    slot: EQS.MAIN,
    enchantmentsAllowed: [ENG.SUPPORT_TARGET],
    getDescription: (args: GetDescriptionArgs) => (
      describeWithCircumstances({ ...args, parts: [
        { extent: 5, kind: 'blessing', alterationId: ALTERATIONS.ANNOINTED, appliesTo: 'target' },
      ]
    })),
    getStaticTargets: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getAllowedTargets error: user not found with ID${userId}`);
      return getSurroundingSpaces({
        battleState,
        origin: user.coords,
        min: 1,
        max: 1,
        includeSelf: true,
        onlyOccupiedSpaces: true,
        onlyInSide: user.side
      });
    },
    getStaticArea: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getAllowedTargets error: user not found with ID${userId}`);
      return getSurroundingSpaces({
        battleState, origin: user.coords, min: 1, max: 1, includeSelf: true, onlyInSide: user.side
      });
    },
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, priority: ACP.FIRST, givesDefenseOutcome: true, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        const user = battleState.fighters[userId];
        if (!user || !target) return [];
        const affectedId = getOccupantIdFromCoords({ battleState, coords: target });
        const outcomeBase: Outcome = { userId, duration, affectedId };
        const outcomes: Outcome[] = [
          { ...outcomeBase, bless: {
            alterationId: ALTERATIONS.ANNOINTED, extent: applyLevel(5, args)
          } },
          { ...outcomeBase, defense: applyLevel(2, args) }
        ];
        return outcomes;
      })
    }),
    getPixiEvents: (args) => actionIntoPixiEvents({
      ...args,
      actorState: LAS.INVOKING,
      swishFunctionName: 'getMagicPixiEvents',
      particleSpriteNames: [`droplet.png`],
      delayBeforeDamaged: (40 / ANIMATION_SPEED),
      finishingDuration: (40 / ANIMATION_SPEED),
      singleActorStateChange: true
    }),
    commandReadyState: LAS.CASTING
  },

  // Frost Arc: 3 charge | 5 Water damage to space 5 in front of user
  [EQU.FROST_ARC]: {
    id: EQU.FROST_ARC,
    equippedBy: [CHC.BLUE_MAGE],
    slot: EQS.MAIN,
    enchantmentsAllowed: [ENG.DAMAGING],
    getDescription: (args: GetDescriptionArgs) => (
      describeWithCircumstances({ ...args, parts: [
        { extent: 3, kind: 'chargeCost', appliesTo: 'user' },
        { extent: 5, kind: 'damage', appliesTo: 'target' },
      ]
    })),
    getCanUse: (args: { battleState: BattleState, userId: string }) => (
      (args.battleState.fighters[args.userId]?.charge || 0) >= 3
    ),
    getStaticTargets: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      const x = (user?.coords[0] ?? 0) + 5;
      const y = user?.coords[1];
      if (!user || !x || !y) throw Error(`getAllowedTargets error: user not found with ID${userId}`);
      return [[x, y]];
    },
    targetType: 'coords',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) throw Error('Missing data from FROST_ARC getActions');
        const chargeUsage = {
          userId: args.userId,
          duration,
          affectedId: args.userId,
          charge: -3
        };
        const affectedId = getOccupantIdFromCoords({ battleState, coords: target });
        return [ chargeUsage, { userId, duration, affectedId, damage: applyLevel(5, args) } ];
      })
    }),
    getPixiEvents: (args) => actionIntoPixiEvents({
      ...args,
      actorState: LAS.INVOKING,
      swishFunctionName: 'getMagicPixiEvents',
      particleSpriteNames: [`flakelet.png`],
      delayBeforeDamaged: (40 / ANIMATION_SPEED),
      finishingDuration: (40 / ANIMATION_SPEED),
      singleActorStateChange: true
    }),
    commandReadyState: LAS.CASTING
  },

  // Snowbeam: 2 charge | 3 Water damage to all enemy targets in user's row
  [EQU.SNOWBEAM]: {
    id: EQU.SNOWBEAM,
    equippedBy: [CHC.BLUE_MAGE],
    slot: EQS.MAIN,
    enchantmentsAllowed: [ENG.DAMAGING],
    getDescription: (args: GetDescriptionArgs) => (
      describeWithCircumstances({ ...args, parts: [
        { extent: 2, kind: 'chargeCost', appliesTo: 'user' },
        { extent: 3, kind: 'damage', appliesTo: 'enemiesInUsersRow' },
      ]
    })),
    getCanUse: (args: { battleState: BattleState, userId: string }) => (
      (args.battleState.fighters[args.userId]?.charge || 0) >= 2
    ),
    getStaticTargets: (args: { battleState: BattleState, userId: string }) => (
      getEnemyRowMatching({ ...args, occupiedSpotsOnly: true })
    ),
    getStaticArea: (args: { battleState: BattleState, userId: string }) => getEnemyRowMatching(args),
    targetType: 'coords',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, getOutcomes: ((args) => {
        const { userId, target } = args;
        if (!target) throw Error('Missing data from SNOWBEAM getActions');
        const chargeUsage = {
          userId: args.userId,
          duration,
          affectedId: args.userId,
          charge: -2
        };
        const affectedIds = getEnemyRowMatching({ ...args, occupiedSpotsOnly: true })
        .map((coords) => getOccupantIdFromCoords({ ...args, coords }));
        return [ chargeUsage, ...affectedIds.map((affectedId) => (
          { userId, duration, affectedId, damage: applyLevel(3, args) }
        )) ];
      })
    }),
    getPixiEvents: (args) => actionIntoPixiEvents({
      ...args,
      actorState: LAS.INVOKING,
      swishFunctionName: 'getMagicPixiEvents',
      particleSpriteNames: [`flakelet.png`],
      delayBeforeDamaged: (40 / ANIMATION_SPEED),
      finishingDuration: (40 / ANIMATION_SPEED),
      singleActorStateChange: true
    }),
    commandReadyState: LAS.CASTING
  },
};

export default equipmentsBlueMage;