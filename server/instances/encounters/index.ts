
import type Encounter from "@server/models/encounter";
import { ENCOUNTERS } from "@server/enums";
import bubbles from './bubbles';
import bubblesAndBoulders from "./bubblesAndBoulders";
import fallsHuntingParty from "./fallsHuntingParty";


const encounters: { [encounterId: string]: Encounter } = {
  [ENCOUNTERS.BUBBLES]: bubbles,
  [ENCOUNTERS.BUBBLES_AND_BOULDERS]: bubblesAndBoulders,
  [ENCOUNTERS.FALLS_HUNTING_PARTY]: fallsHuntingParty
};

const getEncounter = (encounterId: ENCOUNTERS) => {
  const encounter = encounters[encounterId];
  if (!encounter) throw Error(`getEncounter error, ${encounterId} not found.`);
  return encounter;
};

export default getEncounter;