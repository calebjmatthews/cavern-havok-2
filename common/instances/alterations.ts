import type Alteration from "@common/models/alteration";
import { ALTERATIONS } from "@common/enums";
import isFighterFrontColumn from "@common/functions/positioning/isFighterFrontColumn";
const ALT = ALTERATIONS;

const alterations: { [id: string] : Alteration } = {
  [ALT.FLINT_HELMET]: { // Ax power +2 if user is in front column
    id: ALT.FLINT_HELMET,
    getExtent: (args) => (
      isFighterFrontColumn({ ...args, fighterId: args.fighterId }) ? 2 : null
    ),
    extentKind: 'additive',
    appliesDuring: 'usingAction',
    modKind: 'damage'
  }
};

export default alterations;