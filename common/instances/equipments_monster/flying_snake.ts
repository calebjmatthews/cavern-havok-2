import type Equipment from "@common/models/equipment";
import type { GetActionsArgs, GetDescriptionArgs } from "@common/models/equipment";
import type BattleState from "@common/models/battleState";
import getOccupantCoords from "@common/functions/positioning/getOccupantCoords";
import getSurroundingSpaces from "@common/functions/positioning/getSurroundingSpaces";
import getCoordsSetOfFirstInEnemyRows from "@common/functions/positioning/getCoordsSetOfFirstInEnemyRows";
import getCoordsOfFirstInEnemyRow from "@common/functions/positioning/getIdOfFirstInEnemyRow";
import createActions from "@common/functions/battleLogic/createActions";
import applyCircumstances from "@common/functions/battleLogic/applyCircumstances";
import { EQUIPMENTS, EQUIPMENT_SLOTS, CHARACTER_CLASSES, ACTION_PRIORITIES, ALTERATIONS, TERMS }
  from "@common/enums";
import { OUTCOME_DURATION_DEFAULT } from "@common/constants";
const EQU = EQUIPMENTS;
const EQS = EQUIPMENT_SLOTS;
const CHC = CHARACTER_CLASSES;
const ACP = ACTION_PRIORITIES;
const ALT = ALTERATIONS;
const duration = OUTCOME_DURATION_DEFAULT;

const equipmentsFlyingSnake: { [id: string] : Equipment } = {
  // Curl Up (Top): 3 Defense
  [EQU.CURL_UP]: {
    id: EQU.CURL_UP,
    equippedBy: [CHC.FLYING_SNAKE],
    slot: EQS.TOP,
    getDescription: (_args: GetDescriptionArgs) => ({
      tag: 'span',
      contents: [
        { tag: 'Term', contents: [TERMS.DEFENSE] },
        `+3`
      ]
    }),
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const userCoords = getOccupantCoords({ ...args, occupantId: args.userId });
      return userCoords ? [userCoords] : []
    },
    targetType: 'id',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, priority: ACP.FIRST, getOutcomes: ((args) => [
        { userId: args.userId, duration, affectedId: args.userId, defense: applyCircumstances(3, args) }
      ])
    })
  },

  // Gliding Slither (Bottom): 1 - 3 move
  [EQU.GLIDING_SLITHER]: {
    id: EQU.GLIDING_SLITHER,
    equippedBy: [CHC.FLYING_SNAKE],
    slot: EQS.BOTTOM,
    getDescription: (_args: GetDescriptionArgs) => ({
      tag: 'span',
      contents: [`Move 1 - 3`]
    }),
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getCanTarget error: user not found with ID${userId}`);
      return getSurroundingSpaces({
        battleState,
        origin: user.coords,
        min: 1,
        max: 3,
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

  // Headbonk: 1 damage to first target in enemy row
  [EQU.HEADBONK]: {
    id: EQU.HEADBONK,
    equippedBy: [CHC.FLYING_SNAKE],
    slot: EQS.MAIN,
    getDescription: (_args: GetDescriptionArgs) => ({
      tag: 'span',
      contents: [
        `1 damage to a target in`,
        { tag: 'Term', contents: [TERMS.FRONT] }
      ]
    }),
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
        return [{ userId: args.userId, duration, affectedId, damage: applyCircumstances(1, args) }];
      })
    })
  },

  // Venomous Fangs: 1 damage and a Curse of 1 Venom to first target in enemy row
  [EQU.VENOMOUS_FANGS]: {
    id: EQU.VENOMOUS_FANGS,
    equippedBy: [CHC.FLYING_SNAKE],
    slot: EQS.MAIN,
    getDescription: (_args: GetDescriptionArgs) => ({
      tag: 'span',
      contents: [
        `1 damage and a`,
        { tag: 'Term', contents: [TERMS.CURSE] },
        `of 1`,
        { tag: 'Alteration', contents: [ALT.VENOM] },
        `to a target in`,
        { tag: 'Term', contents: [TERMS.FRONT] }
      ]
    }),
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
        return [
          { userId: args.userId, duration, affectedId, damage: applyCircumstances(1, args) },
          { userId: args.userId, duration, affectedId, curse: {
            alterationId: ALT.VENOM, extent: applyCircumstances(1, args)
          }}
        ];
      })
    })
  },
};

export default equipmentsFlyingSnake;