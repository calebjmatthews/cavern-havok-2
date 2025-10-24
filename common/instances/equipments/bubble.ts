import type Equipment from "@common/models/equipment";
import type BattleState from "@common/models/battle_state";
import getFighterCoords from "@common/functions/positioning/getFighterCoords";
import getSurroundingOpenSpaces from "@common/functions/positioning/getSurroundingOpenSpaces";
import getFirstInRows from "@common/functions/positioning/getFirstInRows";
import getFirstInRow from "@common/functions/positioning/getFirstInRow";
import { EQUIPMENTS, EQUIPMENT_SLOTS, MONSTERS } from "@common/enums";
const EQU = EQUIPMENTS;
const EQS = EQUIPMENT_SLOTS;
const MON = MONSTERS;

const equipmentsBubble: { [id: string] : Equipment } = {
  // Wobbly Membrane (Top): Defense +1
  [EQU.WOBBLY_MEMBRANE]: {
    id: EQU.WOBBLY_MEMBRANE,
    slot: EQS.TOP,
    equippedBy: MON.BUBBLE,
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      [getFighterCoords(args)]
    ),
    getEffects: (args: { battleState: BattleState, userId: string, target: [number, number] } ) => (
      [{ fighterAffectedId: args.userId, defense: 1 }]
    )
  },

  // Drifting on the Breeze (Bottom): Move 1 - 3
  [EQU.DRIFTING_ON_THE_BREEZE]: {
    id: EQU.DRIFTING_ON_THE_BREEZE,
    equippedBy: MON.BUBBLE,
    slot: EQS.BOTTOM,
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getSurroundingOpenSpaces({ battleState: args.battleState, 
        origin: getFighterCoords(args),
        min: 1,
        max: 3
      })
    ),
    getEffects: (args: { battleState: BattleState, userId: string, target: [number, number] } ) => (
      [{ fighterAffectedId: args.userId, moveTo: args.target }]
    )
  },

  // Foamy Dash: 2 damage to first target in row
  [EQU.FOAMY_DASH]: {
    id: EQU.FOAMY_DASH,
    equippedBy: MON.BUBBLE,
    slot: EQS.MAIN,
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getFirstInRows(args.battleState)
    ),
    getEffects: (args: { battleState: BattleState, userId: string, target: [number, number] } ) => {
      const fighterAffectedId = getFirstInRow({ battleState: args.battleState, rowIndex: args.target[1] });
      if (!fighterAffectedId) return [];
      return [{ fighterAffectedId, damage: 2 }];
    }
  },

  // Goodbye!: 3 charge | 5 damage to first taret in row, destroy self
  [EQU.GOODBYE]: {
    id: EQU.GOODBYE,
    equippedBy: MON.BUBBLE,
    slot: EQS.MAIN,
    getCanUse: (args: { battleState: BattleState, userId: string }) => (
      (args.battleState.fighters[args.userId]?.charge || 0) >= 3
    ),
    getCanTarget: (args: { battleState: BattleState, userId: string }) => (
      getFirstInRows(args.battleState)
    ),
    getEffects: (args: { battleState: BattleState, userId: string, target: [number, number] } ) => {
      const fighterAffectedId = getFirstInRow({ battleState: args.battleState, rowIndex: args.target[1] });
      const chargeUsage = { fighterAffectedId: args.userId, charge: -3 };
      const destroySelf = { fighterAffectedId: args.userId, damage: 6 };
      if (!fighterAffectedId) return [chargeUsage, destroySelf];
      return [chargeUsage, { fighterAffectedId, damage: 5, destroySelf }];
    }
  },
};

export default equipmentsBubble;