import { ADVENTURE_KINDS } from "@common/enums";
import type AdventureKind from "@common/models/adventureKind";
import prismaticFalls from "./prismaticFalls";

const adventureKinds: { [adventureKindId: string] : AdventureKind } = {
  [ADVENTURE_KINDS.PRISMATIC_FALLS]: prismaticFalls
};

const getAdventureKind = (adventureKindId: string) => {
  const adventureKind = adventureKinds[adventureKindId];
  if (!adventureKind) throw Error(`getObstacleKind error, ${adventureKindId} not found.`);
  return adventureKind;
};

export default getAdventureKind;