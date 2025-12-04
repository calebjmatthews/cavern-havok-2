import type Alteration from "@common/models/alteration";
import { ALTERATIONS } from "@common/enums";
import getColumnsBetweenIds from "@common/functions/positioning/getColumnsBetweenIds";
const ALT = ALTERATIONS;

const alterations: { [id: string] : Alteration } = {
  [ALT.REGEN]: {
    id: ALT.REGEN,
    kind: 'blessing',
    getDescription: (extent: number) => (
      `${extent} healing at the end of each round, diminishes by 1 each round.`
    ),
    getExtent: (args) => (args.alterationActive.extent),
    appliesDuring: 'roundEnd',
    isHealing: true,
    declinesOnApplication: true
  },

  [ALT.VENOM]: {
    id: ALT.VENOM,
    kind: 'curse',
    getDescription: (extent: number) => (
      `${extent} damage at the end of each round, diminishes by 1 each round.`
    ),
    getExtent: (args) => (args.alterationActive.extent),
    appliesDuring: 'roundEnd',
    isDamage: true,
    declinesOnApplication: true
  },

  [ALT.POWER]: {
    id: ALT.POWER,
    kind: 'blessing',
    getDescription: (extent: number) => (
      `Deal ${extent} more damage or healing, diminishes by 1 each round.`
    ),
    getExtent: (args) => (args.alterationActive.extent),
    extentKind: 'additive',
    appliesDuring: 'usingAction',
    modKind: 'damageOrHealing',
    declinesAtEndOfRound: true
  },

  [ALT.WEAKNESS]: {
    id: ALT.WEAKNESS,
    kind: 'curse',
    getDescription: (extent: number) => (
      `Deal ${extent} less damage or healing, diminishes by 1 each round.`
    ),
    getExtent: (args) => (args.alterationActive.extent * -1),
    extentKind: 'subtractive',
    appliesDuring: 'usingAction',
    modKind: 'damageOrHealing',
    declinesAtEndOfRound: true
  },

  [ALT.SHELL]: {
    id: ALT.SHELL,
    kind: 'blessing',
    getDescription: (extent: number) => (
      `Gain ${extent} defense at the beginning of each round, diminishes by 1 each round.`
    ),
    getExtent: (args) => (args.alterationActive.extent),
    extentKind: 'additive',
    appliesDuring: 'roundStart',
    defenseAffected: true,
    declinesAtEndOfRound: true
  },

  [ALT.FRAGILE]: {
    id: ALT.FRAGILE,
    kind: 'curse',
    getDescription: (extent: number) => (
      `Gain ${extent} less defense each time, diminishes by 1 at the end of each round.`
    ),
    getExtent: (args) => (args.alterationActive.extent),
    extentKind: 'subtractive',
    appliesDuring: 'targetedByAction',
    defenseAffected: true,
    declinesAtEndOfRound: true
  },

  [ALT.FLINT_HELMET]: {
    id: ALT.FLINT_HELMET,
    kind: 'blessing',
    getDescription: () => `Damage +2 if target is in column directly in front of user.`,
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

  [ALT.FEATHER_CAP]: {
    id: ALT.FEATHER_CAP,
    kind: 'blessing',
    getDescription: () => `Damage +1 if target is 7 or more columns away.`,
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

  [ALT.RED_PEPPER_TRUFFLES]: {
    id: ALT.RED_PEPPER_TRUFFLES,
    kind: 'blessing',
    getDescription: () => `For the rest of the adventure begin battles Blessed with Shell 2.`,
    outcomeText: "will begin battles Blessed with Shell 2 for the rest of the adventure",
    getExtent: (args) => (args.alterationActive.extent * 2),
    appliesDuring: 'battleStart',
    irremovable: true,
    blessing: ALT.SHELL
  },

  [ALT.GINGERSNAP_COOKIES]: {
    id: ALT.RED_PEPPER_TRUFFLES,
    kind: 'blessing',
    getDescription: () => `For the rest of the adventure begin battles Blessed with Power 2.`,
    outcomeText: "will begin battles Blessed with Power 2 for the rest of the adventure",
    getExtent: (args) => (args.alterationActive.extent * 2),
    appliesDuring: 'battleStart',
    irremovable: true,
    blessing: ALT.POWER
  },
};

export default alterations;