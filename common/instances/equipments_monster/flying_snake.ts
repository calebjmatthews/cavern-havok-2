import type Equipment from "@common/models/equipment";
import type { GetSubCommandsArgs } from "@common/models/equipment";
import type BattleState from "@common/models/battleState";
import getOccupantCoords from "@common/functions/positioning/getOccupantCoords";
import getSurroundingSpaces from "@common/functions/positioning/getSurroundingSpaces";
import getCoordsSetOfFirstInEnemyRows from "@common/functions/positioning/getCoordsSetOfFirstInEnemyRows";
import getCoordsOfFirstInEnemyRow from "@common/functions/positioning/getIdOfFirstInEnemyRow";
import createSubCommands from "@common/functions/battleLogic/createSubCommands";
import { EQUIPMENTS, EQUIPMENT_SLOTS, CHARACTER_CLASSES, ACTION_PRIORITIES, ALTERATIONS }
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
    description: '3 Defense',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const userCoords = getOccupantCoords({ ...args, occupantId: args.userId });
      return userCoords ? [userCoords] : []
    },
    targetType: 'id',
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, priority: ACP.FIRST, getOutcomes: ((args) => [
        { userId: args.userId, duration, affectedId: args.userId, defense: 3 }
      ])
    })
  },

  // Gliding Slither (Bottom): 1 - 3 move
  [EQU.GLIDING_SLITHER]: {
    id: EQU.GLIDING_SLITHER,
    equippedBy: [CHC.FLYING_SNAKE],
    slot: EQS.BOTTOM,
    description: 'Move 1 - 3',
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
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
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
    description: '1 damage to first target in enemy row',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
        return [{ userId: args.userId, duration, affectedId, damage: 1 }];
      })
    })
  },

  // Headbonk: 1 damage to first target in enemy row
  [EQU.VENOMOUS_FANGS]: {
    id: EQU.VENOMOUS_FANGS,
    equippedBy: [CHC.FLYING_SNAKE],
    slot: EQS.MAIN,
    description: '1 damage and a Curse of 1 Venom to first target in enemy row',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) return [];
        const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
        return [
          { userId: args.userId, duration, affectedId, damage: 1 },
          { userId: args.userId, duration, affectedId, curse: { alterationId: ALT.VENOM, extent: 1 }}
        ];
      })
    })
  },
};

export default equipmentsFlyingSnake;