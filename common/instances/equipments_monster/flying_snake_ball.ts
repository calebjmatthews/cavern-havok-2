import type Equipment from "@common/models/equipment";
import type BattleState from "@common/models/battleState";
import type { GetActionsArgs } from "@common/models/equipment";
import getOccupantCoords from "@common/functions/positioning/getOccupantCoords";
import getCoordsSetOfFirstInEnemyRows
  from "@common/functions/positioning/getCoordsSetOfFirstInEnemyRows";
import getCoordsOfFirstInEnemyRow from "@common/functions/positioning/getIdOfFirstInEnemyRow";
import createActions from "@common/functions/battleLogic/createActions";
import getCoordsOnSide from "@common/functions/positioning/getCoordsOnSide";
import applyLevel from "@common/functions/battleLogic/applyLevel";
import { EQUIPMENTS, EQUIPMENT_SLOTS, CHARACTER_CLASSES, ACTION_PRIORITIES }
  from "@common/enums";
import { OUTCOME_DURATION_DEFAULT } from "@common/constants";
const EQU = EQUIPMENTS;
const EQS = EQUIPMENT_SLOTS;
const CHC = CHARACTER_CLASSES;
const ACP = ACTION_PRIORITIES;
const duration = OUTCOME_DURATION_DEFAULT;

const equipmentsFlyingSnakeBall: { [id: string] : Equipment } = {
  // Tighten Up (Top): 4 Defense
  [EQU.TIGHTEN_UP]: {
    id: EQU.TIGHTEN_UP,
    equippedBy: [CHC.FLYING_SNAKE_BALL],
    slot: EQS.TOP,
    description: '4 Defense',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const userCoords = getOccupantCoords({ ...args, occupantId: args.userId });
      return userCoords ? [userCoords] : []
    },
    targetType: 'id',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, priority: ACP.FIRST, getOutcomes: ((args) => [
        { userId: args.userId, duration, affectedId: args.userId, defense: applyLevel(4, args) }
      ])
    })
  },

  // Squirming Heads: 5 damage to first target in enemy row
  [EQU.SQUIRMING_HEADS]: {
    id: EQU.SQUIRMING_HEADS,
    equippedBy: [CHC.FLYING_SNAKE_BALL],
    slot: EQS.MAIN,
    description: '5 damage to first target in enemy row',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
        return [{ userId: args.userId, duration, affectedId, damage: applyLevel(5, args) }];
      })
    })
  },

  // Wiggle Out: A Flying Snake wiggles out onto a neighboring space
  [EQU.WIGGLE_OUT]: {
    id: EQU.WIGGLE_OUT,
    equippedBy: [CHC.FLYING_SNAKE_BALL],
    slot: EQS.MAIN,
    description: `A Flying Snake wiggles out onto a neighboring space`,
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const { battleState, userId } = args;
      const user = battleState.fighters[userId];
      if (!user) throw Error(`getCanTarget error: user not found with ID${userId}`);
      return getCoordsOnSide({ battleState, side: user.side, onlyOpenSpaces: true });
    },
    targetType: 'coords',
    getActions: (args: GetActionsArgs) => createActions({
      ...args, duration, getOutcomes: ((args) => {
        const { userId, target } = args;
        if (!target) return [];
        return [{ userId, duration, makeFighter: { className: CHC.FLYING_SNAKE, coords: target } }];
      } )
    })
  },
};

export default equipmentsFlyingSnakeBall;