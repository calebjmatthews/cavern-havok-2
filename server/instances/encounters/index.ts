
import type Encounter from "@server/models/encounter";
import { ENCOUNTERS } from "@server/enums";
import bubbles from './bubbles';


const encounters: { [encounterId: string]: Encounter } = {
  [ENCOUNTERS.BUBBLES]: bubbles
};

const getEncounter = (encounterId: ENCOUNTERS) => {
  const encounter = encounters[encounterId];
  if (!encounter) throw Error(`getEncounter error, ${encounterId} not found.`);
  return encounter;
};

export default getEncounter;