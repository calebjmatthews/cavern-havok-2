import type Adventure from "@server/models/adventure";
import type Encounter from "@server/models/encounter";
import type EncounterPeaceful from "@server/models/encounterPeaceful";
import type Treasure from "@common/models/treasure";
import type Fighter from "@common/models/fighter";
import { prismaticFallsChamberMaker, prismaticFallsTreasureMaker } from "./prismaticFalls";
import { ADVENTURE_KINDS } from "@common/enums";


const chamberMakers: { [adventureKindId: string]
  : (adventure: Adventure) => Encounter | EncounterPeaceful }
= {
  [ADVENTURE_KINDS.PRISMATIC_FALLS]: prismaticFallsChamberMaker
};

export const getChamberMaker = (adventureKindId: ADVENTURE_KINDS) => {
  const chamberMaker = chamberMakers[adventureKindId];
  if (!chamberMaker) throw Error(`Cannot find chamberMaker ID${adventureKindId} in getChamberMaker.`);
  return chamberMaker;
};

const treasureMakers: { [adventureKindId: string]
  : (args: { adventure: Adventure, fighter: Fighter }) => Treasure[] }
= {
  [ADVENTURE_KINDS.PRISMATIC_FALLS]: prismaticFallsTreasureMaker
};

export const getTreasureMaker = (adventureKindId: string) => {
  const treasureMaker = treasureMakers[adventureKindId];
  if (!treasureMaker) throw Error(`Cannot find treasureMaker ID${adventureKindId} in getTreasureMaker.`);
  return treasureMaker;
};