import type Adventure from "@server/models/adventure";
import type Encounter from "@server/models/encounter";
import type EncounterPeaceful from "@server/models/encounterPeaceful";
import { prismaticFallsChamberMaker } from "./prismaticFalls";
import { ADVENTURE_KINDS } from "@common/enums";

const chamberMakers: { [adventureKindId: string]
  : (adventure: Adventure) => Encounter | EncounterPeaceful }
= {
  [ADVENTURE_KINDS.PRISMATIC_FALLS]: prismaticFallsChamberMaker
};

const getChamberMaker = (adventureKindId: ADVENTURE_KINDS) => {
  const chamberMaker = chamberMakers[adventureKindId];
  if (!chamberMaker) throw Error(`Cannot find chamberMaker ID${adventureKindId} in getChamberMaker.`);
  return chamberMaker;
};

export default getChamberMaker;