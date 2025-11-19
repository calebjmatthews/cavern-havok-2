import Encounter from "@server/models/encounter";
import getEncounterFoes from "@server/functions/battleLogic/getEncounterFoes";
import { CHARACTER_CLASSES, OBSTACLE_KINDS } from "@common/enums";
import { ENCOUNTERS } from "@server/enums";
import getEncounterObstacles from "@server/functions/battleLogic/getEncounterObstacles";
const CHC = CHARACTER_CLASSES;
const OBK = OBSTACLE_KINDS;

const flyingSnakeBall = new Encounter({
  id: ENCOUNTERS.FLYING_SNAKE_BALL,
  type: 'battle',
  getIntroText: (() => `A writhing ball of flying snakes hovers and bobs ahead of you. How indecent.`),
  victoryText: `The flying snakes disentangle and flap away into the distance.`,
  defeatText: `You've been bitten, headbonked, and submitted to sights no one should have to see. That's enough.`,
  battlefieldSize: [5, 5],
  getFoes: ((args) => getEncounterFoes({
    ...args,
    characterClasses: [CHC.FLYING_SNAKE],
    quantity: (Object.keys(args.accounts).length + 3)
  })),
  getObstacles: ((args) => getEncounterObstacles({
    ...args,
    obstacleKinds: [OBK.BOULDER],
    quantityA: 1,
    quantityB: 1
  }))
});

export default flyingSnakeBall;