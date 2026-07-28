import type Adventure from "@server/models/adventure/adventure";
import type Encounter from "@server/models/encounter";
import type EncounterPeaceful from "@server/models/encounterPeaceful";
import type Treasure from "@common/models/treasure";
import type Fighter from "@common/models/fighter";
import {
  prismaticFallsChamberMaker, prismaticFallsChestMaker, prismaticFallsGetChamberCount, 
  prismaticFallsTreasureMaker
} from "./prismaticFalls";
import { ADVENTURE_KINDS } from "@common/enums";

const chamberCountMakers: { [adventureKindId: string] : (difficulty: number) => number }
= {
  [ADVENTURE_KINDS.PRISMATIC_FALLS]: prismaticFallsGetChamberCount
};
export const getChamberCountMaker = (adventureKindId: ADVENTURE_KINDS) => {
  const chamberCountMaker = chamberCountMakers[adventureKindId];
  if (!chamberCountMaker) {
    throw Error(`Cannot find chamberCountMaker ID${adventureKindId} in getChamberCountMaker.`);
  };
  return chamberCountMaker;
};

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

const chestMakers: { [adventureKindId: string]
  : (args: { adventure: Adventure, fighter: Fighter }) => string[] }
= {
  [ADVENTURE_KINDS.PRISMATIC_FALLS]: prismaticFallsChestMaker
};
export const getChestsMaker = (adventureKindId: string) => {
  const chestMaker = chestMakers[adventureKindId];
  if (!chestMaker) throw Error(`Cannot find chestMaker ID${adventureKindId} in getChestsMaker.`);
  return chestMaker;
};

const treasureMakers: { [adventureKindId: string]
  : (args: { adventure: Adventure, fighter: Fighter, chestKindId: string }) => Treasure[] }
= {
  [ADVENTURE_KINDS.PRISMATIC_FALLS]: prismaticFallsTreasureMaker
};
export const getTreasureMaker = (adventureKindId: string) => {
  const treasureMaker = treasureMakers[adventureKindId];
  if (!treasureMaker) throw Error(`Cannot find treasureMaker ID${adventureKindId} in getTreasureMaker.`);
  return treasureMaker;
};