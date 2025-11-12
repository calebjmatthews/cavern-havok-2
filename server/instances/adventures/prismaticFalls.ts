import type Adventure from "@server/models/adventure"
import Encounter from "@server/models/encounter"
import EncounterPeaceful from "@server/models/encounterPeaceful"
import { ENCOUNTERS, ENCOUNTERS_PEACEFUL } from "@server/enums";
import getEncounter from "../encounters";
import randomFromWeighted from "@common/functions/utils/randomFromWeighted";
import type Treasure from "@common/models/treasure";
const ENC = ENCOUNTERS;

export const prismaticFallsChamberMaker: (adventure: Adventure) => Encounter | EncounterPeaceful
= (adventure: Adventure) => {
  const chamberKinds = [
    { id: ENC.BUBBLES, weight: 10},
    { id: ENC.BUBBLES_AND_BOULDERS, weight: 10 }
  ];

  if (adventure.chamberKindsFinished.length === 2) return {
    id: ENCOUNTERS_PEACEFUL.FINISH_ROOM,
    type: 'peaceful',
    getIntroText: () => `You've done it! You found your way to a treasure-filled pile of floatsam at the bottom of a waterfall.`
  };

  const remainingChambers = chamberKinds.filter((ck) => !adventure.chamberKindsFinished.includes(ck.id));

  const chamberId = remainingChambers[randomFromWeighted(remainingChambers) || 0]?.id;
  return getEncounter(chamberId || ENCOUNTERS.MISSING);
};

export const prismaticFallsTreasureMaker: (adventure: Adventure) => Treasure[]
= () => {
  return [{ kind: 'cinders', quantity: 100 }];
};