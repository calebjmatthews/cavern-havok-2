import type Alteration from "@common/models/alteration";
import { ALTERATIONS } from "@common/enums";
import getColumnsBetweenIds from "@common/functions/positioning/getColumnsBetweenIds";
const ALT = ALTERATIONS;

const alterations: { [id: string] : Alteration } = {
  [ALT.FLINT_HELMET]: { // +2 Damage if target is in column directly in front of user
    id: ALT.FLINT_HELMET,
    getExtent: (args) => (
      (((getColumnsBetweenIds({
        battleState: args.battleState,
        fromId: args.ownedBy,
        toId: args.affectedId || ''
      }) || -1) === 1) && args.userId === args.ownedBy)
        ? 2 : null
    ),
    extentKind: 'additive',
    appliesDuring: 'usingAction',
    modKind: 'damage'
  },
  [ALT.FEATHER_CAP]: { // Damage +1 if target is 7 or more columns away
    id: ALT.FEATHER_CAP,
    getExtent: (args) => (
      (((getColumnsBetweenIds({
        battleState: args.battleState,
        fromId: args.ownedBy,
        toId: args.affectedId || ''
      }) || -1) >= 7) && args.userId === args.ownedBy) ? 1 : null
    ),
    extentKind: 'additive',
    appliesDuring: 'usingAction',
    modKind: 'damage'
  },
};

export default alterations;