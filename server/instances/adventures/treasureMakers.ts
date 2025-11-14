import type Treasure from "@common/models/treasure";
import type Adventure from "@server/models/adventure";
import { prismaticFallsTreasureMaker } from "./prismaticFalls";
import { ADVENTURE_KINDS } from "@common/enums";
import type Fighter from "@common/models/fighter";

const treasureMakers: { [adventureKindId: string]
  : (args: { adventure: Adventure, fighter: Fighter }) => Treasure[] }
= {
  [ADVENTURE_KINDS.PRISMATIC_FALLS]: prismaticFallsTreasureMaker
};

const getTreasureMaker = (adventureKindId: string) => {
  const treasureMaker = treasureMakers[adventureKindId];
  if (!treasureMaker) throw Error(`Cannot find treasureMaker ID${adventureKindId} in getTreasureMaker.`);
  return treasureMaker;
};

export default getTreasureMaker;