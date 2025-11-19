import type Alteration from "@common/models/alteration";
import { ALTERATIONS } from "@common/enums";
import getColumnsBetweenIds from "@common/functions/positioning/getColumnsBetweenIds";
const ALT = ALTERATIONS;

const alterations: { [id: string] : Alteration } = {
  [ALT.VENOM]: { // X damage at the end of each round, diminishes by 1 at the end of each round.
    id: ALT.VENOM,
    kind: 'curse',
    getExtent: (args) => (args.alterationActive.extent),
    appliesDuring: 'roundEnd',
    isDamage: true,
    declinesOnApplication: true,
  },

  [ALT.REGEN]: { // X healing at the end of each round, diminishes by 1 at the end of each round.
    id: ALT.REGEN,
    kind: 'blessing',
    getExtent: (args) => (args.alterationActive.extent),
    appliesDuring: 'roundEnd',
    isHealing: true,
    declinesOnApplication: true,
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
        ? 2 : null
    ),
    extentKind: 'additive',
    appliesDuring: 'usingAction',
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
      }) || -1) >= 7) && args.userId === args.alterationActive.ownedBy) ? 1 : null
    ),
    extentKind: 'additive',
    appliesDuring: 'usingAction',
    modKind: 'damage'
  },
};

export default alterations;