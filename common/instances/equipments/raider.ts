import type Equipment from "@common/models/equipment";
import type BattleState from "@common/models/battleState";
import isFighterFrontColumn from "@common/functions/positioning/isFighterFrontColumn";
import getFighterCoords from "@common/functions/positioning/getFighterCoords";
import getSurroundingSpaces from "@common/functions/positioning/getSurroundingSpaces";
import getCoordsSetOfFirstInEnemyRows from "@common/functions/positioning/getCoordsSetOfFirstInEnemyRows";
import getCoordsOfFirstInEnemyRow from "@common/functions/positioning/getIdOfFirstInEnemyRow";
import getFrontColumn from "@common/functions/positioning/getFrontColumn";
import getFightersInCoordsSet from "@common/functions/positioning/getFighterIdsInCoordsSet";
import { EQUIPMENTS, EQUIPMENT_SLOTS, CHARACTER_CLASSES } from "@common/enums";
import getEnemySide from "@common/functions/positioning/getEnemySide";
const EQU = EQUIPMENTS;
const EQS = EQUIPMENT_SLOTS;
const CHC = CHARACTER_CLASSES;

const equipmentsRaider: { [id: string] : Equipment } = {

  // Horned Helmet (Head): ax power +2 if user is in front column
  [EQU.HORNED_HELMET]: {
    id: EQU.HORNED_HELMET,
    equippedBy: CHC.RAIDER,
    slot: EQS.HEAD,
    getPassives: (args: { battleState: BattleState, userId: string }) => (
      (isFighterFrontColumn({ ...args, fighterId: args.userId })) ? [
        { fighterAffectedId: args.userId, damageMod: 2 }
      ] : []
    )
  },

  // Hide Vest (Top): Defense +3
  [EQU.HIDE_VEST]: {
    id: EQU.HIDE_VEST,
    equippedBy: CHC.RAIDER,
    slot: EQS.TOP,
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      [getFighterCoords({ ...args, fighterId: args.userId })]
    ),
    getEffects: (args: { battleState: BattleState, userId: string, target: [number, number] } ) => (
      [{ fighterAffectedId: args.userId, defense: 3 }]
    )
  },

  // Hob-nailed Boots (Bottom): Move 1-2
  [EQU.HOB_NAILED_BOOTS]: {
    id: EQU.HOB_NAILED_BOOTS,
    equippedBy: CHC.RAIDER,
    slot: EQS.BOTTOM,
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
    getEffects: (args: { battleState: BattleState, userId: string, target: [number, number] } ) => (
      [{ fighterAffectedId: args.userId, moveTo: args.target }]
    )
  },

  // Hatchet: 2 damage to first target in row
  [EQU.HATCHET]: {
    id: EQU.HATCHET,
    equippedBy: CHC.RAIDER,
    slot: EQS.MAIN,
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    getEffects: (args: { battleState: BattleState, userId: string, target: [number, number] } ) => {
      const { battleState, userId, target } = args;
      const fighterAffectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
      if (!fighterAffectedId) return [];
      return [{ fighterAffectedId, damage: 2 }];
    }
  },

  // Sweep Ax: 1 damage to front column
  [EQU.SWEEP_AX]: {
    id: EQU.SWEEP_AX,
    equippedBy: CHC.RAIDER,
    slot: EQS.MAIN,
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getFrontColumn({ ...args, side: getEnemySide(args) })
    ),
    getEffects: (args: { battleState: BattleState, userId: string, target: [number, number] } ) => {
      const coordsSet = getFrontColumn({ ...args, side: getEnemySide(args) });
      const fightersEffectedIds = getFightersInCoordsSet({ battleState: args.battleState, coordsSet })
      if (fightersEffectedIds.length === 0) return [];
      return fightersEffectedIds.map((fighterAffectedId) => ({ fighterAffectedId, damage: 1 }));
    }
  },

  // Cleaving Ax: 3 charge; 5 damage to first target in row
  [EQU.CLEAVING_AX]: {
    id: EQU.CLEAVING_AX,
    equippedBy: CHC.RAIDER,
    slot: EQS.MAIN,
    getCanUse: (args: { battleState: BattleState, userId: string }) => (
      (args.battleState.fighters[args.userId]?.charge || 0) >= 3
    ),
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getCoordsSetOfFirstInEnemyRows(args)
    ),
    getEffects: (args: { battleState: BattleState, userId: string, target: [number, number] } ) => {
      const { battleState, userId, target } = args;
      const fighterAffectedId = getCoordsOfFirstInEnemyRow({ battleState, userId, rowIndex: target[1] });
      const chargeUsage = { fighterAffectedId: args.userId, charge: -3 };
      if (!fighterAffectedId) return [chargeUsage];
      return [chargeUsage, { fighterAffectedId, damage: 5 }];
    }
  },
};

export default equipmentsRaider;