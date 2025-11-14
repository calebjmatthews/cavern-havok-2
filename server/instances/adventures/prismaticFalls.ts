import type Adventure from "@server/models/adventure";
import type Treasure from "@common/models/treasure";
import type Fighter from "@common/models/fighter";
import Encounter from "@server/models/encounter";
import EncounterPeaceful from "@server/models/encounterPeaceful";
import getEncounter from "../encounters";
import randomFromWeighted from "@common/functions/utils/randomFromWeighted";
import { ENCOUNTERS, ENCOUNTERS_PEACEFUL } from "@server/enums";
import random from "@common/functions/utils/random";
const ENC = ENCOUNTERS;

export const prismaticFallsChamberMaker: (adventure: Adventure) => Encounter | EncounterPeaceful
= (adventure: Adventure) => {
  const chamberKinds = [
    { id: ENC.BUBBLES, weight: 10},
    { id: ENC.BUBBLES_AND_BOULDERS, weight: 10 },
    { id: ENC.FALLS_HUNTING_PARTY, weight: 10 }
  ];

  if (adventure.chamberIdsFinished.length === 2) return {
    id: ENCOUNTERS_PEACEFUL.FINISH_ROOM,
    type: 'peaceful',
    getIntroText: () => `You've done it! You found your way to a treasure-filled pile of floatsam at the bottom of a waterfall.`
  };

  const remainingChambers = chamberKinds.filter((ck) => !adventure.chamberIdsFinished.includes(ck.id));

  const chamberId = remainingChambers[randomFromWeighted(remainingChambers) || 0]?.id;
  return getEncounter(chamberId || ENCOUNTERS.MISSING);
};

export const prismaticFallsTreasureMaker: (args: { adventure: Adventure, fighter: Fighter }) => Treasure[]
= () => {
  return [
    { kind: 'cinders', quantity: Math.floor((random() * 40) + 80) },
    { kind: 'cinders', quantity: Math.floor((random() * 40) + 80) },
    { kind: 'cinders', quantity: Math.floor((random() * 40) + 80) }
  ];
};