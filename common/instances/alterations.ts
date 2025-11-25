import type Alteration from "@common/models/alteration";
import { ALTERATIONS } from "@common/enums";
import getColumnsBetweenIds from "@common/functions/positioning/getColumnsBetweenIds";
const ALT = ALTERATIONS;

const alterations: { [id: string] : Alteration } = {
  [ALT.REGEN]: { // X healing at the end of each round, diminishes by 1 at the end of each round.
    id: ALT.REGEN,
    kind: 'blessing',
    getExtent: (args) => (args.alterationActive.extent),
    appliesDuring: 'roundEnd',
    isHealing: true,
    declinesOnApplication: true
  },

  [ALT.VENOM]: { // X damage at the end of each round, diminishes by 1 at the end of each round.
    id: ALT.VENOM,
    kind: 'curse',
    getExtent: (args) => (args.alterationActive.extent),
    appliesDuring: 'roundEnd',
    isDamage: true,
    declinesOnApplication: true
  },

  [ALT.POWER]: { // Deal X more damage or healing, diminishes by 1 at the end of each round
    id: ALT.POWER,
    kind: 'blessing',
    getExtent: (args) => (args.alterationActive.extent),
    extentKind: 'additive',
    appliesDuring: 'usingAction',
    modKind: 'damageOrHealing',
    declinesAtEndOfRound: true
  },

  [ALT.WEAKNESS]: { // Deal X less damage or healing, diminishes by 1 at the end of each round
    id: ALT.WEAKNESS,
    kind: 'curse',
    getExtent: (args) => (args.alterationActive.extent * -1),
    extentKind: 'subtractive',
    appliesDuring: 'usingAction',
    modKind: 'damageOrHealing',
    declinesAtEndOfRound: true
  },

  [ALT.SHELL]: { // Gain X defense at the beginning of each round, diminishes by 1 at the end of each round.
    id: ALT.SHELL,
    kind: 'blessing',
    getExtent: (args) => (args.alterationActive.extent),
    extentKind: 'additive',
    appliesDuring: 'roundStart',
    defenseAffected: true,
    declinesAtEndOfRound: true
  },

  [ALT.FRAGILE]: { // Gain X less defense each time, diminishes by 1 at the end of each round.
    id: ALT.FRAGILE,
    kind: 'curse',
    getExtent: (args) => (args.alterationActive.extent),
    extentKind: 'subtractive',
    appliesDuring: 'targetedByAction',
    defenseAffected: true,
    declinesAtEndOfRound: true
  },

  [ALT.FLINT_HELMET]: { // +2 Damage if target is in column directly in front of user
    id: ALT.FLINT_HELMET,
    kind: 'blessing',
    getExtent: (args) => (
      (((getColumnsBetweenIds({
        battleState: args.battleState,
        fromId: args.alterationActive.ownedBy,
        toId: args.affectedId || ''
      }) || -1) === 1) && args.userId === args.alterationActive.ownedBy)
        ? (args.alterationActive.extent * 2) : null
    ),
    extentKind: 'additive',
    appliesDuring: 'usingAction',
    irremovable: true,
    modKind: 'damage'
  },

  [ALT.FEATHER_CAP]: { // Damage +1 if target is 7 or more columns away
    id: ALT.FEATHER_CAP,
    kind: 'blessing',
    getExtent: (args) => (
      (((getColumnsBetweenIds({
        battleState: args.battleState,
        fromId: args.alterationActive.ownedBy,
        toId: args.affectedId || ''
      }) || -1) >= 7) && args.userId === args.alterationActive.ownedBy)
        ? (args.alterationActive.extent * 1) : null
    ),
    extentKind: 'additive',
    appliesDuring: 'usingAction',
    irremovable: true,
    modKind: 'damage'
  },

  [ALT.RED_PEPPER_TRUFFLES]: { // For the rest of the adventure begin battles Blessed with Shell 2.
    id: ALT.RED_PEPPER_TRUFFLES,
    kind: 'blessing',
    getExtent: (args) => (args.alterationActive.extent * 2),
    appliesDuring: 'battleStart',
    irremovable: true,
    blessing: ALT.SHELL
  },

  [ALT.GINGERSNAP_COOKIES]: { // For the rest of the adventure begin battles Blessed with Power 2.
    id: ALT.RED_PEPPER_TRUFFLES,
    kind: 'blessing',
    getExtent: (args) => (args.alterationActive.extent * 2),
    appliesDuring: 'battleStart',
    irremovable: true,
    blessing: ALT.POWER
  },
};

export default alterations;