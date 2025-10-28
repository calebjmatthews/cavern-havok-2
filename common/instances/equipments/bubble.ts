import type Equipment from "@common/models/equipment";
import type BattleState from "@common/models/battleState";
import getFighterCoords from "@common/functions/positioning/getFighterCoords";
import getSurroundingSpaces from "@common/functions/positioning/getSurroundingSpaces";
import getCoordsSetOfFirstInEnemyRows from "@common/functions/positioning/getCoordsSetOfFirstInEnemyRows";
import getCoordsOfFirstInEnemyRow from "@common/functions/positioning/getIdOfFirstInEnemyRow";
import { EQUIPMENTS, EQUIPMENT_SLOTS, CHARACTER_CLASSES } from "@common/enums";
import { OUTCOME_DURATION_DEFAULT } from "@common/constants";
const EQU = EQUIPMENTS;
const EQS = EQUIPMENT_SLOTS;
const CHC = CHARACTER_CLASSES;
const duration = OUTCOME_DURATION_DEFAULT;

const equipmentsBubble: { [id: string] : Equipment } = {
  
  // Wobbly Membrane (Top): Defense +1
  [EQU.WOBBLY_MEMBRANE]: {
    id: EQU.WOBBLY_MEMBRANE,
    slot: EQS.TOP,
    equippedBy: CHC.BUBBLE,
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      [getFighterCoords({ ...args, fighterId: args.userId })]
    ),
    targetType: 'id',
    getOutcomes: (args: { battleState: BattleState, userId: string, target: [number, number] } ) => (
      [{ userId: args.userId, duration, affectedId: args.userId, defense: 1 }]
    )
  },

  // Drifting on the Breeze (Bottom): Move 1 - 3
  [EQU.DRIFTING_ON_THE_BREEZE]: {
    id: EQU.DRIFTING_ON_THE_BREEZE,
    equippedBy: CHC.BUBBLE,
    slot: EQS.BOTTOM,
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
    getOutcomes: (args: { battleState: BattleState, userId: string, target: [number, number] } ) => (
      [{ userId: args.userId, duration, affectedId: args.userId, moveTo: args.target }]
    )
  },

  // Foamy Dash: 2 damage to first target in row
  [EQU.FOAMY_DASH]: {
    id: EQU.FOAMY_DASH,
    equippedBy: CHC.BUBBLE,
    slot: EQS.MAIN,
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getOutcomes: (args: { battleState: BattleState, userId: string, target: [number, number] } ) => {
      const { battleState, userId, target } = args;
      const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
      if (!affectedId) return [];
      return [{ userId: args.userId, duration, affectedId, damage: 2 }];
    }
  },

  // Goodbye!: 3 charge | 5 damage to first taret in row, destroy self
  [EQU.GOODBYE]: {
    id: EQU.GOODBYE,
    equippedBy: CHC.BUBBLE,
    slot: EQS.MAIN,
    getCanUse: (args: { battleState: BattleState, userId: string }) => (
      (args.battleState.fighters[args.userId]?.charge || 0) >= 3
    ),
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    targetType: 'id',
    getOutcomes: (args: { battleState: BattleState, userId: string, target: [number, number] } ) => {
      const { battleState, userId, target } = args;
      const affectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
      const chargeUsage = { userId, duration, affectedId: userId, charge: -3 };
      const destroySelf = { userId, duration, affectedId: userId, damage: 6 };
      if (!affectedId) return [chargeUsage, destroySelf];
      return [chargeUsage, { userId, duration, affectedId, damage: 5, destroySelf }];
    }
  },
};

export default equipmentsBubble;