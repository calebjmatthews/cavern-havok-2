import type Equipment from "@common/models/equipment";
import type { GetSubCommandsArgs } from "@common/models/equipment";
import type BattleState from "@common/models/battleState";
import getOccupantCoords from "@common/functions/positioning/getOccupantCoords";
import getSurroundingSpaces from "@common/functions/positioning/getSurroundingSpaces";
import getCoordsSetOfFirstInEnemyRows from "@common/functions/positioning/getCoordsSetOfFirstInEnemyRows";
import getCoordsOfFirstInEnemyRow from "@common/functions/positioning/getIdOfFirstInEnemyRow";
import createSubCommands from "@common/functions/battleLogic/createSubCommands";
import getOccupantById from '@common/functions/positioning/getOccupantById';
import { EQUIPMENTS, EQUIPMENT_SLOTS, CHARACTER_CLASSES, ACTION_PRIORITIES } from "@common/enums";
import { OUTCOME_DURATION_DEFAULT } from "@common/constants";
const EQU = EQUIPMENTS;
const EQS = EQUIPMENT_SLOTS;
const CHC = CHARACTER_CLASSES;
const ACP = ACTION_PRIORITIES;
const duration = OUTCOME_DURATION_DEFAULT;

const equipmentsBubble: { [id: string] : Equipment } = {
  
  // Wobbly Membrane (Top): Defense +1
  [EQU.WOBBLY_MEMBRANE]: {
    id: EQU.WOBBLY_MEMBRANE,
    equippedBy: [CHC.BUBBLE],
    slot: EQS.TOP,
    description: 'Defense +1',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => {
      const userCoords = getOccupantCoords({ ...args, occupantId: args.userId });
      return userCoords ? [userCoords] : []
    },
    targetType: 'id',
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, priority: ACP.FIRST, getOutcomes: ((args) => [
        { userId: args.userId, duration, affectedId: args.userId, defense: 1 }
      ])
    })
  },

  // Drifting on the Breeze (Bottom): Move 1 - 3
  [EQU.DRIFTING_ON_THE_BREEZE]: {
    id: EQU.DRIFTING_ON_THE_BREEZE,
    equippedBy: [CHC.BUBBLE],
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

  // Foamy Dash: 2 damage to first target in row
  [EQU.FOAMY_DASH]: {
    id: EQU.FOAMY_DASH,
    equippedBy: [CHC.BUBBLE],
    slot: EQS.MAIN,
    description: '2 damage to first target in row',
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) throw Error("getSubCommands error: target not found");
        const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
        return [{ userId: args.userId, duration, affectedId, damage: 2 }];
      })
    })
  },

  // Goodbye!: 3 charge | 5 damage to first taret in row, destroy self
  [EQU.GOODBYE]: {
    id: EQU.GOODBYE,
    equippedBy: [CHC.BUBBLE],
    slot: EQS.MAIN,
    description: '3 charge | 5 damage to first taret in row, destroy self',
    getCanUse: (args: { battleState: BattleState, userId: string }) => (
      (args.battleState.fighters[args.userId]?.charge || 0) >= 3
    ),
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getSubCommands: (args: GetSubCommandsArgs) => createSubCommands({
      ...args, duration, getOutcomes: ((args) => {
        const { battleState, userId, target } = args;
        if (!target) throw Error("getSubCommands error: target not found");
        const user = getOccupantById({ battleState, occupantId: userId });
        const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
        const chargeUsage = { userId, duration, affectedId: userId, charge: -3 };
        const destroySelf = { userId, duration, affectedId: userId, damage: user?.healthMax || 6 };
        return [ chargeUsage, { userId, duration, affectedId, damage: 5 }, destroySelf ];
      })
    })
  },
};

export default equipmentsBubble;