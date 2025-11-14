import { ADVENTURE_KINDS } from "@common/enums";
import { PRISMATIC_FALLS_LENGTH } from "./prismaticFalls";

const adventureLengths: { [adventureId: string] : number } = {
  [ADVENTURE_KINDS.PRISMATIC_FALLS]: PRISMATIC_FALLS_LENGTH
};

const getAdventureLength = (adventureId: string) => adventureLengths[adventureId] ?? 3;

export default getAdventureLength;