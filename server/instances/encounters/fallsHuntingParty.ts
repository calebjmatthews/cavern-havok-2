import Encounter from "@server/models/encounter";
import getEncounterFoes from "@server/functions/battleLogic/getEncounterFoes";
import { CHARACTER_CLASSES, OBSTACLE_KINDS } from "@common/enums";
import { ENCOUNTERS } from "@server/enums";
import getEncounterObstacles from "@server/functions/battleLogic/getEncounterObstacles";
const CHC = CHARACTER_CLASSES;
const OBK = OBSTACLE_KINDS;

const fallsHuntingParty = new Encounter({
  id: ENCOUNTERS.FALLS_HUNTING_PARTY,
  type: 'battle',
  getIntroText: (() => `It's a rival spelunking party! They shout as they approch: "Hey, get your squint eyes off the treasure!" "Shove off, you bumpkins!" "We saw it first!" But they're wrong... You. You saw it first.`),
  victoryText: `"Easy, mates, easy." "We were just playing, sure." "Didn't even want that pile of treasure anyway." .`,
  defeatText: `The other Sprites make off with the treasure, laughing and jeering. Not very polite.`,
  battlefieldSize: [5, 5],
  getFoes: ((args) => getEncounterFoes({
    ...args,
    characterClasses: [CHC.RAIDER, CHC.JAVALIN],
    quantity: (Object.keys(args.accounts).length)
  })),
  getObstacles: ((args) => getEncounterObstacles({
    ...args,
    obstacleKinds: [OBK.BOULDER],
    quantityA: 1,
    quantityB: 1
  }))
});

export default fallsHuntingParty;