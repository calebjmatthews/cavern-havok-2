import Encounter from "@server/models/encounter";
import getEncounterFoes from "@server/functions/battleLogic/getEncounterFoes";
import { CHARACTER_CLASSES, OBSTACLE_KINDS } from "@common/enums";
import { ENCOUNTERS } from "@server/enums";
import getEncounterObstacles from "@server/functions/battleLogic/getEncounterObstacles";
const CHC = CHARACTER_CLASSES;
const OBK = OBSTACLE_KINDS;

const bubblesAndBoulders = new Encounter({
  id: ENCOUNTERS.BUBBLES_AND_BOULDERS,
  getIntroText: (() => `You're attacked by a rowdy mixture of bubbles and boulder moles.`),
  victoryText: 'The bubbles and moles run away, squabbling among themselves.',
  defeatText: `You've been defeated by the power of many spherical things.`,
  battlefieldSize: [5, 5],
  getFoes: ((args) => getEncounterFoes({
    ...args,
    characterClasses: [CHC.BUBBLE, CHC.BOULDER_MOLE],
    quantity: (Object.keys(args.accounts).length + 2)
  })),
  getObstacles: ((args) => getEncounterObstacles({
    ...args,
    obstacleKinds: [OBK.BOULDER],
    quantityA: 1,
    quantityB: 1
  }))
});

export default bubblesAndBoulders;