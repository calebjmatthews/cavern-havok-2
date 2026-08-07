import type Alteration from "@common/models/alteration";
import getColumnsBetweenIds from "@common/functions/positioning/getColumnsBetweenIds";
import { ALTERATIONS, ELEMENTS } from "@common/enums";
const ALT = ALTERATIONS;

const alterations: { [id: string] : Alteration } = {
  [ALT.REGEN]: {
    id: ALT.REGEN,
    kind: 'blessing',
    getDescription: (extent?: number) => (
      [`${extent ?? 'X'} healing at the end of each round, diminishes by 1 each round.`]
    ),
    getExtent: (args) => (
      (args.userId === args.alterationActive.ownedBy)
      ? args.alterationActive.extent : null
    ),
    appliesDuring: 'roundEnd',
    isHealing: true,
    declinesOnApplication: true
  },

  [ALT.VENOM]: {
    id: ALT.VENOM,
    kind: 'curse',
    getDescription: (extent?: number) => (
      [`${extent ?? 'X'} damage at the end of each round, diminishes by 1 each round.`]
    ),
    getExtent: (args) => (
      (args.userId === args.alterationActive.ownedBy)
      ? args.alterationActive.extent : null
    ),
    appliesDuring: 'roundEnd',
    isDamage: true,
    declinesOnApplication: true
  },

  [ALT.POWER]: {
    id: ALT.POWER,
    kind: 'blessing',
    getDescription: (extent?: number) => (
      [`Deal ${extent ?? 'X'} more damage or healing, diminishes by 1 each round.`]
    ),
    getExtent: (args) => (
      (args.userId === args.alterationActive.ownedBy)
      ? args.alterationActive.extent : null
    ),
    extentKind: 'additive',
    appliesDuring: 'usingAction',
    modKind: 'damageOrHealing',
    declinesAtEndOfRound: true
  },

  [ALT.WEAKNESS]: {
    id: ALT.WEAKNESS,
    kind: 'curse',
    getDescription: (extent?: number) => (
      [`Deal ${extent ?? 'X'} less damage or healing, diminishes by 1 each round.`]
    ),
    getExtent: (args) => (
      (args.userId === args.alterationActive.ownedBy)
      ? (args.alterationActive.extent * -1) : null
    ),
    extentKind: 'subtractive',
    appliesDuring: 'usingAction',
    modKind: 'damageOrHealing',
    declinesAtEndOfRound: true
  },

  [ALT.SHELL]: {
    id: ALT.SHELL,
    kind: 'blessing',
    getDescription: (extent?: number) => (
      [`Gain ${extent ?? 'X'} defense at the beginning of each round, diminishes by 1 each round.`]
    ),
    getExtent: (args) => (
      (args.userId === args.alterationActive.ownedBy)
      ? args.alterationActive.extent : null
    ),
    extentKind: 'additive',
    appliesDuring: 'roundStart',
    modKind: 'defense',
    declinesAtEndOfRound: true
  },

  [ALT.FRAGILE]: {
    id: ALT.FRAGILE,
    kind: 'curse',
    getDescription: (extent?: number) => (
      [`Gain ${extent ?? 'X'} less defense each time, diminishes by 1 at the end of each round.`]
    ),
    getExtent: (args) => (
      (args.userId === args.alterationActive.ownedBy)
      ? args.alterationActive.extent : null
    ),
    extentKind: 'subtractive',
    appliesDuring: 'targetedByAction',
    modKind: 'defense',
    declinesAtEndOfRound: true
  },

  [ALT.QUICK]: {
    id: ALT.QUICK,
    kind: 'blessing',
    getDescription: (extent?: number) => (
      [`Act with ${extent ?? 'X'} more speed, diminishes by 1 each round.`]
    ),
    getExtent: (args) => (
      (args.userId === args.alterationActive.ownedBy)
      ? args.alterationActive.extent : null
    ),
    extentKind: 'additive',
    appliesDuring: 'usingAction',
    declinesAtEndOfRound: true
  },

  [ALT.LAG]: {
    id: ALT.LAG,
    kind: 'curse',
    getDescription: (extent?: number) => (
      [`Act with ${extent ?? 'X'} less speed, diminishes by 1 each round.`]
    ),
    getExtent: (args) => (
      (args.userId === args.alterationActive.ownedBy)
      ? args.alterationActive.extent : null
    ),
    extentKind: 'subtractive',
    appliesDuring: 'usingAction',
    declinesAtEndOfRound: true
  },

  [ALT.ANNOINTED] : {
    id: ALT.ANNOINTED,
    kind: 'blessing',
    getDescription: (extent?: number) => (
      [`Water healing or defense is doubled but removes this blessing, expires in ${extent ?? 'X'} rounds.`]
    ),
    getExtent: (args) => ((
      (args.affectedId === args.alterationActive.ownedBy)
      && ((args.outcome?.elements ?? []).includes(ELEMENTS.WATER))
      ) ? 2 : null
    ),
    extentKind: 'multiplicative',
    appliesDuring: 'usingAction',
    modKind: 'defenseOrHealing',
    expiresOnApplication: true
  },

  [ALT.SHARD_HELMET]: {
    id: ALT.SHARD_HELMET,
    kind: 'blessing',
    getDescription: (extent?: number) => (
      [`Damage +${extent ?? 'X'} if target is in column directly in front of user.`]
    ),
    getExtent: (args) => (
      (((getColumnsBetweenIds({
        battleState: args.battleState,
        fromId: args.alterationActive.ownedBy,
        toId: args.affectedId || ''
      }) || -1) === 1) && args.userId === args.alterationActive.ownedBy)
        ? args.alterationActive.extent : null
    ),
    extentKind: 'additive',
    appliesDuring: 'usingAction',
    irremovable: true,
    modKind: 'damage'
  },

  [ALT.ROGASA]: {
    id: ALT.ROGASA,
    kind: 'blessing',
    getDescription: () => [`Damage +1 if target is 7 or more columns away.`],
    getExtent: (args) => (
      (((getColumnsBetweenIds({
        battleState: args.battleState,
        fromId: args.alterationActive.ownedBy,
        toId: args.affectedId || ''
      }) || -1) >= 7) && args.userId === args.alterationActive.ownedBy)
        ? args.alterationActive.extent : null
    ),
    extentKind: 'additive',
    appliesDuring: 'usingAction',
    irremovable: true,
    modKind: 'damage'
  },

  [ALT.RAINFALL_HOOD_HEALING]: {
    id: ALT.RAINFALL_HOOD_HEALING,
    kind: 'blessing',
    getDescription: () => [`Healing effects +1 to targets other than user.`],
    getExtent: (args) => (
      ((args.userId === args.alterationActive.ownedBy) && (args.affectedId !== args.userId))
        ? args.alterationActive.extent : null
    ),
    extentKind: 'additive',
    appliesDuring: 'usingAction',
    irremovable: true,
    modKind: 'healing'
  },

  [ALT.STARTING_POWER]: {
    id: ALT.STARTING_POWER,
    kind: 'blessing',
    getDescription: (extent?: number) => (
      [`Begin battles Blessed with ${extent ?? 'X'} Power.`]
    ),
    getExtent: (args) => (
      (args.userId === args.alterationActive.ownedBy)
      ? args.alterationActive.extent : null
    ),
    appliesDuring: 'battleStart',
    irremovable: true,
    blessing: ALT.POWER
  },
  
  [ALT.STARTING_SHELL]: {
    id: ALT.STARTING_SHELL,
    kind: 'blessing',
    getDescription: (extent?: number) => (
      [`Begin battles Blessed with ${extent ?? 'X'} Shell.`]
    ),
    getExtent: (args) => (
      (args.userId === args.alterationActive.ownedBy)
      ? args.alterationActive.extent : null
    ),
    appliesDuring: 'battleStart',
    irremovable: true,
    blessing: ALT.SHELL
  },
};

export default alterations;