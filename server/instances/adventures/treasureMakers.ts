import type Treasure from "@common/models/treasure";
import type Adventure from "@server/models/adventure";
import { prismaticFallsTreasureMaker } from "./prismaticFalls";
import { ADVENTURE_KINDS } from "@common/enums";

const treasureMakers: { [adventureKindId: string]
  : (adventure: Adventure) => Treasure[] }
= {
  [ADVENTURE_KINDS.PRISMATIC_FALLS]: prismaticFallsTreasureMaker
};

const getTreasureMaker = (adventureKindId: ADVENTURE_KINDS) => {
  const treasureMaker = treasureMakers[adventureKindId];
  if (!treasureMaker) throw Error(`Cannot find treasureMaker ID${adventureKindId} in getTreasureMaker.`);
  return treasureMaker;
};

export default getTreasureMaker;