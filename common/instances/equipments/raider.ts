import type Equipment from "@common/models/equipment";
import type BattleState from "@common/models/battle_state";
import isUserFrontRow from "@common/functions/isUserFrontRow";
import getFighterCoords from "@common/functions/getFighterCoords";
import getSurroundingOpenSpaces from "@common/functions/getSurroundingOpenSpaces";
import getFirstInRows from "@common/functions/getFirstInRows";
import getFirstInRow from "@common/functions/getFirstInRow";
import getFrontColumn from "@common/functions/getFrontColumn";
import { EQUIPMENTS } from "@common/enums";
import getFightersInCoordsSet from "@common/functions/getFighterIdsInCoordsSet";

const EQU = EQUIPMENTS;

const equipmentsRaider: { [id: string] : Equipment } = {

  // Horned Helmet (Head): ax power +2 if user is in front column
  [EQU.HORNED_HELMET]: {
    id: EQU.HORNED_HELMET,
    getPassives: (args: { battleState: BattleState, userId: string }) => (
      (isUserFrontRow(args)) ? [{ fighterEffectedId: args.userId, damageMod: 2 }] : []
    )
  },

  // Hide Vest (Top): Defense +3
  [EQU.HIDE_VEST]: {
    id: EQU.HIDE_VEST,
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      [getFighterCoords(args)]
    ),
    getEffects: (args: { battleState: BattleState, userId: string, target: [number, number] } ) => (
      [{ fighterEffectedId: args.userId, defense: 3 }]
    )
  },

  // Hob-nailed Boots (Bottom): Move 1-2
  [EQU.HOB_NAILED_BOOTS]: {
    id: EQU.HOB_NAILED_BOOTS,
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getSurroundingOpenSpaces({
        battleState: args.battleState, 
        origin: getFighterCoords(args),
        min: 1,
        max: 2
      })
    ),
    getEffects: (args: { battleState: BattleState, userId: string, target: [number, number] } ) => (
      [{ fighterEffectedId: args.userId, moveTo: args.target }]
    )
  },

  // Hatchet: 2 damage to first target in row
  [EQU.HATCHET]: {
    id: EQU.HATCHET,
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getFirstInRows(args.battleState)
    ),
    getEffects: (args: { battleState: BattleState, userId: string, target: [number, number] } ) => {
      const fighterEffectedId = getFirstInRow({ battleState: args.battleState, rowIndex: args.target[1] });
      if (!fighterEffectedId) return [];
      return [{ fighterEffectedId, damage: 2 }];
    }
  },

  // Sweep Ax: 1 damage to front column
  [EQU.SWEEP_AX]: {
    id: EQU.SWEEP_AX,
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getFrontColumn(args)
    ),
    getEffects: (args: { battleState: BattleState, userId: string, target: [number, number] } ) => {
      const coordsSet = getFrontColumn(args);
      const fightersEffectedIds = getFightersInCoordsSet({ battleState: args.battleState, coordsSet })
      if (fightersEffectedIds.length === 0) return [];
      return fightersEffectedIds.map((fighterEffectedId) => ({ fighterEffectedId, damage: 1 }));
    }
  },

  // Cleaving Ax: 3 charge; 5 damage to first target in row
  [EQU.CLEAVING_AX]: {
    id: EQU.CLEAVING_AX,
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getFirstInRows(args.battleState)
    ),
    getEffects: (args: { battleState: BattleState, userId: string, target: [number, number] } ) => {
      const fighterEffectedId = getFirstInRow({ battleState: args.battleState, rowIndex: args.target[1] });
      const chargeUsage = { fighterEffectedId: args.userId, charge: -3 };
      if (!fighterEffectedId) return [chargeUsage];
      return [chargeUsage, { fighterEffectedId, damage: 5 }];
    }
  },
};

export default equipmentsRaider;