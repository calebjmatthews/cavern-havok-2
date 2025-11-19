
import type Encounter from "@server/models/encounter";
import bubbles from './bubbles';
import bubblesAndBoulders from "./bubblesAndBoulders";
import fallsHuntingParty from "./fallsHuntingParty";
import flyingSnakeBall from "./flyingSnakeBall";
import { ENCOUNTERS } from "@server/enums";

const encounters: { [encounterId: string]: Encounter } = {
  [ENCOUNTERS.BUBBLES]: bubbles,
  [ENCOUNTERS.BUBBLES_AND_BOULDERS]: bubblesAndBoulders,
  [ENCOUNTERS.FALLS_HUNTING_PARTY]: fallsHuntingParty,
  [ENCOUNTERS.FLYING_SNAKE_BALL]: flyingSnakeBall
};

const getEncounter = (encounterId: ENCOUNTERS) => {
  const encounter = encounters[encounterId];
  if (!encounter) throw Error(`getEncounter error, ${encounterId} not found.`);
  return encounter;
};

export default getEncounter;